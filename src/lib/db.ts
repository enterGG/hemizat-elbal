import { promises as fs } from "fs";
import path from "path";
import { generateSeo, slugify } from "./seo";
import type { Product, StoreData } from "./types";

const dbPath = path.join(process.cwd(), "data", "store.json");

function now() {
  return new Date().toISOString();
}

function seedProducts(): Product[] {
  const createdAt = now();

  const jordan: Product = {
    id: "p-jordan-chicago",
    slug: slugify("nike air jordan 1 chicago"),
    category: "sneakers",
    name: "Nike Air Jordan 1 High Chicago",
    brand: "Nike",
    model: "Air Jordan 1 Retro High OG Chicago",
    size: "42 EU",
    condition: "8.5/10 — استعمال خفيف",
    price: 2450,
    compareAtPrice: 3200,
    stock: 1,
    description:
      "قطعة أصلية منتقاة بعناية. Air Jordan 1 High باللون Chicago الأيقوني: أبيض، أسود وأحمر. الجلد نقي، الألوان باقية واعرة والاستعمال خفيف. المقاس 42 أوروبي. هاد السبرديل للناس اللي كيبغيو الكلاسيك وما كيقبلوش التقليد.",
    images: [
      {
        url: "/products/jordan-chicago-hero.jpg",
        alt: "Nike Air Jordan 1 High Chicago مستعمل أصلي - هميزات البال",
      },
      {
        url: "/products/jordan-chicago-side.jpg",
        alt: "تفاصيل جلد Nike Air Jordan 1 Chicago من الجانب",
      },
    ],
    videos: [],
    seo: generateSeo({
      name: "Nike Air Jordan 1 High Chicago",
      brand: "Nike",
      model: "Air Jordan 1 Retro High OG Chicago",
      size: "42 EU",
      condition: "8.5/10",
      category: "sneakers",
    }),
    status: "active",
    createdAt,
    updatedAt: createdAt,
  };

  const samba: Product = {
    id: "p-adidas-samba",
    slug: slugify("adidas samba og"),
    category: "sneakers",
    name: "Adidas Samba OG",
    brand: "Adidas",
    model: "Samba OG White Black Gum",
    size: "43 EU",
    condition: "9/10 — شبه جديدة",
    price: 950,
    compareAtPrice: 1400,
    stock: 1,
    description:
      "Adidas Samba OG بيضاء بالخطوط السوداء والنعل الكام. استعمال خفيف جداً، القطعة شبه جديدة. المقاس 43. سبرديل يومي وأنيق في نفس الوقت، أصلي 100% ومنتقى للناس اللي كتعرف القيمة.",
    images: [
      {
        url: "/products/adidas-samba-hero.jpg",
        alt: "Adidas Samba OG أبيض وأسود مستعمل أصلي - هميزات البال",
      },
      {
        url: "/products/adidas-samba-top.jpg",
        alt: "صورة علوية لـ Adidas Samba OG",
      },
    ],
    videos: [],
    seo: generateSeo({
      name: "Adidas Samba OG",
      brand: "Adidas",
      model: "Samba OG White Black Gum",
      size: "43 EU",
      condition: "9/10",
      category: "sneakers",
    }),
    status: "active",
    createdAt,
    updatedAt: createdAt,
  };

  const neverfull: Product = {
    id: "p-lv-neverfull",
    slug: slugify("louis vuitton speedy 30"),
    category: "bags",
    name: "Louis Vuitton Speedy 30",
    brand: "Louis Vuitton",
    model: "Speedy 30 Monogram",
    size: "30",
    condition: "8/10 — باتينا طبيعية زوينة",
    price: 4900,
    compareAtPrice: 7200,
    stock: 1,
    description:
      "Louis Vuitton Speedy 30 أصلية مستعملة. الكانفاس نقي والجلد فيه باتينا طبيعية كتعطي للساك هيبة. أيقونة عملية للخروج والسفر. قطعة واحدة فقط.",
    images: [
      {
        url: "/products/lv-neverfull-hero.jpg",
        alt: "Louis Vuitton Speedy 30 أصلي مستعمل - هميزات البال",
      },
      {
        url: "/products/lv-neverfull-detail.jpg",
        alt: "تفاصيل جلد ومقابض Louis Vuitton Speedy",
      },
    ],
    videos: [],
    seo: generateSeo({
      name: "Louis Vuitton Speedy 30",
      brand: "Louis Vuitton",
      model: "Speedy 30 Monogram",
      condition: "8/10",
      category: "bags",
    }),
    status: "active",
    createdAt,
    updatedAt: createdAt,
  };

  const chanel: Product = {
    id: "p-chanel-flap",
    slug: slugify("gucci gg marmont"),
    category: "bags",
    name: "Gucci GG Marmont",
    brand: "Gucci",
    model: "GG Marmont Small Matelassé",
    size: "Small",
    condition: "8.5/10 — محافظة على هيبتها",
    price: 3900,
    compareAtPrice: 6200,
    stock: 1,
    description:
      "Gucci GG Marmont أصلية مستعملة. الكيلتينغ المضلع، الجلد الأسود والشعار الذهبي. استعمال محترم والقطعة محافظة على فخامتها. ساك أيقوني للناس اللي كيبغيو الماركات الواعرة بلا ما يشريو جديد.",
    images: [
      {
        url: "/products/chanel-flap-hero.jpg",
        alt: "Gucci GG Marmont أسود أصلي مستعمل - هميزات البال",
      },
      {
        url: "/products/chanel-flap-detail.jpg",
        alt: "تفاصيل الكيلتينغ والشعار الذهبي لساك Gucci Marmont",
      },
    ],
    videos: [],
    seo: generateSeo({
      name: "Gucci GG Marmont",
      brand: "Gucci",
      model: "GG Marmont Small Matelassé",
      condition: "8.5/10",
      category: "bags",
    }),
    status: "active",
    createdAt,
    updatedAt: createdAt,
  };

  return [jordan, samba, neverfull, chanel];
}

function seed(): StoreData {
  return {
    settings: {
      storeName: "هميزات البال",
      tagline: "سبرديلات وسيكان الماركات الواعرة — أصلية ومستعملة بمنتقى",
      logoUrl: "/branding/logo.jpg",
      ownerEmail: "",
      ownerPhone: "",
      whatsapp: "",
      webhookUrl: "",
      callmebotKey: "",
      adminPassword: "hemizat2026",
      smtp: { host: "", port: 587, user: "", pass: "", from: "" },
      orderSeq: 1,
    },
    products: seedProducts(),
    orders: [],
    notifications: [],
  };
}

async function ensureFile() {
  try {
    await fs.access(dbPath);
  } catch {
    try {
      await fs.mkdir(path.dirname(dbPath), { recursive: true });
      await fs.writeFile(dbPath, JSON.stringify(seed(), null, 2), "utf8");
    } catch {
      // Read-only hosts (Vercel) still serve the bundled store.json.
    }
  }
}

let queue: Promise<void> = Promise.resolve();

export async function getStore(): Promise<StoreData> {
  await ensureFile();
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    const store = JSON.parse(raw) as StoreData;
    if (!store.settings.logoUrl) store.settings.logoUrl = "/branding/logo.jpg";
    return store;
  } catch {
    return seed();
  }
}

export async function updateStore<T>(mutator: (store: StoreData) => T | Promise<T>): Promise<T> {
  let result!: T;
  queue = queue.then(async () => {
    const store = await getStore();
    result = await mutator(store);
    try {
      await fs.writeFile(dbPath, JSON.stringify(store, null, 2), "utf8");
    } catch {
      // Preview deploys may not persist writes; browsing still works.
    }
  });
  await queue;
  return result;
}

export function publicProduct(product: Product) {
  return product.status === "active" && product.stock > 0;
}
