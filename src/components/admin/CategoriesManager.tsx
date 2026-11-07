"use client";

import type { CategoryStyle, StoreCategory } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

const shapes: { id: CategoryStyle["shape"]; label: string }[] = [
  { id: "square", label: "مربع" },
  { id: "rectangle", label: "مستطيل" },
  { id: "triangle", label: "مثلث" },
  { id: "star", label: "نجمة" },
  { id: "circle", label: "دائرة" },
  { id: "hexagon", label: "سداسي" },
];

const corners: { id: CategoryStyle["corners"]; label: string }[] = [
  { id: "sharp", label: "حادة" },
  { id: "rounded", label: "مدورة" },
  { id: "soft", label: "مضببة" },
];

const glows: { id: CategoryStyle["glow"]; label: string }[] = [
  { id: "off", label: "بلا ضوء" },
  { id: "soft", label: "ذهبي خفيف" },
  { id: "strong", label: "شاعل" },
];

const frames: { id: CategoryStyle["frame"]; label: string }[] = [
  { id: "none", label: "بلا إطار" },
  { id: "gold", label: "ذهبي" },
  { id: "double", label: "مزدوج" },
];

type Draft = {
  name: string;
  description: string;
  logoUrl: string;
  imageUrl: string;
};

const emptyDraft: Draft = { name: "", description: "", logoUrl: "", imageUrl: "" };

export default function CategoriesManager({
  initialCategories,
  initialStyle,
}: {
  initialCategories: StoreCategory[];
  initialStyle: CategoryStyle;
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [style, setStyle] = useState(initialStyle);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const previewClass = useMemo(() => {
    const shape =
      style.shape === "triangle"
        ? "cat-clip-triangle"
        : style.shape === "star"
          ? "cat-clip-star"
          : style.shape === "circle"
            ? "cat-clip-circle"
            : style.shape === "hexagon"
              ? "cat-clip-hex"
              : "";
    const round =
      style.shape === "square" || style.shape === "rectangle"
        ? style.corners === "sharp"
          ? "rounded-none"
          : style.corners === "soft"
            ? "rounded-[1.4rem]"
            : "rounded-xl"
        : "";
    const glow = style.glow === "strong" ? "cat-glow-strong" : style.glow === "soft" ? "cat-glow-soft" : "";
    const size = style.shape === "rectangle" ? "h-16 w-24" : "h-16 w-16";
    return `${size} ${shape} ${round} ${glow} ${style.frame !== "none" ? "bg-gold p-[2px]" : "bg-black"}`;
  }, [style]);

  async function persistStyle(next: CategoryStyle) {
    setStyle(next);
    setMessage("");
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryStyle: next }),
    });
    setMessage(res.ok ? "تحفظ شكل التصنيفات." : "ما تحفظش الشكل.");
    if (res.ok) router.refresh();
  }

  async function upload(files: FileList | null, target: "logoUrl" | "imageUrl", id?: string) {
    if (!files?.[0]) return;
    const data = new FormData();
    data.append("files", files[0]);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok || !json.urls?.[0]) {
      setMessage("ما ترفعاتش التصويرة.");
      return;
    }
    const url = json.urls[0] as string;
    if (id) {
      const current = categories.find((item) => item.id === id);
      if (!current) return;
      await saveCategory(id, { ...current, [target]: url });
    } else {
      setDraft((value) => ({ ...value, [target]: url }));
    }
  }

  async function addCategory(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setMessage(json.error || "ما تزادش التصنيف.");
      return;
    }
    setCategories((current) => [...current, json.category]);
    setDraft(emptyDraft);
    setMessage("تزاد التصنيف، وبان حدا الجوج اللي كاينين.");
    router.refresh();
  }

  async function saveCategory(id: string, payload: Partial<StoreCategory>) {
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || "ما تحفظاتش.");
      return;
    }
    setCategories((current) => current.map((item) => (item.id === id ? json.category : item)));
    setEditingId(null);
    setMessage("تحفظ التصنيف.");
    router.refresh();
  }

  async function removeCategory(id: string) {
    if (!window.confirm("بغيت تحيد هاد التصنيف؟")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error || "ما تحيدش.");
      return;
    }
    setCategories((current) => current.filter((item) => item.id !== id));
    setMessage("تحيّد التصنيف.");
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section className="card space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">شكل البطاقات</h2>
            <p className="mt-1 text-sm text-muted">هاد الإعداد كيطبق على كل التصنيفات فالصفحة الرئيسية.</p>
          </div>
          <div className={previewClass}>
            <div className="h-full w-full bg-[linear-gradient(135deg,#2a2318,#111)]" />
          </div>
        </div>
        <ChoiceRow label="الشكل" options={shapes} value={style.shape} onChange={(shape) => persistStyle({ ...style, shape })} />
        <ChoiceRow label="الحواف" options={corners} value={style.corners} onChange={(corners) => persistStyle({ ...style, corners })} />
        <ChoiceRow label="الضوء" options={glows} value={style.glow} onChange={(glow) => persistStyle({ ...style, glow })} />
        <ChoiceRow label="الإطار" options={frames} value={style.frame} onChange={(frame) => persistStyle({ ...style, frame })} />
      </section>

      <section className="card space-y-5 p-5">
        <div>
          <h2 className="text-xl font-bold">زيد تصنيف جديد</h2>
          <p className="mt-1 text-sm text-muted">كيتزاد حدا السبرديلات والسيكان، ويتم من اليمين لليسار.</p>
        </div>
        <form onSubmit={addCategory} className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span>السمية</span>
            <input className="field" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required placeholder="مثلاً الساعات" />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span>الوصف</span>
            <textarea className="field min-h-24" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </label>
          <UploadField label="اللوغو" url={draft.logoUrl} onFiles={(files) => upload(files, "logoUrl")} />
          <UploadField label="صورة الغلاف" url={draft.imageUrl} onFiles={(files) => upload(files, "imageUrl")} />
          <div className="md:col-span-2">
            <button className="gold-btn rounded-full px-8 py-3" disabled={saving}>
              {saving ? "كنزيدو..." : "زيد التصنيف"}
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">التصنيفات الحالية</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <article key={category.id} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-black">
                {category.imageUrl || category.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={category.imageUrl || category.logoUrl} alt={category.name} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="space-y-3 p-4">
                {editingId === category.id ? (
                  <EditRow
                    category={category}
                    onCancel={() => setEditingId(null)}
                    onSave={(payload) => saveCategory(category.id, payload)}
                    onUpload={(files, target) => upload(files, target, category.id)}
                  />
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      {category.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={category.logoUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : null}
                      <div>
                        <h3 className="font-bold">{category.name}</h3>
                        <p className="line-clamp-2 text-sm text-muted">{category.description || "بلا وصف"}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-sm">
                      <button type="button" className="text-gold" onClick={() => setEditingId(category.id)}>
                        تعديل
                      </button>
                      <button type="button" className="text-[var(--danger)]" onClick={() => removeCategory(category.id)}>
                        حذف
                      </button>
                    </div>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {message ? <p className="text-sm text-gold">{message}</p> : null}
    </div>
  );
}

function ChoiceRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`rounded-full px-4 py-2 text-sm ${
              value === option.id ? "bg-gold text-[#1a140c]" : "border border-[var(--line)] text-cream/80 hover:border-gold"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function UploadField({
  label,
  url,
  onFiles,
}: {
  label: string;
  url: string;
  onFiles: (files: FileList | null) => void;
}) {
  return (
    <label className="space-y-2">
      <span>{label}</span>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="h-20 w-20 rounded-xl object-cover" />
      ) : null}
      <input type="file" accept="image/*" onChange={(e) => onFiles(e.target.files)} />
    </label>
  );
}

function EditRow({
  category,
  onCancel,
  onSave,
  onUpload,
}: {
  category: StoreCategory;
  onCancel: () => void;
  onSave: (payload: Partial<StoreCategory>) => void;
  onUpload: (files: FileList | null, target: "logoUrl" | "imageUrl") => void;
}) {
  const [name, setName] = useState(category.name);
  const [description, setDescription] = useState(category.description);

  return (
    <div className="space-y-3">
      <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
      <textarea className="field min-h-20" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-2">
        <UploadField label="اللوغو" url={category.logoUrl} onFiles={(files) => onUpload(files, "logoUrl")} />
        <UploadField label="صورة الغلاف" url={category.imageUrl} onFiles={(files) => onUpload(files, "imageUrl")} />
      </div>
      <div className="flex gap-3">
        <button type="button" className="gold-btn rounded-full px-5 py-2" onClick={() => onSave({ name, description })}>
          حفظ
        </button>
        <button type="button" className="text-sm text-muted" onClick={onCancel}>
          إلغاء
        </button>
      </div>
    </div>
  );
}
