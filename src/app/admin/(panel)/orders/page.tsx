import { getStore, updateStore } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  await updateStore((store) => {
    store.notifications = store.notifications.map((item) => ({ ...item, read: true }));
  });
  const store = await getStore();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">ORDERS</p>
        <h1 className="mt-2 text-4xl font-extrabold">الطلبات</h1>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-right">
            <thead className="bg-white/5 text-sm text-muted">
              <tr>
                <th className="p-4 font-medium">الرقم</th>
                <th className="p-4 font-medium">القطعة</th>
                <th className="p-4 font-medium">الزبون</th>
                <th className="p-4 font-medium">المدينة</th>
                <th className="p-4 font-medium">الثمن</th>
                <th className="p-4 font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {store.orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-muted">
                    مازال ما كاين حتى أوردر.
                  </td>
                </tr>
              ) : (
                store.orders.map((order) => (
                  <tr key={order.id} className="border-t border-[var(--line)]">
                    <td className="p-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-gold">
                        {order.number}
                      </Link>
                      <div className="text-xs text-muted">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="p-4">{order.productName}</td>
                    <td className="p-4">
                      {order.customer.name}
                      <div className="text-xs text-muted">{order.customer.phone}</div>
                    </td>
                    <td className="p-4">{order.customer.city}</td>
                    <td className="p-4">{formatPrice(order.price)}</td>
                    <td className="p-4">{statusLabel(order.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === "confirmed") return "مؤكد";
  if (status === "cancelled") return "ملغي";
  return "جديد";
}
