"use client";

import { CITIES, isValidMoroccanPhone } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderForm({
  productId,
  inStock,
}: {
  productId: string;
  productName: string;
  inStock: boolean;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [otherCity, setOtherCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const chosenCity = city === "مدينة أخرى" ? otherCity.trim() : city;
    if (name.trim().length < 2) return setError("كتب الاسم الكامل.");
    if (!isValidMoroccanPhone(phone)) return setError("رقم الهاتف المغربي غير صحيح.");
    if (!chosenCity) return setError("اختار المدينة.");

    setLoading(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        customer: { name: name.trim(), phone: phone.trim(), city: chosenCity },
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "ما تسجلاتش الكوموند. عاود من بعد.");
      return;
    }

    const order = data.order as {
      productName: string;
      productImage?: string;
      price: number;
      customer: { name: string; city: string };
    };
    const params = new URLSearchParams({
      name: order.customer.name,
      city: order.customer.city,
      product: order.productName,
      price: String(order.price),
      image: order.productImage || "",
    });
    router.push(`/order-success?${params.toString()}`);
  }

  if (!inStock) {
    return (
      <div className="card p-6 text-center text-muted">
        هاد القطعة تقادات. شوف باقي الاختيارات فالسبرديلات والسيكان.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <div>
        <h2 className="text-xl font-bold">بغيت هاد القطعة</h2>
        <p className="mt-1 text-sm text-muted">كتب السمية، نمرة التليفون، واختار المدينة، ودير تم.</p>
      </div>
      <label className="block space-y-2">
        <span>السمية</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
      </label>
      <label className="block space-y-2">
        <span>نمرة التليفون</span>
        <input
          className="field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="06xxxxxxxx"
          inputMode="tel"
        />
      </label>
      <label className="block space-y-2">
        <span>المدينة</span>
        <select className="field" value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">اختار المدينة</option>
          {CITIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      {city === "مدينة أخرى" ? (
        <input
          className="field"
          value={otherCity}
          onChange={(e) => setOtherCity(e.target.value)}
          placeholder="كتب اسم المدينة"
        />
      ) : null}
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <button type="submit" className="gold-btn w-full rounded-full py-3" disabled={loading}>
        {loading ? "كنسجلو الكوموند..." : "تم"}
      </button>
    </form>
  );
}
