import Link from "next/link";

import type { ContactRequestStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminContactRequests } from "@/lib/requests/request-repository";
import { contactRequestFilterSchema } from "@/lib/validation/request-admin";

const filters = ["all", "new", "inProgress", "resolved", "archived"] as const;

export default async function ContactRequestsPage({ searchParams }: PageProps<"/admin/contact-requests">) {
  await requireAdmin();
  const query = await searchParams;
  const parsed = contactRequestFilterSchema.safeParse(typeof query.status === "string" ? query.status : "all");
  const filter = parsed.success ? parsed.data : "all";
  const requests = await getAdminContactRequests(filter === "all" ? undefined : filter as ContactRequestStatus);

  return <section aria-labelledby="contact-requests-title"><nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Contact Requests</nav><p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-ocean">Request management</p><h1 id="contact-requests-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Contact Requests</h1><p className="mt-3 max-w-2xl text-charcoal/65">General enquiries are listed newest first. Contact content remains managed separately.</p><nav aria-label="Filter contact requests" className="mt-7 flex flex-wrap gap-2">{filters.map((status) => <Link key={status} href={status === "all" ? "/admin/contact-requests" : `/admin/contact-requests?status=${status}`} aria-current={filter === status ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm font-semibold ${filter === status ? "bg-charcoal text-white" : "bg-white"}`}>{status}</Link>)}</nav>{requests.length ? <div className="mt-7 space-y-4">{requests.map((request) => { const label = request.enquiryType?.translations.find((entry) => entry.locale === request.locale)?.label ?? request.enquiryValue; return <article key={request.id} className="rounded-2xl border bg-white p-5 shadow-soft sm:p-6"><div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start"><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-soft-sand px-3 py-1 text-xs font-bold uppercase">{request.status}</span>{request.status === "new" ? <span className="rounded-full bg-ocean px-3 py-1 text-xs font-bold text-white">New</span> : null}<span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase">{request.locale}</span></div><h2 className="mt-4 text-xl font-semibold">{request.name}</h2><p className="mt-1 break-words text-sm text-charcoal/65">{request.email}</p><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-charcoal/55">Enquiry type</dt><dd className="font-medium">{label}</dd></div><div><dt className="text-charcoal/55">Message</dt><dd className="line-clamp-2 font-medium">{request.message}</dd></div><div><dt className="text-charcoal/55">Submitted</dt><dd className="font-medium">{request.createdAt.toLocaleString("en-GB")}</dd></div></dl></div><Link href={`/admin/contact-requests/${request.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full border px-5 font-semibold hover:border-ocean">View details</Link></div></article>; })}</div> : <p className="mt-7 rounded-2xl border bg-white p-8 text-center text-charcoal/65">No contact requests match this filter.</p>}</section>;
}
