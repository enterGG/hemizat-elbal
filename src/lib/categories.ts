import type { CategoryStyle, StoreCategory, StoreData } from "./types";

export const DEFAULT_CATEGORY_STYLE: CategoryStyle = {
  shape: "rectangle",
  corners: "rounded",
  glow: "off",
  frame: "none",
};

const RESERVED = new Set([
  "admin",
  "api",
  "product",
  "checkout",
  "order-success",
  "c",
  "branding",
  "uploads",
  "robots",
  "sitemap",
]);

export function defaultCategories(): StoreCategory[] {
  const createdAt = new Date().toISOString();
  return [
    {
      id: "cat-sneakers",
      slug: "sneakers",
      name: "السبرديلات",
      description: "سبرديلات أصلية مستعملة من الماركات الواعرة. كل قطعة بوحدها، بالمقاس والحالة والتصاور الحقيقية.",
      logoUrl: "",
      imageUrl: "/products/jordan-chicago-hero.jpg",
      order: 1,
      createdAt,
    },
    {
      id: "cat-bags",
      slug: "bags",
      name: "السيكان",
      description: "سيكان فخمة أصلية مستعملة. الحالة واضحة، القطعة كتمشي لواحد، بلا زواق زايد.",
      logoUrl: "",
      imageUrl: "/products/lv-neverfull-hero.jpg",
      order: 2,
      createdAt,
    },
  ];
}

export function sortedCategories(categories: StoreCategory[]) {
  return [...categories].sort((a, b) => a.order - b.order || a.createdAt.localeCompare(b.createdAt));
}

export function categoryHref(slug: string) {
  if (slug === "sneakers") return "/sneakers";
  if (slug === "bags") return "/bags";
  return `/c/${encodeURIComponent(slug)}`;
}

export function findCategory(store: StoreData, slug: string) {
  return store.categories.find((item) => item.slug === slug);
}

export function isReservedSlug(slug: string) {
  return RESERVED.has(slug);
}

export function nextCategoryOrder(categories: StoreCategory[]) {
  return categories.reduce((max, item) => Math.max(max, item.order), 0) + 1;
}

export function migrateStoreShape(store: StoreData) {
  let changed = false;
  if (!Array.isArray(store.categories) || store.categories.length === 0) {
    store.categories = defaultCategories();
    changed = true;
  }
  if (!store.settings.categoryStyle) {
    store.settings.categoryStyle = { ...DEFAULT_CATEGORY_STYLE };
    changed = true;
  } else {
    store.settings.categoryStyle = {
      ...DEFAULT_CATEGORY_STYLE,
      ...store.settings.categoryStyle,
    };
  }
  return changed;
}
