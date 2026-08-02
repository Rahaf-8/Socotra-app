import Link from "next/link";

export default function TourAdminNotFound() {
  return <section className="rounded-2xl border bg-white p-8 shadow-soft"><p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">Tour unavailable</p><h1 className="mt-3 font-display text-4xl font-semibold">This tour could not be found</h1><p className="mt-3 text-charcoal/65">It may have been deleted from another session.</p><Link href="/admin/tours" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-ocean px-5 font-semibold text-white">Back to Tours</Link></section>;
}
