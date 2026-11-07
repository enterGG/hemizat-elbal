import { getStore } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { notFound } from "next/navigation";
import OrderActions from "./OrderActions";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStore();
  const order = store.orders.find((item) => item.id === id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">ORDER</p>
        <h1 className="mt-2 text-4xl font-extrabold">{order.number}</h1>
        <p className="text-muted">{formatDate(order.createdAt)}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          {order.productImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={order.productImage} alt={order.productName} className="mb-4 h-48 w-full rounded-xl object-cover" />
          ) : null}
          <h2 className="text-2xl font-bold">{order.productName}</h2>
          <p className="mt-2 text-gold-2">{formatPrice(order.price)}</p>
        </div>
        <div className="card space-y-2 p-6">
          <h2 className="text-xl font-bold">الزبون</h2>
          <p>الاسم: {order.customer.name}</p>
          <p>الهاتف: {order.customer.phone}</p>
          <p>المدينة: {order.customer.city}</p>
          <p>
            واتساب:{" "}
            <a className="text-gold" href={`https://wa.me/212${order.customer.phone.replace(/^0/, "")}`} target="_blank">
              تواصل مع الزبون
            </a>
          </p>
        </div>
      </div>
      <OrderActions id={order.id} status={order.status} note={order.note} />
    </div>
  );
}
