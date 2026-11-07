import CategoryTile from "@/components/CategoryTile";
import IntroOverlay from "@/components/IntroOverlay";
import ProductCard from "@/components/ProductCard";
import SiteFrame from "@/components/SiteFrame";
import { getStore, publicProduct } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const store = await getStore();
  const products = store.products.filter(publicProduct);
  const sneakers = products.filter((p) => p.category === "sneakers");
  const bags = products.filter((p) => p.category === "bags");

  return (
    <SiteFrame>
      <IntroOverlay logoUrl={store.settings.logoUrl || "/branding/logo.jpg"} />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero.jpg?v=2"
            alt="سبرديلات وسيكان أصلية من هميزات البال"
            className="h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070707] via-[#070707]/40 to-black/15" />
        </div>
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl flex-col justify-end px-5 pb-14 pt-24">
          <h1 className="max-w-xs drop-shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={store.settings.logoUrl || "/branding/logo.jpg"}
              alt={store.settings.storeName}
              className="h-auto w-full max-w-[240px] object-contain sm:max-w-[280px]"
            />
          </h1>
          <p className="mt-4 max-w-lg text-base text-cream/90 sm:text-lg">
            سبرديلات الماركات الواعرة، وسيكان أصلية مستعملة. كل قطعة منتقاة، بحالتها الحقيقية، بلا زواق زايد.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/sneakers" className="gold-btn rounded-full px-6 py-3">
              شوف السبرديلات
            </Link>
            <Link href="/bags" className="rounded-full border border-[var(--line)] bg-black/30 px-6 py-3 backdrop-blur-sm hover:border-gold">
              شوف السيكان
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="mb-5">
          <p className="text-xs tracking-[0.35em] text-gold">المجموعات</p>
          <h2 className="mt-2 text-2xl font-bold sm:text-3xl">جوج عوالم. نفس المزاج.</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <CategoryTile
            href="/sneakers"
            image="/products/jordan-chicago-hero.jpg"
            index="01"
            title="السبرديلات"
            description="سبرديلات أصلية مستعملة من الماركات الواعرة. كل قطعة بوحدها، بالمقاس والحالة والتصاور الحقيقية."
            count={sneakers.length}
          />
          <CategoryTile
            href="/bags"
            image="/products/lv-neverfull-hero.jpg"
            index="02"
            title="السيكان"
            description="سيكان فخمة أصلية مستعملة. الحالة واضحة، القطعة كتمشي لواحد، بلا زواق زايد."
            count={bags.length}
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-gold">الاختيار الحالي</p>
            <h2 className="mt-2 text-3xl font-bold">قطع كيستاهلو العين</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
