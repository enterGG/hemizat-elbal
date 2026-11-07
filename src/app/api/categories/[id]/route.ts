import { requireAdmin } from "@/lib/auth";
import { getStore, updateStore } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    const category = await updateStore((store) => {
      const index = store.categories.findIndex((item) => item.id === id);
      if (index < 0) throw new Error("Not found");
      const current = store.categories[index];
      const next = {
        ...current,
        name: String(body.name ?? current.name).trim() || current.name,
        description: body.description != null ? String(body.description).trim() : current.description,
        logoUrl: body.logoUrl != null ? String(body.logoUrl).trim() : current.logoUrl,
        imageUrl: body.imageUrl != null ? String(body.imageUrl).trim() : current.imageUrl,
      };
      store.categories[index] = next;
      return next;
    });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "ما لقيناش التصنيف." }, { status: 404 });
  }
}

export async function DELETE(_request: Request, { params }: Ctx) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const store = await getStore();
  const category = store.categories.find((item) => item.id === id);
  if (!category) return NextResponse.json({ error: "ما لقيناش التصنيف." }, { status: 404 });
  if (store.categories.length <= 1) {
    return NextResponse.json({ error: "خاص يبقى تصنيف واحد على الأقل." }, { status: 400 });
  }
  if (store.products.some((product) => product.category === category.slug)) {
    return NextResponse.json({ error: "هاد التصنيف فيه منتوجات. حيدهم ولا بدّلهم قبل." }, { status: 400 });
  }

  await updateStore((current) => {
    current.categories = current.categories.filter((item) => item.id !== id);
  });
  return NextResponse.json({ ok: true });
}
