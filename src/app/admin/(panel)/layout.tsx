import AdminShell from "@/components/admin/AdminShell";
import { isAdmin } from "@/lib/auth";
import { getStore } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin");
  const store = await getStore();
  return (
    <AdminShell logoUrl={store.settings.logoUrl || "/branding/logo.jpg"} storeName={store.settings.storeName}>
      {children}
    </AdminShell>
  );
}
