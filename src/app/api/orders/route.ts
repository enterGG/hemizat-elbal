import { isAdmin } from "@/lib/auth";
import { updateStore } from "@/lib/db";
import { isValidMoroccanPhone, normalizePhone } from "@/lib/format";
import { notifyOwner } from "@/lib/notify";
import type { Order } from "@/lib/types";
import { after, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { getStore } = await import("@/lib/db");
  const store = await getStore();
  return NextResponse.json({ orders: store.orders });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body.customer?.name || "").trim();
  const phone = normalizePhone(String(body.customer?.phone || ""));
  const city = String(body.customer?.city || "").trim();
  const productId = String(body.productId || "");

  if (name.length < 2) return NextResponse.json({ error: "الاسم ناقص" }, { status: 400 });
  if (!isValidMoroccanPhone(phone)) {
    return NextResponse.json({ error: "رقم الهاتف غير صحيح" }, { status: 400 });
  }
  if (!city) return NextResponse.json({ error: "المدينة ضرورية" }, { status: 400 });

  try {
    const { order, settings } = await updateStore((store) => {
      const product = store.products.find((item) => item.id === productId);
      if (!product) throw Object.assign(new Error("القطعة غير موجودة"), { status: 404 });
      if (product.stock <= 0 || product.status !== "active") {
        throw Object.assign(new Error("هاد القطعة تقادات"), { status: 409 });
      }
      product.stock -= 1;
      if (product.stock <= 0) product.status = "sold";
      product.updatedAt = new Date().toISOString();

      const seq = store.settings.orderSeq++;
      const now = new Date().toISOString();
      const created: Order = {
        id: crypto.randomUUID(),
        number: `HB-${new Date().getFullYear()}-${String(seq).padStart(4, "0")}`,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0]?.url || "",
        price: product.price,
        customer: { name, phone, city },
        status: "pending",
        note: "",
        createdAt: now,
        updatedAt: now,
      };
      store.orders.unshift(created);
      store.notifications.unshift({
        id: crypto.randomUUID(),
        title: "كوموند جديدة",
        body: `${name} من ${city} دوز طلب ${product.name} — ${created.number}`,
        orderId: created.id,
        read: false,
        createdAt: now,
      });
      return { order: created, settings: store.settings };
    });

    after(async () => {
      await notifyOwner(settings, order);
    });
    return NextResponse.json({ order });
  } catch (error) {
    const status = (error as Error & { status?: number }).status || 500;
    return NextResponse.json({ error: error instanceof Error ? error.message : "خطأ" }, { status });
  }
}
