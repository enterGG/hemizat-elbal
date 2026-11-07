import ProductCard from "@/components/ProductCard";
import SiteFrame from "@/components/SiteFrame";
import { findCategory } from "@/lib/categories";
import { getStore, publicProduct } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function CategoryCatalog({ slug }: { slug: string }) {
  const store = await getStore();
  const category = findCategory(store, slug);
  if (!category) notFound();
  const products = store.products.filter((product) => product.category === slug && publicProduct(product));

  return (
    <SiteFrame>
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-center gap-4">
          {category.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.logoUrl} alt="" className="h-16 w-16 rounded-full object-cover object-center" />
          ) : null}
          <div>
            <p className="text-xs tracking-[0.3em] text-gold">{category.slug.toUpperCase()}</p>
            <h1 className="mt-2 text-4xl font-extrabold">{category.name}</h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-muted">{category.description}</p>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} categories={store.categories} />
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
