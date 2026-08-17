import { AdminShell } from "@/components/admin/admin-shell";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { requireAdmin } from "@/lib/auth/admin";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <AdminShell admin={{ name: admin.name, email: admin.email }} logo={siteSettingsPlaceholder.logo}>
      {children}
    </AdminShell>
  );
}
