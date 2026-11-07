import { requireAdmin } from "@/lib/auth";
import { updateStore } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const status = body.status as OrderStatus | undefined;

  const order = await updateStore((store) => {
    const current = store.orders.find((item) => item.id === id);
    if (!current) throw new Error("Not found");
    if (status && status !== current.status) {
      if (status === "cancelled" && current.status !== "cancelled") {
        const product = store.products.find((item) => item.id === current.productId);
        if (product) {
          product.stock += 1;
          if (product.status === "sold") product.status = "active";
        }
      }
      current.status = status;
    }
    if (typeof body.note === "string") current.note = body.note;
    current.updatedAt = new Date().toISOString();
    return current;
  });

  return NextResponse.json({ order });
}
