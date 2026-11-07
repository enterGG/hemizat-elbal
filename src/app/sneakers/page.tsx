import ProductCard from "@/components/ProductCard";
import SiteFrame from "@/components/SiteFrame";
import { getStore, publicProduct } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "سبرديلات أصلية مستعملة",
  description: "سبرديلات الماركات الواعرة مستعملة وأصلية من هميزات البال. Jordan، Adidas وقطع منتقاة.",
};

export default async function SneakersPage() {
  const store = await getStore();
  const products = store.products.filter((p) => p.category === "sneakers" && publicProduct(p));

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-5 py-14">
        <p className="text-xs tracking-[0.3em] text-gold">SNEAKERS</p>
        <h1 className="mt-3 text-4xl font-extrabold">السبرديلات</h1>
        <p className="mt-3 max-w-2xl text-muted">
          سبرديلات أصلية مستعملة من الماركات الواعرة. كل قطعة بوحدها، بالمقاس والحالة والصور الحقيقية.
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
