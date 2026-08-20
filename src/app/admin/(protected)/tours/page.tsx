import Link from "next/link";

import { deleteOrArchiveTour } from "@/lib/actions/tour-admin";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminTours } from "@/lib/tours/tour-repository";

const messages: Record<string, string> = { deleted: "Tour deleted.", archived: "This tour has historical booking requests, so it was archived instead of deleted.", missing: "The tour no longer exists.", "confirmation-required": "Confirm the destructive action before continuing." };

export default async function AdminToursPage({ searchParams }: { searchParams: Promise<{ result?: string }> }) {
  await requireAdmin();
  const [tours, query] = await Promise.all([getAdminTours(), searchParams]);
  return <section aria-labelledby="tours-title">
    <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Tours</nav>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">Content management</p><h1 id="tours-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Tours</h1><p className="mt-3 text-charcoal/65">Manage shared business information and both public translations.</p></div><div className="flex flex-wrap gap-3"><Link href="/admin/tours/package-types" className="inline-flex min-h-11 items-center rounded-full border px-6 font-semibold focus-visible:ring-2 focus-visible:ring-ocean">Manage package types</Link><Link href="/admin/tours/new" className="inline-flex min-h-11 items-center rounded-full bg-ocean px-6 font-semibold text-white hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean">Create tour</Link></div></div>
    {query.result && messages[query.result] ? <p role="status" className="mt-6 rounded-xl border border-ocean/20 bg-ocean/5 p-4 text-sm text-deep-ocean">{messages[query.result]}</p> : null}
    {tours.length === 0 ? <div className="mt-8 rounded-2xl border bg-white p-8 text-center"><h2 className="font-display text-2xl font-semibold">No tours yet</h2><p className="mt-2 text-charcoal/65">Create a bilingual draft to begin.</p></div> : <div className="mt-8 space-y-4">{tours.map((tour) => {
      const en = tour.translations.find((value) => value.locale === "en"); const ar = tour.translations.find((value) => value.locale === "ar"); const price = tour.pricingTiers[0];
      return <article key={tour.id} className="rounded-2xl border bg-white p-5 shadow-soft sm:p-6"><div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start"><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-soft-sand px-3 py-1 text-xs font-bold uppercase">{tour.status}</span>{tour._count.bookingRequests ? <span className="rounded-full border px-3 py-1 text-xs font-semibold">{tour._count.bookingRequests} booking request(s)</span> : null}</div><h2 className="mt-4 font-display text-3xl font-semibold">{en?.title ?? "Missing English title"}</h2><p dir="rtl" className="mt-1 text-lg font-semibold text-charcoal/75">{ar?.title ?? "Missing Arabic title"}</p><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3"><div><dt className="text-charcoal/55">Slug</dt><dd className="break-all font-medium">{tour.slug}</dd></div><div><dt className="text-charcoal/55">Starting price</dt><dd className="font-medium">{price ? `${price.currency} ${price.pricePerPerson.toLocaleString("en-US")}` : "Contact pricing"}</dd></div><div><dt className="text-charcoal/55">Updated</dt><dd className="font-medium">{tour.updatedAt.toLocaleDateString("en-GB")}</dd></div></dl></div><div className="flex flex-wrap gap-3"><Link href={`/admin/tours/${tour.id}/edit`} className="inline-flex min-h-11 items-center rounded-full border px-5 font-semibold hover:border-ocean">Edit</Link></div></div>
        <form action={deleteOrArchiveTour} className="mt-5 border-t pt-4"><input type="hidden" name="tourId" value={tour.id} /><label className="flex items-start gap-3 text-sm"><input type="checkbox" name="confirm" required className="mt-0.5 size-5 accent-ocean" /><span>I understand this permanently deletes an unreferenced tour. Tours with booking history are archived instead.</span></label><button className="mt-3 min-h-10 rounded-full border border-red-300 px-4 text-sm font-semibold text-red-700 hover:bg-red-50">Delete or archive</button></form>
      </article>;
    })}</div>}
  </section>;
}
