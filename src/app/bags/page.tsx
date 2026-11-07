import CategoryCatalog from "@/components/CategoryCatalog";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سيكان أصلية مستعملة",
  description: "سيكان الماركات الواعرة مستعملة وأصلية من هميزات البال. Louis Vuitton، Gucci وقطع فاخرة منتقاة.",
};

export default function BagsPage() {
  return <CategoryCatalog slug="bags" />;
}
