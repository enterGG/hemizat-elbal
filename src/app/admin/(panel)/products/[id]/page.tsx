import ProductForm from "@/components/admin/ProductForm";
import { getStore } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = await getStore();
  const product = store.products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">EDIT</p>
        <h1 className="mt-2 text-4xl font-extrabold">{product.name}</h1>
      </div>
      <ProductForm product={product} categories={store.categories} />
      <DeleteButton id={product.id} />
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { requireAdmin } = await import("@/lib/auth");
        const { updateStore } = await import("@/lib/db");
        const { redirect } = await import("next/navigation");
        await requireAdmin();
        await updateStore((store) => {
          store.products = store.products.filter((item) => item.id !== id);
        });
        redirect("/admin/products");
      }}
    >
      <button className="text-sm text-[var(--danger)]" type="submit">
        حذف القطعة
      </button>
    </form>
  );
}
