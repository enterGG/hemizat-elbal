import { requireAdmin } from "@/lib/auth";
import { getStore, updateStore } from "@/lib/db";
import { generateSeo, slugify } from "@/lib/seo";
import type { Product } from "@/lib/types";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Ctx) {
  const { id } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.id === id || item.slug === id);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  try {
    const product = await updateStore((store) => {
      const index = store.products.findIndex((item) => item.id === id);
      if (index < 0) throw new Error("Not found");
      const current = store.products[index];
      const stock = Number(body.stock ?? current.stock);
      const next: Product = {
        ...current,
        category: body.category === "bags" ? "bags" : body.category === "sneakers" ? "sneakers" : current.category,
        name: String(body.name ?? current.name),
        brand: String(body.brand ?? current.brand),
        model: String(body.model ?? current.model),
        size: String(body.size ?? current.size),
        condition: String(body.condition ?? current.condition),
        price: Number(body.price ?? current.price),
        compareAtPrice: body.compareAtPrice === "" || body.compareAtPrice == null ? null : Number(body.compareAtPrice),
        stock,
        description: String(body.description ?? current.description),
        images: Array.isArray(body.images) ? body.images : current.images,
        videos: Array.isArray(body.videos) ? body.videos : current.videos,
        seo: body.seo ?? current.seo ?? generateSeo(current),
        slug: body.slug ? slugify(body.slug) : current.slug,
        status: stock <= 0 ? "sold" : body.status ?? current.status,
        updatedAt: new Date().toISOString(),
      };
      store.products[index] = next;
      return next;
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await updateStore((store) => {
    store.products = store.products.filter((item) => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
