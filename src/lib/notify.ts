import { formatPrice, toInternationalPhone } from "./format";
import type { Order, Settings } from "./types";

function orderMessage(order: Order, settings: Settings) {
  return [
    `وصلتاتك مبيعة من ${settings.storeName}`,
    `رقم الطلب: ${order.number}`,
    `الزبون: ${order.customer.name}`,
    `الهاتف: ${order.customer.phone}`,
    `المدينة: ${order.customer.city}`,
    `المنتوج: ${order.productName}`,
    `الثمن: ${formatPrice(order.price)}`,
  ].join("\n");
}

function orderHtml(order: Order, settings: Settings) {
  return `
    <div style="font-family:Tahoma,Arial,sans-serif;direction:rtl;text-align:right;background:#070707;color:#f6f0e6;padding:24px">
      <h1 style="color:#d4af6d;font-size:22px;margin:0 0 8px">وصلتاتك مبيعة</h1>
      <p style="margin:0 0 20px;color:#c5bbae">نوتيفيكاسيون أوتوماتيك من السيستيم ديال ${settings.storeName}</p>
      <table style="width:100%;border-collapse:collapse;background:#121212;border:1px solid rgba(212,175,109,.3)">
        ${row("رقم الطلب", order.number)}
        ${row("المنتوج", order.productName)}
        ${row("الثمن", formatPrice(order.price))}
        ${row("الزبون", order.customer.name)}
        ${row("الهاتف", order.customer.phone)}
        ${row("المدينة", order.customer.city)}
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

async function withTimeout<T>(promise: Promise<T>, ms = 8000) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

async function sendEmail(settings: Settings, order: Order) {
  const email = settings.ownerEmail.trim();
  if (!email) return { sent: false as const, reason: "no-email" };

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
      subject: `مبيعة جديدة ${order.number} — ${order.productName}`,
      text: orderMessage(order, settings),
      html: orderHtml(order, settings),
    });
    return { sent: true as const, via: "smtp" as const };
  }

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      _subject: `مبيعة جديدة ${order.number} — ${settings.storeName}`,
      _template: "box",
      _captcha: "false",
      _replyto: email,
      message: orderMessage(order, settings),
      html: orderHtml(order, settings),
      "رقم الطلب": order.number,
      المنتوج: order.productName,
      الثمن: formatPrice(order.price),
      الزبون: order.customer.name,
      الهاتف: order.customer.phone,
      المدينة: order.customer.city,
    }),
  });
  if (!res.ok) throw new Error("email-failed");
  return { sent: true as const, via: "formsubmit" as const };
}

async function sendPhone(settings: Settings, order: Order) {
  const raw = (settings.ownerPhone || settings.whatsapp || "").trim();
  if (!raw) return { sent: false as const, reason: "no-phone" };

  const intl = toInternationalPhone(raw);
  const text = orderMessage(order, settings);
  const errors: string[] = [];

  if (settings.callmebotKey) {
    try {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${intl}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(settings.callmebotKey)}`;
      const res = await fetch(url);
      if (res.ok) return { sent: true as const, via: "whatsapp" as const };
      errors.push("whatsapp");
    } catch {
      errors.push("whatsapp");
    }
  }

  try {
    const res = await fetch("https://textbelt.com/text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: `+${intl}`,
        message: text,
        key: process.env.TEXTBELT_KEY || "textbelt",
      }),
    });
    const data = (await res.json()) as { success?: boolean };
    if (data.success) return { sent: true as const, via: "sms" as const };
    errors.push("sms");
  } catch {
    errors.push("sms");
  }

  if (settings.webhookUrl) {
    const res = await fetch(settings.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "new_order", phone: intl, message: text, order }),
    });
    if (res.ok) return { sent: true as const, via: "webhook" as const };
  }

  throw new Error(errors.join(",") || "phone-failed");
}

export async function notifyOwner(settings: Settings, order: Order) {
  const results = {
    email: { sent: false, error: "" },
    phone: { sent: false, error: "" },
  };

  try {
    const email = await withTimeout(sendEmail(settings, order));
    results.email.sent = email.sent;
    if (!email.sent) results.email.error = "no-email";
  } catch (error) {
    results.email.error = error instanceof Error ? error.message : "email-failed";
  }

  try {
    const phone = await withTimeout(sendPhone(settings, order));
    results.phone.sent = phone.sent;
    if (!phone.sent) results.phone.error = "no-phone";
  } catch (error) {
    results.phone.error = error instanceof Error ? error.message : "phone-failed";
  }

  return results;
}
