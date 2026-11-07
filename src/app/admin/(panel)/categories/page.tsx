import CategoriesManager from "@/components/admin/CategoriesManager";
import { DEFAULT_CATEGORY_STYLE, sortedCategories } from "@/lib/categories";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const store = await getStore();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs tracking-[0.3em] text-gold">CATEGORIES</p>
        <h1 className="mt-2 text-4xl font-extrabold">التصنيفات</h1>
        <p className="mt-2 max-w-2xl text-muted">
          زيد تصنيفات جداد بالسمية واللوغو، وبدّل شكل البطاقات: مربع، مثلث، نجمة، حواف مضببة، وضوء شاعل.
        </p>
      </div>
      <CategoriesManager
        initialCategories={sortedCategories(store.categories)}
        initialStyle={store.settings.categoryStyle || DEFAULT_CATEGORY_STYLE}
      />
    </div>
  );
}
