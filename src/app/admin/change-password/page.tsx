import { redirect } from "next/navigation";

import { ChangePasswordForm } from "@/components/admin/change-password-form";
import { requireAdmin } from "@/lib/auth/admin";

export default async function ChangePasswordPage() {
  const admin = await requireAdmin({ allowPasswordChange: true });
  if (!admin.mustChangePassword) redirect("/admin/dashboard");
  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <section className="w-full max-w-lg rounded-3xl border bg-white p-7 shadow-soft sm:p-10" aria-labelledby="change-title">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ocean">Account security</p>
      <h1 id="change-title" className="font-display text-4xl font-semibold">Change Your Password</h1>
      <p className="mb-8 mt-3 leading-7 text-charcoal/65">Set a private password before accessing the dashboard. This will revoke all existing sessions for this account.</p>
      <ChangePasswordForm />
    </section>
  </main>;
}
