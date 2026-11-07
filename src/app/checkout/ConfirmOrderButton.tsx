"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ConfirmOrderButton({
  productId,
  customer,
}: {
  productId: string;
  customer: { name: string; phone: string; city: string };
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, customer }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "وقع خطأ أثناء تأكيد الطلب.");
      return;
    }
    router.push(`/order-success?number=${encodeURIComponent(data.order.number)}`);
  }

  return (
    <div className="space-y-3">
      {error ? <p className="text-[var(--danger)]">{error}</p> : null}
      <button type="button" onClick={confirm} disabled={loading} className="gold-btn w-full rounded-full py-3">
        {loading ? "كنسجلو الطلب..." : "أكد الطلب"}
      </button>
    </div>
  );
}
