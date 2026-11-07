"use client";

import StoreLogo from "./StoreLogo";
import { categoryHref } from "@/lib/categories";
import type { StoreCategory } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({
  logoUrl,
  storeName,
  categories,
}: {
  logoUrl: string;
  storeName: string;
  categories: StoreCategory[];
}) {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "الرئيسية" },
    ...categories.map((category) => ({
      href: categoryHref(category.slug),
      label: category.name,
    })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[#070707]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0" aria-label={storeName}>
          <StoreLogo src={logoUrl} alt={storeName} variant="mark" />
        </Link>
        <nav className="flex max-w-[70%] items-center gap-1 overflow-x-auto text-sm sm:gap-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 transition ${
                  active ? "bg-gold text-[#1a140c]" : "text-cream/80 hover:text-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
