import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [tours, faqItems, galleryItems, bookingRequests, contactRequests, pendingReviews] = await Promise.all([
    prisma.tour.count(), prisma.faqItem.count(), prisma.galleryItem.count(), prisma.bookingRequest.count({ where: { status: "new" } }), prisma.contactRequest.count({ where: { status: "new" } }), prisma.review.count({ where: { status: "pending" } }),
  ]);
  const metrics = [
    ["Tours", tours, "/admin/tours"], ["FAQ items", faqItems, "/admin/faq"], ["Gallery items", galleryItems, "/admin/gallery"], ["New booking requests", bookingRequests, "/admin/booking-requests?status=new"], ["New contact requests", contactRequests, "/admin/contact-requests?status=new"], ["Pending reviews", pendingReviews, "/admin/reviews?status=pending"],
  ] as const;
  return <section aria-labelledby="dashboard-title">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">Overview</p>
    <h1 id="dashboard-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Dashboard</h1>
    <p className="mt-3 max-w-2xl leading-7 text-charcoal/65">Manage the implemented bilingual website content areas and review current database counts.</p>
    <dl className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {metrics.map(([label, value, href]) => <div key={label} className="rounded-2xl border bg-white p-6 shadow-soft"><dt className="text-sm font-semibold text-charcoal/60">{label}</dt><dd className="mt-3 text-4xl font-semibold text-deep-ocean">{value}</dd><Link href={href} className="mt-4 inline-flex text-sm font-semibold text-ocean underline underline-offset-4">Open {label.toLowerCase()}</Link></div>)}
    </dl>
  </section>;
}
