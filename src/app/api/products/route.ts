import { requireAdmin } from "@/lib/auth";
import { getStore, publicProduct, updateStore } from "@/lib/db";
import { generateSeo, slugify } from "@/lib/seo";
import type { Category, Product } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const store = await getStore();
  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "1";
  const admin = all;
  if (admin) {
    try {
      await requireAdmin();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const products = admin ? store.products : store.products.filter(publicProduct);
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const product = await updateStore((store) => {
    const requested = String(body.category || "").trim();
    const category: Category =
      store.categories.some((item) => item.slug === requested)
        ? requested
        : store.categories[0]?.slug || "sneakers";
    const stock = Number(body.stock ?? 1);
    const now = new Date().toISOString();
    const created: Product = {
      id: crypto.randomUUID(),
      slug: uniqueSlug(store.products, slugify(body.slug || body.name || body.model || "product")),
      category,
      name: String(body.name || "").trim(),
      brand: String(body.brand || "").trim(),
      model: String(body.model || "").trim(),
      size: String(body.size || "").trim(),
      condition: String(body.condition || "").trim(),
      price: Number(body.price || 0),
      compareAtPrice: body.compareAtPrice ? Number(body.compareAtPrice) : null,
      stock,
      description: String(body.description || "").trim(),
      images: Array.isArray(body.images) ? body.images : [],
      videos: Array.isArray(body.videos) ? body.videos : [],
      seo: body.seo || generateSeo({
        name: body.name,
        brand: body.brand,
        model: body.model,
        size: body.size,
        condition: body.condition,
        category,
        description: body.description,
      }),
      status: stock <= 0 ? "sold" : body.status === "draft" ? "draft" : "active",
      createdAt: now,
      updatedAt: now,
    };
    store.products.unshift(created);
    return created;
  });

  return NextResponse.json({ product });
}

function uniqueSlug(products: Product[], base: string) {
  let slug = base;
  let i = 2;
  while (products.some((p) => p.slug === slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}
