import CategoryCatalog from "@/components/CategoryCatalog";
import { findCategory } from "@/lib/categories";
import { getStore } from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStore();
  const category = findCategory(store, decodeURIComponent(slug));
  if (!category) return { title: "التصنيف غير موجود" };
  return {
    title: category.name,
    description: category.description || `${category.name} أصلية مستعملة من هميزات البال.`,
  };
}

export default async function DynamicCategoryPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const store = await getStore();
  if (!findCategory(store, decoded)) notFound();
  return <CategoryCatalog slug={decoded} />;
}
