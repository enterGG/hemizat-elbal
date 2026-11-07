import SiteFrame from "@/components/SiteFrame";
import { getStore } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import ConfirmOrderButton from "./ConfirmOrderButton";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ productId?: string; name?: string; phone?: string; city?: string }>;
}) {
  const query = await searchParams;
  const store = await getStore();
  const product = store.products.find((item) => item.id === query.productId);
  const draft =
    query.productId && query.name && query.phone && query.city
      ? {
          productId: query.productId,
          customer: { name: query.name, phone: query.phone, city: query.city },
        }
      : null;

  return (
    <SiteFrame>
      <div className="mx-auto max-w-3xl px-5 py-14">
        <p className="text-xs tracking-[0.3em] text-gold">CHECKOUT</p>
        <h1 className="mt-3 text-4xl font-extrabold">تأكيد الطلب</h1>
        {!draft ? (
          <p className="mt-6 text-muted">ما كاين حتى طلب مفتوح. رجّع للقطعة وعمّر المعلومات.</p>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="card flex gap-4 p-5">
              {product?.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.images[0].url} alt={product.name} className="h-28 w-36 rounded-xl object-cover" />
              ) : null}
              <div>
                <h2 className="text-xl font-bold">{product?.name || "القطعة"}</h2>
                <p className="text-sm text-muted">
                  {product?.brand} · {product?.model}
                </p>
                {product ? <p className="mt-3 text-lg font-bold text-gold-2">{formatPrice(product.price)}</p> : null}
              </div>
            </div>
            <div className="card space-y-2 p-5">
              <h3 className="font-bold">معلومات الزبون</h3>
              <p>الاسم: {draft.customer.name}</p>
              <p>الهاتف: {draft.customer.phone}</p>
              <p>المدينة: {draft.customer.city}</p>
            </div>
            <p className="text-sm text-muted">
              إلا دوّزتي هاد الأوردر، غادي تسجّل الكوموند وتوصل نوتيفيكاسيون للمالك في الإيميل والنمرة إلى كانو مضبوطين.
            </p>
            <ConfirmOrderButton productId={draft.productId} customer={draft.customer} />
          </div>
        )}
      </div>
    </SiteFrame>
  );
}
