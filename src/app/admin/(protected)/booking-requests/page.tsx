import Link from "next/link";

import type { BookingRequestStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminBookingRequests } from "@/lib/requests/request-repository";
import { bookingRequestFilterSchema } from "@/lib/validation/request-admin";

const filters = ["all", "new", "reviewing", "contacted", "confirmed", "declined", "archived"] as const;

export default async function BookingRequestsPage({ searchParams }: PageProps<"/admin/booking-requests">) {
  await requireAdmin();
  const query = await searchParams;
  const parsed = bookingRequestFilterSchema.safeParse(typeof query.status === "string" ? query.status : "all");
  const filter = parsed.success ? parsed.data : "all";
  const requests = await getAdminBookingRequests(filter === "all" ? undefined : filter as BookingRequestStatus);

  return <section aria-labelledby="booking-requests-title">
    <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Booking Requests</nav>
    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-ocean">Request management</p>
    <h1 id="booking-requests-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Booking Requests</h1>
    <p className="mt-3 max-w-2xl text-charcoal/65">Newest requests appear first. A request is an enquiry and is not an automatic booking confirmation.</p>
    <nav aria-label="Filter booking requests" className="mt-7 flex flex-wrap gap-2">{filters.map((status) => <Link key={status} href={status === "all" ? "/admin/booking-requests" : `/admin/booking-requests?status=${status}`} aria-current={filter === status ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filter === status ? "bg-charcoal text-white" : "bg-white"}`}>{status}</Link>)}</nav>
    {requests.length ? <div className="mt-7 space-y-4">{requests.map((request) => <article key={request.id} className="rounded-2xl border bg-white p-5 shadow-soft sm:p-6"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-soft-sand px-3 py-1 text-xs font-bold uppercase">{request.status}</span>{request.status === "new" ? <span className="rounded-full bg-ocean px-3 py-1 text-xs font-bold text-white">New</span> : null}<span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase">{request.locale}</span></div><h2 className="mt-4 text-xl font-semibold">{request.fullName}</h2><p className="mt-1 break-words text-sm text-charcoal/65">{request.email} · {request.whatsappNumber}</p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-charcoal/55">Tour</dt><dd className="font-medium">{request.selectedPackageTitle}</dd></div><div><dt className="text-charcoal/55">Travel date</dt><dd className="font-medium">{request.preferredArrivalDate.toLocaleDateString("en-GB", { timeZone: "UTC" })}</dd></div><div><dt className="text-charcoal/55">Submitted</dt><dd className="font-medium">{request.createdAt.toLocaleString("en-GB")}</dd></div></dl></div><Link href={`/admin/booking-requests/${request.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full border px-5 font-semibold hover:border-ocean">View details</Link></div></article>)}</div> : <p className="mt-7 rounded-2xl border bg-white p-8 text-center text-charcoal/65">No booking requests match this filter.</p>}
  </section>;
}
