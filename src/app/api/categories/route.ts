import { requireAdmin } from "@/lib/auth";
import { isReservedSlug, nextCategoryOrder, sortedCategories } from "@/lib/categories";
import { getStore, updateStore } from "@/lib/db";
import { slugify } from "@/lib/seo";
import type { StoreCategory } from "@/lib/types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await getStore();
  return NextResponse.json({
    categories: sortedCategories(store.categories),
    style: store.settings.categoryStyle,
  });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "السمية ضرورية." }, { status: 400 });

  try {
    const category = await updateStore((store) => {
      const base = slugify(String(body.slug || name));
      let slug = base;
      let i = 2;
      while (store.categories.some((item) => item.slug === slug) || isReservedSlug(slug)) {
        slug = `${base}-${i}`;
        i += 1;
      }
      const created: StoreCategory = {
        id: crypto.randomUUID(),
        slug,
        name,
        description: String(body.description || "").trim(),
        logoUrl: String(body.logoUrl || "").trim(),
        imageUrl: String(body.imageUrl || body.logoUrl || "").trim(),
        order: nextCategoryOrder(store.categories),
        createdAt: new Date().toISOString(),
      };
      store.categories.push(created);
      return created;
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "ما تزادش التصنيف." }, { status: 400 });
  }
}
