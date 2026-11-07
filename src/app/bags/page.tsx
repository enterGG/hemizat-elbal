import ProductCard from "@/components/ProductCard";
import SiteFrame from "@/components/SiteFrame";
import { getStore, publicProduct } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سيكان أصلية مستعملة",
  description: "سيكان الماركات الواعرة مستعملة وأصلية من هميزات البال. Louis Vuitton، Gucci وقطع فاخرة منتقاة.",
};

export default async function BagsPage() {
  const store = await getStore();
  const products = store.products.filter((p) => p.category === "bags" && publicProduct(p));

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs tracking-[0.3em] text-gold">BAGS</p>
        <h1 className="mt-3 text-4xl font-extrabold">السيكان</h1>
        <p className="mt-3 max-w-2xl text-muted">
          سيكان أصلية مستعملة من الماركات الفاخرة. الحالة واضحة، التصاور حقيقية، والقطعة كتمشي لواحد.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
