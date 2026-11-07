"use client";

import { generateSeo, slugify } from "@/lib/seo";
import type { Category, MediaImage, MediaVideo, Product, SeoFields } from "@/lib/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type FormState = {
  category: Category;
  name: string;
  brand: string;
  model: string;
  size: string;
  condition: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  description: string;
  images: MediaImage[];
  videos: MediaVideo[];
  youtube: string;
  seo: SeoFields;
  status: "active" | "draft";
};

function fromProduct(product?: Product): FormState {
  return {
    category: product?.category || "sneakers",
    name: product?.name || "",
    brand: product?.brand || "",
    model: product?.model || "",
    size: product?.size || "",
    condition: product?.condition || "",
    price: product ? String(product.price) : "",
    compareAtPrice: product?.compareAtPrice ? String(product.compareAtPrice) : "",
    stock: product ? String(product.stock) : "1",
    description: product?.description || "",
    images: product?.images || [],
    videos: product?.videos || [],
    youtube: "",
    seo: product?.seo || { title: "", description: "", keywords: "" },
    status: product?.status === "draft" ? "draft" : "active",
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => fromProduct(product));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const autoSeo = useMemo(
    () =>
      generateSeo({
        name: form.name,
        brand: form.brand,
        model: form.model,
        size: form.size,
        condition: form.condition,
        category: form.category,
        description: form.description,
      }),
    [form.name, form.brand, form.model, form.size, form.condition, form.category, form.description],
  );

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function upload(files: FileList | null, kind: "image" | "video") {
    if (!files?.length) return;
    const data = new FormData();
    Array.from(files).forEach((file) => data.append("files", file));
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (!res.ok) return setError("ما قدرناش نرفعو الملفات.");
    if (kind === "image") {
      set(
        "images",
        [
          ...form.images,
          ...json.urls.map((url: string, index: number) => ({
            url,
            alt: `${form.name || "قطعة"} — صورة ${form.images.length + index + 1}`,
          })),
        ],
      );
    } else {
      set("videos", [...form.videos, ...json.urls.map((url: string) => ({ url, kind: "file" as const }))]);
    }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      category: form.category,
      name: form.name,
      brand: form.brand,
      model: form.model,
      size: form.size,
      condition: form.condition,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock),
      description: form.description,
      images: form.images,
      videos: form.videos,
      status: form.status,
      slug: slugify(form.name || form.model),
      seo: form.seo.title ? form.seo : autoSeo,
    };
    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      setError("ما تسجلاتش القطعة. تأكد من المعلومات.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span>النوع</span>
          <select className="field" value={form.category} onChange={(e) => set("category", e.target.value as Category)}>
            <option value="sneakers">سبرديل</option>
            <option value="bags">ساك</option>
          </select>
        </label>
        <label className="space-y-2">
          <span>الحالة في الموقع</span>
          <select className="field" value={form.status} onChange={(e) => set("status", e.target.value as "active" | "draft")}>
            <option value="active">معروض</option>
            <option value="draft">مسودة</option>
          </select>
        </label>
        <label className="space-y-2">
          <span>اسم القطعة</span>
          <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </label>
        <label className="space-y-2">
          <span>الماركة</span>
          <input className="field" value={form.brand} onChange={(e) => set("brand", e.target.value)} required />
        </label>
        <label className="space-y-2">
          <span>الموديل</span>
          <input className="field" value={form.model} onChange={(e) => set("model", e.target.value)} />
        </label>
        <label className="space-y-2">
          <span>المقاس / القياس</span>
          <input className="field" value={form.size} onChange={(e) => set("size", e.target.value)} placeholder="42 EU أو MM" />
        </label>
        <label className="space-y-2">
          <span>الحالة</span>
          <input className="field" value={form.condition} onChange={(e) => set("condition", e.target.value)} placeholder="8.5/10 — استعمال خفيف" />
        </label>
        <label className="space-y-2">
          <span>الستوك</span>
          <input className="field" type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </label>
        <label className="space-y-2">
          <span>الثمن (د.م.)</span>
          <input className="field" type="number" min={0} value={form.price} onChange={(e) => set("price", e.target.value)} required />
        </label>
        <label className="space-y-2">
          <span>الثمن قبل التخفيض (اختياري)</span>
          <input className="field" type="number" min={0} value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} />
        </label>
      </div>

      <label className="block space-y-2">
        <span>الوصف</span>
        <textarea className="field min-h-36" value={form.description} onChange={(e) => set("description", e.target.value)} />
      </label>

      <section className="card space-y-4 p-5">
        <h2 className="text-xl font-bold">التصاور</h2>
        <input type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files, "image")} />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {form.images.map((image, index) => (
            <div key={image.url + index} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.alt} className="aspect-[4/3] w-full object-cover" />
              <button
                type="button"
                className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs"
                onClick={() => set("images", form.images.filter((_, i) => i !== index))}
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="card space-y-4 p-5">
        <h2 className="text-xl font-bold">الفيديوهات</h2>
        <div className="flex gap-2">
          <input
            className="field"
            value={form.youtube}
            onChange={(e) => set("youtube", e.target.value)}
            placeholder="رابط يوتيوب"
          />
          <button
            type="button"
            className="rounded-full border border-[var(--line)] px-4"
            onClick={() => {
              if (!form.youtube.trim()) return;
              set("videos", [...form.videos, { url: form.youtube.trim(), kind: "youtube" }]);
              set("youtube", "");
            }}
          >
            زيد
          </button>
        </div>
        <input type="file" accept="video/*" multiple onChange={(e) => upload(e.target.files, "video")} />
        <ul className="space-y-2 text-sm">
          {form.videos.map((video, index) => (
            <li key={video.url + index} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
              <span className="truncate">{video.kind === "youtube" ? "يوتيوب: " : "ملف: "}{video.url}</span>
              <button type="button" onClick={() => set("videos", form.videos.filter((_, i) => i !== index))}>
                حذف
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">السيو الأوتوماتيكي</h2>
          <button type="button" className="text-sm text-gold" onClick={() => set("seo", autoSeo)}>
            ملء المعلومات أوتوماتيكياً
          </button>
        </div>
        <p className="text-sm text-muted">
          كل ما تزيد الاسم، الماركة والموديل، السيو كيتبنى بوحدو: العنوان، الوصف، والكلمات المفتاحية. تقدر تعدّل يدوي.
        </p>
        <label className="block space-y-2">
          <span>عنوان الصفحة</span>
          <input className="field" value={form.seo.title || autoSeo.title} onChange={(e) => set("seo", { ...form.seo, title: e.target.value })} />
        </label>
        <label className="block space-y-2">
          <span>وصف محركات البحث</span>
          <textarea className="field min-h-24" value={form.seo.description || autoSeo.description} onChange={(e) => set("seo", { ...form.seo, description: e.target.value })} />
        </label>
        <label className="block space-y-2">
          <span>الكلمات المفتاحية</span>
          <input className="field" value={form.seo.keywords || autoSeo.keywords} onChange={(e) => set("seo", { ...form.seo, keywords: e.target.value })} />
        </label>
      </section>

      {error ? <p className="text-[var(--danger)]">{error}</p> : null}
      <button className="gold-btn rounded-full px-8 py-3" disabled={saving}>
        {saving ? "كنحفظو..." : product ? "حفظ التعديلات" : "إضافة القطعة"}
      </button>
    </form>
  );
}
