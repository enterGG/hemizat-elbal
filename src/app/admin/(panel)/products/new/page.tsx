import ProductForm from "@/components/admin/ProductForm";
import { sortedCategories } from "@/lib/categories";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const store = await getStore();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">NEW PIECE</p>
        <h1 className="mt-2 text-4xl font-extrabold">زيد قطعة جديدة</h1>
      </div>
      <ProductForm categories={sortedCategories(store.categories)} />
    </div>
  );
}
