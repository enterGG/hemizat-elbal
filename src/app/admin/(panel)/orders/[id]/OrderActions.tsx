"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OrderActions({
  id,
  status,
  note,
}: {
  id: string;
  status: string;
  note: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(note);

  async function save(nextStatus?: string) {
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus || status, note: value }),
    });
    router.refresh();
  }

  return (
    <div className="card space-y-4 p-6">
      <label className="block space-y-2">
        <span>ملاحظة داخلية</span>
        <textarea className="field min-h-24" value={value} onChange={(e) => setValue(e.target.value)} />
      </label>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="gold-btn rounded-full px-5 py-2" onClick={() => save("confirmed")}>
          تأكيد الطلب
        </button>
        <button type="button" className="rounded-full border border-[var(--line)] px-5 py-2" onClick={() => save()}>
          حفظ الملاحظة
        </button>
        <button type="button" className="rounded-full px-5 py-2 text-[var(--danger)]" onClick={() => save("cancelled")}>
          إلغاء وإرجاع الستوك
        </button>
      </div>
    </div>
  );
}
