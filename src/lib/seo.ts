import type { Category, Product, SeoFields, StoreCategory } from "./types";

export function categoryLabel(category: Category, categories?: StoreCategory[]) {
  const name = categoryName(category, categories);
  if (category === "sneakers") return "سبرديل مستعمل أصلي";
  if (category === "bags") return "ساك مستعمل أصلي";
  return `${name} أصلي مستعمل`;
}

export function categoryName(category: Category, categories?: StoreCategory[]) {
  const found = categories?.find((item) => item.slug === category);
  if (found?.name) return found.name;
  if (category === "sneakers") return "السبرديلات";
  if (category === "bags") return "السيكان";
  return category;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || "product";
}

export function generateSeo(input: {
  name: string;
  brand: string;
  model: string;
  size?: string;
  condition?: string;
  category: Category;
  description?: string;
}): SeoFields {
  const kind = categoryLabel(input.category);
  const modelPart = input.model || input.name;
  const title = `${input.brand} ${modelPart} ${kind} | هميزات البال`.replace(/\s+/g, " ").trim();

  const bits = [
    input.name || `${input.brand} ${input.model}`.trim(),
    input.brand ? `من ${input.brand}` : "",
    input.model ? `موديل ${input.model}` : "",
    input.size ? `المقاس ${input.size}` : "",
    input.condition ? `الحالة ${input.condition}` : "",
  ].filter(Boolean);

  const description = [
    `${bits.join("، ")}.`,
    kind,
    "قطعة أصلية مستعملة منتقاة بعناية من هميزات البال في المغرب.",
    input.description ? input.description.slice(0, 110) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 320);

  const keywords = [
    input.brand,
    input.model,
    input.name,
    kind,
    input.category === "sneakers" ? "سبرديلات مستعملة" : input.category === "bags" ? "سيكان مستعملة" : `${categoryName(input.category)} مستعملة`,
    "هميزات البال",
    "ماركات أصلية",
    "المغرب",
    "كازا",
  ]
    .filter(Boolean)
    .join(", ");

  return { title, description, keywords };
}

export function productJsonLd(product: Product, origin: string) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: product.brand },
    model: product.model,
    description: product.seo.description || product.description,
    image: product.images.map((img) => (img.url.startsWith("http") ? img.url : `${origin}${img.url}`)),
    sku: product.id,
    category: categoryLabel(product.category),
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "MAD",
      price: product.price,
      availability:
        product.stock > 0 && product.status === "active"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `${origin}/product/${product.slug}`,
    },
  };
}
