import { sortedCategories } from "@/lib/categories";
import { getStore } from "@/lib/db";
import Footer from "./Footer";
import Header from "./Header";

export default async function SiteFrame({ children }: { children: React.ReactNode }) {
  const store = await getStore();
  const logoUrl = store.settings.logoUrl || "/branding/logo.jpg";
  const storeName = store.settings.storeName;
  const categories = sortedCategories(store.categories);

  return (
    <div className="relative z-10 flex min-h-full flex-col">
      <Header logoUrl={logoUrl} storeName={storeName} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer logoUrl={logoUrl} storeName={storeName} />
    </div>
  );
}
