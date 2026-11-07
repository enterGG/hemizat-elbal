import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { categoryName } from "@/lib/seo";
import type { Product, StoreCategory } from "@/lib/types";

export default function ProductCard({
  product,
  categories,
}: {
  product: Product;
  categories?: StoreCategory[];
}) {
  const image = product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className="group card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-square overflow-hidden bg-black">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt || product.name}
            className="h-full w-full object-cover object-center transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted">بدون صورة</div>
        )}
        <div className="absolute right-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-gold">
          {categoryName(product.category, categories)}
        </div>
        {product.stock === 1 ? (
          <div className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-[#1a140c]">
            قطعة واحدة
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col space-y-1 p-3 sm:p-4">
        <p className="text-[10px] tracking-[0.18em] text-gold uppercase">{product.brand}</p>
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-5 text-cream sm:text-base">{product.name}</h3>
        <p className="line-clamp-1 text-xs text-muted">{product.condition}</p>
        <div className="mt-auto flex items-end gap-2 pt-2">
          <span className="text-base font-extrabold text-gold-2 sm:text-lg">{formatPrice(product.price)}</span>
          {product.compareAtPrice ? (
            <span className="text-xs text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
