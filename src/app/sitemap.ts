import { getStore, publicProduct } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const store = await getStore();
  const products = store.products.filter(publicProduct).map((product) => ({
    url: `/product/${product.slug}`,
    lastModified: product.updatedAt,
  }));
  return [{ url: "/" }, { url: "/sneakers" }, { url: "/bags" }, ...products];
}
