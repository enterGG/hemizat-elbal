export const CITIES = [
  "الدار البيضاء",
  "الرباط",
  "سلا",
  "تمارة",
  "مراكش",
  "فاس",
  "طنجة",
  "أكادير",
  "مكناس",
  "وجدة",
  "القنيطرة",
  "تطوان",
  "المحمدية",
  "الجديدة",
  "آسفي",
  "الناظور",
  "خريبكة",
  "بني ملال",
  "تازة",
  "سطات",
  "العرائش",
  "القصر الكبير",
  "الحسيمة",
  "ورزازات",
  "العيون",
  "الداخلة",
  "بركان",
  "تاوريرت",
  "إنزكان",
  "مدينة أخرى",
];

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} د.م.`;
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("ar-MA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function isValidMoroccanPhone(phone: string) {
  const digits = phone.replace(/\s|-/g, "");
  return /^(?:\+212|00212|0)[5-8]\d{8}$/.test(digits);
}

export function normalizePhone(phone: string) {
  const digits = phone.replace(/\s|-/g, "");
  if (digits.startsWith("+212")) return `0${digits.slice(4)}`;
  if (digits.startsWith("00212")) return `0${digits.slice(5)}`;
  return digits;
}

export function toInternationalPhone(phone: string) {
  const local = normalizePhone(phone);
  if (local.startsWith("0")) return `212${local.slice(1)}`;
  return local.replace(/^\+/, "").replace(/^00/, "");
}

export function youtubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
  );
  return match?.[1] ?? null;
}

export function toYoutubeEmbed(url: string) {
  const id = youtubeId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}
