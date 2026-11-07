import StoreLogo from "./StoreLogo";
import Link from "next/link";

export default function Footer({ logoUrl, storeName }: { logoUrl: string; storeName: string }) {
  return (
    <footer className="mt-auto border-t border-[var(--line)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <StoreLogo src={logoUrl} alt={storeName} className="mb-2 h-16 w-auto max-w-[200px]" />
          <p>سبرديلات أصلية مستعملة وسيكان الماركات الواعرة. قطعة بقطعة.</p>
        </div>
        <Link href="/admin" className="hover:text-gold">
          فضاء الإدارة
        </Link>
      </div>
    </footer>
  );
}
