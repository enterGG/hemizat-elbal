import { getStore, publicProduct } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const store = await getStore();
  const live = store.products.filter(publicProduct);
  const sold = store.products.filter((p) => p.status === "sold" || p.stock <= 0);
  const pending = store.orders.filter((o) => o.status === "pending");
  const revenue = store.orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.price, 0);
  const unread = store.notifications.filter((n) => !n.read);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">DASHBOARD</p>
        <h1 className="mt-2 text-4xl font-extrabold">لوحة التحكم</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="قطع معروضة" value={String(live.length)} />
        <Stat label="قطع تباعت" value={String(sold.length)} />
        <Stat label="طلبات كتسناو" value={String(pending.length)} />
        <Stat label="رقم المعاملات" value={formatPrice(revenue)} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">آخر الطلبات</h2>
            <Link href="/admin/orders" className="text-sm text-gold">
              الكل
            </Link>
          </div>
          <div className="space-y-3">
            {store.orders.slice(0, 5).length === 0 ? (
              <p className="text-muted">مازال ما كاين حتى طلب.</p>
            ) : (
              store.orders.slice(0, 5).map((order) => (
                <Link key={order.id} href={`/admin/orders/${order.id}`} className="block rounded-xl bg-white/5 p-3">
                  <div className="font-bold">{order.number} · {order.productName}</div>
                  <div className="text-sm text-muted">
                    {order.customer.name} — {order.customer.city} — {order.customer.phone}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="mb-4 text-xl font-bold">النوتيفيكاسيون</h2>
          {unread.length === 0 ? (
            <p className="text-muted">ما كاين حتى إشعار جديد.</p>
          ) : (
            <div className="space-y-3">
              {unread.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-xl bg-white/5 p-3">
                  <div className="font-bold text-gold">{item.title}</div>
                  <div className="text-sm text-muted">{item.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link href="/admin/products/new" className="gold-btn inline-flex rounded-full px-6 py-3">
        زيد منتوج جديد
      </Link>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-5">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gold-2">{value}</div>
    </div>
  );
}
