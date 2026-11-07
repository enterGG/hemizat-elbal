import OrderForm from "@/components/OrderForm";
import ProductGallery from "@/components/ProductGallery";
import SiteFrame from "@/components/SiteFrame";
import { getStore, publicProduct } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { categoryLabel, productJsonLd } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.slug === slug);
  if (!product) return { title: "القطعة غير موجودة" };
  return {
    title: { absolute: product.seo.title || product.name },
    description: product.seo.description,
    keywords: product.seo.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title: product.seo.title || product.name,
      description: product.seo.description,
      images: product.images[0] ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.slug === slug);
  if (!product) notFound();

  const available = publicProduct(product);
  const jsonLd = productJsonLd(product, "");

  return (
    <SiteFrame>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-2">
        <ProductGallery images={product.images} videos={product.videos} name={product.name} />
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-[0.3em] text-gold">{product.brand}</p>
            <h1 className="mt-2 text-4xl font-extrabold">{product.name}</h1>
            <p className="mt-2 text-muted">{categoryLabel(product.category)} · {product.model}</p>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-gold-2">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-muted line-through">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="card p-4">
              <dt className="text-muted">الموديل</dt>
              <dd className="mt-1 font-bold">{product.model}</dd>
            </div>
            <div className="card p-4">
              <dt className="text-muted">{product.category === "sneakers" ? "المقاس" : "المقاس / القياس"}</dt>
              <dd className="mt-1 font-bold">{product.size || "—"}</dd>
            </div>
            <div className="card p-4">
              <dt className="text-muted">الحالة</dt>
              <dd className="mt-1 font-bold">{product.condition}</dd>
            </div>
            <div className="card p-4">
              <dt className="text-muted">الستوك</dt>
              <dd className="mt-1 font-bold">{available ? `${product.stock} قطعة` : "تم البيع"}</dd>
            </div>
          </dl>
          <div className="leading-8 text-cream/85">
            {product.description.split("\n").map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
          <OrderForm productId={product.id} productName={product.name} inStock={available} />
        </div>
      </div>
    </SiteFrame>
  );
}
