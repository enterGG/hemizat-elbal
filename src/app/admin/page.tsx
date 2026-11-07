"use client";

import StoreLogo from "@/components/StoreLogo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [logoUrl, setLogoUrl] = useState("/branding/logo.jpg");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.admin) router.replace("/admin/dashboard");
      });
    fetch("/api/branding")
      .then((res) => res.json())
      .then((data) => data.logoUrl && setLogoUrl(data.logoUrl))
      .catch(() => undefined);
  }, [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("الرمز غلط.");
      return;
    }
    router.push("/admin/dashboard");
  }

  return (
    <div className="flex min-h-full items-center justify-center px-5">
      <form onSubmit={submit} className="card w-full max-w-md space-y-5 p-8">
        <div className="text-center">
          <StoreLogo src={logoUrl} className="mx-auto h-28 w-auto max-w-[240px]" />
          <p className="mt-3 text-sm text-muted">دخل لفضاء الإدارة باش تزيد المنتوجات وتتابع الطلبات.</p>
        </div>
        <label className="block space-y-2 text-right">
          <span>رمز الدخول</span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
        <button className="gold-btn w-full rounded-full py-3" type="submit">
          دخول
        </button>
        <p className="text-xs text-muted">الرمز الافتراضي: hemizat2026 — بدّلو من الإعدادات.</p>
      </form>
    </div>
  );
}
