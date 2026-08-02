import Image from "next/image";
import Link from "next/link";

import { siteSettingsPlaceholder } from "@/config/site-settings";
import { logoutAdmin } from "@/lib/actions/admin-auth";
import { requireAdmin } from "@/lib/auth/admin";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
    <aside className="border-b bg-charcoal px-5 py-5 text-white lg:min-h-screen lg:border-b-0 lg:border-e lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link href="/admin/dashboard" className="inline-flex rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
          <Image src={siteSettingsPlaceholder.logo.src} alt={siteSettingsPlaceholder.logo.alt} width={130} height={56} className="h-12 w-auto rounded-lg bg-white/95 object-contain px-2" />
        </Link>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-ocean-light lg:mt-6">Website Admin</p>
      </div>
      <nav aria-label="Administrator" className="mt-5 lg:mt-10">
        <Link href="/admin/dashboard" className="block rounded-xl bg-white/10 px-4 py-3 font-semibold transition hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Dashboard</Link>
      </nav>
      <div className="mt-6 border-t border-white/15 pt-5 lg:mt-12">
        <p className="truncate font-semibold">{admin.name}</p>
        <p className="mt-1 truncate text-sm text-white/60">{admin.email}</p>
        <div className="mt-5 flex flex-wrap gap-3 lg:block lg:space-y-3">
          <Link href="/en" className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-4 text-sm font-semibold hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">View public site</Link>
          <form action={logoutAdmin}><button className="min-h-11 rounded-full bg-white px-4 text-sm font-semibold text-charcoal hover:bg-soft-sand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Log Out</button></form>
        </div>
      </div>
    </aside>
    <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
  </div>;
}
