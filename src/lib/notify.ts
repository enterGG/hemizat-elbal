import { postFormSubmit } from "./formsubmit";
import { formatPrice, toInternationalPhone } from "./format";
import type { Order, Settings } from "./types";

export type NotifyChannelResult = {
  sent: boolean;
  error: string;
  reason?: string;
};

export type NotifyResult = {
  email: NotifyChannelResult;
  phone: NotifyChannelResult;
};

function publicOrigin() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "https://hemizat-elbal.vercel.app";
}

function orderMessage(order: Order, settings: Settings) {
  return [
    `كوموند جديدة من ${settings.storeName}`,
    `الزبون: ${order.customer.name}`,
    `الهاتف: ${order.customer.phone}`,
    `المدينة: ${order.customer.city}`,
    `المنتوج: ${order.productName}`,
    `الثمن: ${formatPrice(order.price)}`,
    order.number ? `رقم الطلب: ${order.number}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function orderHtml(order: Order, settings: Settings) {
  return `
    <div style="font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right;background:#070707;color:#f6f0e6;padding:24px">
      <h1 style="color:#d4af6d;font-size:22px;margin:0 0 8px">كوموند جديدة</h1>
      <p style="margin:0 0 20px;color:#c5bbae">${settings.storeName}</p>
      <table style="width:100%;border-collapse:collapse;background:#121212;border:1px solid rgba(212,175,109,.3)">
        ${row("المنتوج", order.productName)}
        ${row("الثمن", formatPrice(order.price))}
        ${row("الزبون", order.customer.name)}
        ${row("الهاتف", order.customer.phone)}
        ${row("المدينة", order.customer.city)}
        ${order.number ? row("رقم الطلب", order.number) : ""}
      </table>
    </div>
  `;
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:12px 16px;border-bottom:1px solid rgba(212,175,109,.15);color:#9c9488">${label}</td>
    <td style="padding:12px 16px;border-bottom:1px solid rgba(212,175,109,.15);color:#f6f0e6;font-weight:700">${value}</td>
  </tr>`;
}

async function withTimeout<T>(promise: Promise<T>, ms = 20000) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

async function sendEmail(settings: Settings, order: Order) {
  const email = settings.ownerEmail.trim();
  if (!email) return { sent: false as const, reason: "no-email", message: "ما كاينش إيميل." };

  if (settings.smtp.host && settings.smtp.user && settings.smtp.pass) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: settings.smtp.host,
      port: settings.smtp.port || 587,
      secure: settings.smtp.port === 465,
      auth: { user: settings.smtp.user, pass: settings.smtp.pass },
    });
    await transporter.sendMail({
      from: settings.smtp.from || settings.smtp.user,
      to: email,
      subject: `كوموند جديدة — ${order.productName}`,
      text: orderMessage(order, settings),
      html: orderHtml(order, settings),
    });
    return { sent: true as const, reason: "smtp", message: "smtp" };
  }

  const result = await postFormSubmit(
    email,
    {
      _subject: `كوموند جديدة — ${order.productName}`,
      name: order.customer.name,
      email,
      message: orderMessage(order, settings),
      html: orderHtml(order, settings),
      المنتوج: order.productName,
      الثمن: formatPrice(order.price),
      الزبون: order.customer.name,
      الهاتف: order.customer.phone,
      المدينة: order.customer.city,
    },
    publicOrigin(),
  );

  if (result.sent) return { sent: true as const, reason: "formsubmit", message: result.message };
  return { sent: false as const, reason: result.reason || "rejected", message: result.message };
}

async function sendSms(phone: string, text: string) {
  const variants = [`+${phone}`, phone];
  let lastError = "sms";
  for (const candidate of variants) {
    const res = await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: candidate,
        message: text,
        key: process.env.TEXTBELT_KEY || "textbelt",
      }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    if (data.success) return { sent: true as const, via: "sms" as const };
    lastError = data.error || "sms";
  }
  throw new Error(lastError);
}

async function sendPhone(settings: Settings, order: Order) {
  const raw = (settings.ownerPhone || settings.whatsapp || "").trim();
  if (!raw) return { sent: false as const, reason: "no-phone", message: "ما كايناش نمرة." };

  const intl = toInternationalPhone(raw);
  const text = orderMessage(order, settings);

  if (settings.callmebotKey) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${intl}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(settings.callmebotKey)}`;
    const res = await fetch(url);
    if (res.ok) return { sent: true as const, reason: "whatsapp", message: "whatsapp" };
  }

  try {
    await sendSms(intl, text);
    return { sent: true as const, reason: "sms", message: "sms" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "phone-failed";
    if (settings.webhookUrl) {
      const res = await fetch(settings.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "new_order", phone: intl, message: text, order }),
      });
      if (res.ok) return { sent: true as const, reason: "webhook", message: "webhook" };
    }
    throw new Error(message);
  }
}

function phoneErrorMessage(error: string) {
  const lower = error.toLowerCase();
  if (lower.includes("quota") || lower.includes("out of")) {
    return "حد الرسائل المجانية سالا اليوم. عاود غدا، والإيميل يبقى خدام.";
  }
  if (lower.includes("disabled") || lower.includes("country")) {
    return "هاد النمرة ما قبلاتش الرسالة من الخدمة المجانية.";
  }
  return error || "ما تصيفطاتش للنمرة.";
}

export async function notifyOwner(settings: Settings, order: Order): Promise<NotifyResult> {
  const [emailSettled, phoneSettled] = await Promise.allSettled([
    withTimeout(sendEmail(settings, order)),
    withTimeout(sendPhone(settings, order)),
  ]);

  const email: NotifyChannelResult = { sent: false, error: "" };
  if (emailSettled.status === "fulfilled") {
    email.sent = emailSettled.value.sent;
    email.reason = emailSettled.value.reason;
    email.error = emailSettled.value.sent ? "" : emailSettled.value.message;
  } else {
    email.error = emailSettled.reason instanceof Error ? emailSettled.reason.message : "email-failed";
  }

  const phone: NotifyChannelResult = { sent: false, error: "" };
  if (phoneSettled.status === "fulfilled") {
    phone.sent = phoneSettled.value.sent;
    phone.reason = phoneSettled.value.reason;
    phone.error = phoneSettled.value.sent ? "" : phoneSettled.value.message;
  } else {
    const raw = phoneSettled.reason instanceof Error ? phoneSettled.reason.message : "phone-failed";
    phone.error = phoneErrorMessage(raw);
  }

  return { email, phone };
}
