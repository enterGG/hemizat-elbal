import SiteFrame from "@/components/SiteFrame";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string; city?: string; product?: string; price?: string; image?: string }>;
}) {
  const query = await searchParams;
  const name = (query.name || "").trim();
  const city = (query.city || "").trim();
  const product = (query.product || "").trim();
  const image = (query.image || "").trim();
  const price = Number(query.price || "");

  return (
    <SiteFrame>
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-3xl font-black text-[#1a140c]">
          ✓
        </div>
        <h1 className="mt-6 text-4xl font-extrabold">شكراً لك</h1>
        <p className="mt-4 text-base leading-8 text-cream/85">
          شكراً لك حيث دوّزتي عندنا كوموند. غادي نتواصلو معاك في أقرب وقت.
        </p>

        <div className="card mt-10 overflow-hidden text-right">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product} className="h-52 w-full object-cover object-center" />
          ) : null}
          <div className="space-y-3 p-5">
            {product ? (
              <div>
                <p className="text-xs text-muted">المنتوج</p>
                <p className="mt-1 text-xl font-bold">{product}</p>
              </div>
            ) : null}
            {Number.isFinite(price) && price > 0 ? (
              <div>
                <p className="text-xs text-muted">الثمن</p>
                <p className="mt-1 text-lg font-extrabold text-gold-2">{formatPrice(price)}</p>
              </div>
            ) : null}
            {name ? (
              <div>
                <p className="text-xs text-muted">السمية</p>
                <p className="mt-1 font-bold">{name}</p>
              </div>
            ) : null}
            {city ? (
              <div>
                <p className="text-xs text-muted">العنوان</p>
                <p className="mt-1 font-bold">{city}</p>
              </div>
            ) : null}
          </div>
        </div>

        <Link href="/" className="gold-btn mt-8 inline-flex rounded-full px-6 py-3">
          رجوع للرئيسية
        </Link>
      </div>
    </SiteFrame>
  );
}
