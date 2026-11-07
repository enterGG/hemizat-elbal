"use client";

import StoreLogo from "../StoreLogo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/admin/dashboard", label: "لوحة التحكم" },
  { href: "/admin/products", label: "المنتوجات" },
  { href: "/admin/categories", label: "التصنيفات" },
  { href: "/admin/orders", label: "الطلبات" },
  { href: "/admin/settings", label: "إعدادات الستور" },
];

export default function AdminShell({
  children,
  logoUrl,
  storeName,
}: {
  children: React.ReactNode;
  logoUrl: string;
  storeName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let timer: number;
    async function load() {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setUnread((data.notifications || []).filter((n: { read: boolean }) => !n.read).length);
      }
    }
    load();
    timer = window.setInterval(load, 8000);
    return () => window.clearInterval(timer);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
  }

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-64 shrink-0 border-l border-[var(--line)] bg-[#0c0c0d] p-6 md:block">
        <Link href="/" className="block" aria-label={storeName}>
          <StoreLogo src={logoUrl} alt={storeName} variant="mark" className="h-[4.5rem] w-[4.5rem] sm:h-20 sm:w-20" />
        </Link>
        <p className="mt-2 text-xs text-muted">فضاء الإدارة</p>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2 ${
                pathname.startsWith(item.href) ? "bg-gold text-[#1a140c]" : "text-cream/80 hover:bg-white/5"
              }`}
            >
              <span>{item.label}</span>
              {item.href === "/admin/orders" && unread > 0 ? (
                <span className="rounded-full bg-[#1a140c] px-2 text-xs text-gold">{unread}</span>
              ) : null}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-10 text-sm text-muted hover:text-gold">
          خروج
        </button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4 md:hidden">
          <span className="font-bold text-gold-2">الإدارة</span>
          <div className="flex gap-3 text-sm">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex-1 px-5 py-8 md:px-10">{children}</div>
      </div>
    </div>
  );
}
