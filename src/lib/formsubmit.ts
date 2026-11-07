export type FormSubmitResult = {
  sent: boolean;
  reason?: "activate" | "rejected";
  message: string;
};

function isSuccess(value: unknown) {
  return value === true || value === "true";
}

export function interpretFormSubmit(data: unknown): FormSubmitResult {
  const payload = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const message = String(payload.message || payload.error || "");
  if (isSuccess(payload.success)) {
    return { sent: true, message: message || "sent" };
  }
  const lower = message.toLowerCase();
  if (
    lower.includes("activat") ||
    lower.includes("actived") ||
    lower.includes("confirm your email") ||
    lower.includes("confirmation")
  ) {
    return {
      sent: false,
      reason: "activate",
      message: "فتح الإيميل (حتى السبام) واضغط Activate Form، من بعد عاود الاختبار.",
    };
  }
  return {
    sent: false,
    reason: "rejected",
    message: message || "ما تصيفطش الإيميل.",
  };
}

export async function postFormSubmit(
  email: string,
  fields: Record<string, string>,
  origin: string,
): Promise<FormSubmitResult> {
  const body = {
    _captcha: "false",
    _template: "box",
    _url: origin,
    ...fields,
  };

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: origin,
      Referer: `${origin}/`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  if (!data) return { sent: false, reason: "rejected", message: "ما قدرناش نوصلو لخدمة الإيميل." };
  return interpretFormSubmit(data);
}
