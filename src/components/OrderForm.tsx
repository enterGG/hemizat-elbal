"use client";

import { CITIES, isValidMoroccanPhone } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderForm({
  productId,
  productName,
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

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const chosenCity = city === "مدينة أخرى" ? otherCity.trim() : city;
    if (name.trim().length < 2) return setError("كتب الاسم الكامل.");
    if (!isValidMoroccanPhone(phone)) return setError("رقم الهاتف المغربي غير صحيح.");
    if (!chosenCity) return setError("اختار المدينة.");
    const params = new URLSearchParams({
      productId,
      name: name.trim(),
      phone: phone.trim(),
      city: chosenCity,
    });
    try {
      sessionStorage.setItem(
        "hemizat-checkout",
        JSON.stringify({
          productId,
          productName,
          customer: { name: name.trim(), phone: phone.trim(), city: chosenCity },
        }),
      );
    } catch {
      /* ignore */
    }
    router.push(`/checkout?${params.toString()}`);
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
        <p className="mt-1 text-sm text-muted">
          عمّر الاسم، رقم الهاتف والمدينة. من بعد غادي نأكدو الطلب فالتشيك أوت.
        </p>
      </div>
      <label className="block space-y-2">
        <span>الاسم</span>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" />
      </label>
      <label className="block space-y-2">
        <span>رقم الهاتف</span>
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
      <button type="submit" className="gold-btn w-full rounded-full py-3">
        إتمام الطلب
      </button>
    </form>
  );
}
