import { categoryHref } from "@/lib/categories";
import { getStore, publicProduct } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await getStore();
  const products = store.products.filter(publicProduct).map((product) => ({
    url: `/product/${product.slug}`,
    lastModified: product.updatedAt,
  }));
  const categories = store.categories.map((category) => ({
    url: categoryHref(category.slug),
  }));
  return [{ url: "/" }, ...categories, ...products];
}
