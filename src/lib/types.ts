export type Category = "sneakers" | "bags";

export type ProductStatus = "active" | "draft" | "sold";

export type OrderStatus = "pending" | "confirmed" | "cancelled";

export type MediaImage = {
  url: string;
  alt: string;
};

export type MediaVideo = {
  url: string;
  kind: "youtube" | "file";
};

export type SeoFields = {
  title: string;
  description: string;
  keywords: string;
};

export type Product = {
  id: string;
  slug: string;
  category: Category;
  name: string;
  brand: string;
  model: string;
  size: string;
  condition: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  description: string;
  images: MediaImage[];
  videos: MediaVideo[];
  seo: SeoFields;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
};

export type Customer = {
  name: string;
  phone: string;
  city: string;
};

export type Order = {
  id: string;
  number: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  customer: Customer;
  status: OrderStatus;
  note: string;
  createdAt: string;
  updatedAt: string;
};

export type SmtpSettings = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

export type Settings = {
  storeName: string;
  tagline: string;
  logoUrl: string;
  ownerEmail: string;
  ownerPhone: string;
  whatsapp: string;
  webhookUrl: string;
  callmebotKey: string;
  adminPassword: string;
  smtp: SmtpSettings;
  orderSeq: number;
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
};

export type StoreData = {
  settings: Settings;
  products: Product[];
  orders: Order[];
  notifications: AppNotification[];
};

export type CheckoutDraft = {
  productId: string;
  customer: Customer;
};
