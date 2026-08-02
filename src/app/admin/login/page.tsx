import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { siteSettingsPlaceholder } from "@/config/site-settings";
import { getCurrentAdmin } from "@/lib/auth/admin";
import { safeAdminDestination } from "@/lib/auth/validation";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; passwordChanged?: string }> }) {
  const [admin, query] = await Promise.all([getCurrentAdmin(), searchParams]);
  if (admin) redirect(admin.mustChangePassword ? "/admin/change-password" : safeAdminDestination(query.callbackUrl));

  return <main className="flex min-h-screen items-center justify-center px-5 py-12">
    <section className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-soft sm:p-10" aria-labelledby="login-title">
      <div className="mb-8 text-center">
        <Image src={siteSettingsPlaceholder.logo.src} alt={siteSettingsPlaceholder.logo.alt} width={150} height={64} className="mx-auto mb-7 h-16 w-auto object-contain" priority />
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-ocean">Private dashboard</p>
        <h1 id="login-title" className="font-display text-4xl font-semibold text-charcoal">Administrator Login</h1>
        <p className="mt-3 text-sm leading-6 text-charcoal/65">Sign in to manage the Tour Socotra website.</p>
      </div>
      {query.passwordChanged === "1" ? <p role="status" className="mb-5 rounded-xl border border-ocean/20 bg-ocean/5 p-3 text-sm text-deep-ocean">Your password was changed. Sign in with your new password.</p> : null}
      <LoginForm callbackUrl={safeAdminDestination(query.callbackUrl)} />
    </section>
  </main>;
}
