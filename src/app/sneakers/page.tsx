import CategoryCatalog from "@/components/CategoryCatalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سبرديلات أصلية مستعملة",
  description: "سبرديلات الماركات الواعرة مستعملة وأصلية من هميزات البال. Jordan، Adidas وقطع منتقاة.",
};

export default function SneakersPage() {
  return <CategoryCatalog slug="sneakers" />;
}
