import { getStore } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { categoryName } from "@/lib/seo";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const store = await getStore();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.3em] text-gold">PRODUCTS</p>
          <h1 className="mt-2 text-4xl font-extrabold">المنتوجات</h1>
        </div>
        <Link href="/admin/products/new" className="gold-btn rounded-full px-5 py-2.5">
          زيد منتوج
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {store.products.map((product) => (
          <Link key={product.id} href={`/admin/products/${product.id}`} className="card overflow-hidden">
            <div className="aspect-[4/3] bg-black">
              {product.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="space-y-1 p-4">
              <div className="text-xs text-gold">{categoryName(product.category, store.categories)}</div>
              <div className="font-bold">{product.name}</div>
              <div className="text-sm text-muted">
                {formatPrice(product.price)} · ستوك {product.stock} · {product.status === "sold" || product.stock <= 0 ? "تباع" : product.status === "draft" ? "مسودة" : "معروض"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
