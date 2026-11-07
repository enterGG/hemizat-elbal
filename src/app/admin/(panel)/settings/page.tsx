"use client";

import { postFormSubmit } from "@/lib/formsubmit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type SettingsForm = {
  storeName: string;
  tagline: string;
  logoUrl: string;
  ownerEmail: string;
  ownerPhone: string;
  adminPassword: string;
};

const empty: SettingsForm = {
  storeName: "",
  tagline: "",
  logoUrl: "/branding/logo.jpg",
  ownerEmail: "",
  ownerPhone: "",
  adminPassword: "",
};

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<SettingsForm>(empty);
  const [saved, setSaved] = useState("");
  const [uploading, setUploading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => data.settings && setForm({ ...empty, ...data.settings, adminPassword: "" }));
  }, []);

  async function uploadLogo(files: FileList | null) {
    if (!files?.[0]) return;
    setUploading(true);
    setSaved("");
    const data = new FormData();
    data.append("files", files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    setUploading(false);
    if (!res.ok || !json.urls?.[0]) {
      setSaved("ما ترفعاتش التصويرة.");
      return;
    }
    const logoUrl = json.urls[0] as string;
    setForm((current) => ({ ...current, logoUrl }));
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logoUrl }),
    });
    router.refresh();
    setSaved("تحفظ اللوغو.");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeName: form.storeName,
        tagline: form.tagline,
        logoUrl: form.logoUrl,
        ownerEmail: form.ownerEmail,
        ownerPhone: form.ownerPhone,
        whatsapp: form.ownerPhone,
        adminPassword: form.adminPassword,
      }),
    });
    setSaved(res.ok ? "تحفظات الإعدادات." : "ما تحفظاتش.");
    if (res.ok) router.refresh();
  }

  async function testNotify() {
    setTesting(true);
    setSaved("");
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerEmail: form.ownerEmail,
        ownerPhone: form.ownerPhone,
        whatsapp: form.ownerPhone,
      }),
    });

    let emailOk = false;
    let emailNote = "";
    if (form.ownerEmail.trim()) {
      const emailResult = await postFormSubmit(
        form.ownerEmail.trim(),
        {
          _subject: "اختبار إشعار هميزات البال",
          name: "هميزات البال",
          email: form.ownerEmail.trim(),
          message: "هاد إشعار تجريبي. إلا وصلك، الإيميل خدام وكوموند الزبناء غادي تجيك هنا.",
        },
        window.location.origin,
      );
      emailOk = emailResult.sent;
      emailNote = emailResult.message;
    }

    const res = await fetch("/api/notify/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "phone" }),
    });
    const data = await res.json();
    setTesting(false);
    if (!res.ok) {
      setSaved(emailNote || "ما قدرناش نصيفطو الاختبار.");
      return;
    }
    const phoneOk = data.notify?.phone?.sent;
    const phoneNote = data.notify?.phone?.error || "";
    if (emailOk && phoneOk) setSaved("توصل الإيميل، وتوصلات نوتيفيكاسيون فالتليفون.");
    else if (emailOk) setSaved(`توصل الإيميل. التليفون: ${phoneNote || "ما وصلاتش النوتيفيكاسيون دابا."}`);
    else if (phoneOk) setSaved(`توصلات نوتيفيكاسيون فالتليفون. الإيميل: ${emailNote || "ما تصيفطش."}`);
    else setSaved(emailNote || phoneNote || "دخل الإيميل والنمرة وصيفط الاختبار مرة أخرى.");
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">SETTINGS</p>
        <h1 className="mt-2 text-4xl font-extrabold">إعدادات الستور</h1>
      </div>
      <section className="card grid gap-4 p-6 md:grid-cols-2">
        <label className="space-y-2 md:col-span-2">
          <span>اسم الستور</span>
          <input className="field" value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span>العبارة</span>
          <input className="field" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
        </label>
        <div className="space-y-3 md:col-span-2">
          <span className="block">لوغو الستور</span>
          <p className="text-sm text-muted">زيد تصويرة PNG، JPG أو WEBP. كتحل بلاصة السمية فالهيدر والفوتر.</p>
          <div className="flex flex-wrap items-center gap-5">
            <div className="rounded-2xl border border-[var(--line)] bg-black p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logoUrl || "/branding/logo.jpg"} alt="اللوغو الحالي" className="h-24 w-auto max-w-[220px] object-contain" />
            </div>
            <label className="gold-btn cursor-pointer rounded-full px-5 py-2.5">
              {uploading ? "كنرفعو..." : "بدّل اللوغو"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => uploadLogo(e.target.files)}
              />
            </label>
          </div>
        </div>
      </section>

      <section className="card space-y-5 p-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-gold">ALERTES</p>
          <h2 className="mt-2 text-2xl font-bold">إشعارات المبيعات</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            دخل الإيميل ونمرة التليفون. ملي كيدوز الزبون كوموند، كيجيك إيميل فيه السمية والنمرة والمدينة والقطعة، ونوتيفيكاسيون فالتليفون. أول اختبار كيصيفط ليك إيميل تفعيل: حلّو واضغط Activate Form، من بعد عاود الاختبار.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span>الإيميل</span>
            <input
              className="field"
              type="email"
              dir="ltr"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
              placeholder="you@email.com"
            />
          </label>
          <label className="space-y-2">
            <span>نمرة التليفون</span>
            <input
              className="field"
              dir="ltr"
              value={form.ownerPhone}
              onChange={(e) => setForm({ ...form, ownerPhone: e.target.value })}
              placeholder="06xxxxxxxx"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={testNotify}
          disabled={testing}
          className="rounded-full border border-[var(--line)] px-5 py-2.5 text-sm hover:border-gold"
        >
          {testing ? "كنصيفطو الاختبار..." : "صيفط إشعار تجريبي"}
        </button>
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-xl font-bold">رمز الإدارة</h2>
        <input
          className="field"
          type="password"
          value={form.adminPassword}
          onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
          placeholder="خلي فارغ إلا ما بغيتيش تبدّل"
        />
      </section>

      {saved ? <p className="text-gold">{saved}</p> : null}
      <button className="gold-btn rounded-full px-8 py-3">حفظ الإعدادات</button>
    </form>
  );
}
