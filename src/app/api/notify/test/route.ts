import { requireAdmin } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { notifyOwner } from "@/lib/notify";
import type { Order } from "@/lib/types";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const channel = body.channel === "phone" || body.channel === "email" ? body.channel : "all";
  const store = await getStore();
  const now = new Date().toISOString();
  const sample: Order = {
    id: "test",
    number: "HB-TEST",
    productId: "test",
    productName: "اختبار الإشعار",
    productImage: "",
    price: 0,
    customer: {
      name: "سيستيم هميزات البال",
      phone: store.settings.ownerPhone || "0600000000",
      city: "الدار البيضاء",
    },
    status: "pending",
    note: "test",
    createdAt: now,
    updatedAt: now,
  };

  const settings =
    channel === "phone"
      ? { ...store.settings, ownerEmail: "" }
      : channel === "email"
        ? { ...store.settings, ownerPhone: "", whatsapp: "" }
        : store.settings;

  const notify = await notifyOwner(settings, sample);
  return NextResponse.json({ ok: true, notify });
}
