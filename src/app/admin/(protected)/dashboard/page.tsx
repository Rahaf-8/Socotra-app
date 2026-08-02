import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [tours, faqItems, galleryItems, bookingRequests, contactRequests] = await Promise.all([
    prisma.tour.count(), prisma.faqItem.count(), prisma.galleryItem.count(), prisma.bookingRequest.count(), prisma.contactRequest.count(),
  ]);
  const metrics = [
    ["Tours", tours], ["FAQ items", faqItems], ["Gallery items", galleryItems], ["Booking requests", bookingRequests], ["Contact requests", contactRequests],
  ] as const;
  return <section aria-labelledby="dashboard-title">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">Overview</p>
    <h1 id="dashboard-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Dashboard</h1>
    <p className="mt-3 max-w-2xl leading-7 text-charcoal/65">A read-only view of the current website database. Content management tools will be introduced in a later stage.</p>
    <dl className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map(([label, value]) => <div key={label} className="rounded-2xl border bg-white p-6 shadow-soft"><dt className="text-sm font-semibold text-charcoal/60">{label}</dt><dd className="mt-3 text-4xl font-semibold text-deep-ocean">{value}</dd></div>)}
    </dl>
  </section>;
}
