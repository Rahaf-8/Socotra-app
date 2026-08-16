import { Star } from "lucide-react";
import Link from "next/link";

import type { ReviewStatus } from "@/generated/prisma/enums";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminReviews } from "@/lib/reviews/review-repository";
import { reviewFilterSchema } from "@/lib/validation/review";

const filters = ["all", "pending", "approved", "rejected", "archived"] as const;
const statusStyles = {
  pending: "bg-amber-100 text-amber-900",
  approved: "bg-emerald-100 text-emerald-900",
  rejected: "bg-red-100 text-red-900",
  archived: "bg-slate-200 text-slate-900",
} as const;

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  await requireAdmin();
  const query = await searchParams;
  const parsedFilter = reviewFilterSchema.safeParse(typeof query.status === "string" ? query.status : "all");
  const filter = parsedFilter.success ? parsedFilter.data : "all";
  const result = typeof query.result === "string" ? query.result : undefined;
  const reviews = await getAdminReviews(filter === "all" ? undefined : filter as ReviewStatus);

  return <section aria-labelledby="reviews-title">
    <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / Reviews</nav>
    <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-ocean">Moderation</p>
    <h1 id="reviews-title" className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Reviews</h1>
    <p className="mt-3 max-w-3xl leading-7 text-charcoal/65">Review real customer submissions, control public visibility, archive records for preservation, or deliberately delete them.</p>
    {result ? <p role="status" className="mt-5 rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Result: {result.replaceAll("-", " ")}.</p> : null}

    <nav aria-label="Filter reviews" className="mt-7 flex flex-wrap gap-2">
      {filters.map((status) => <Link key={status} href={status === "all" ? "/admin/reviews" : `/admin/reviews?status=${status}`} aria-current={filter === status ? "page" : undefined} className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-semibold capitalize ${filter === status ? "bg-charcoal text-white" : "bg-white"}`}>{status}</Link>)}
    </nav>

    <div className="mt-8 space-y-5">
      {reviews.length ? reviews.map((review) => <article key={review.id} className="min-w-0 rounded-2xl border bg-white p-5 shadow-soft sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><h2 className="break-words font-display text-2xl font-semibold">{review.name}</h2><span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[review.status]}`}>{review.status}</span><span className="rounded-full border px-3 py-1 text-xs font-semibold uppercase">{review.locale}</span></div><p className="mt-1 break-all text-sm text-charcoal/60">{review.email}</p></div>
          <div aria-label={`${review.rating} out of 5 stars`} className="flex shrink-0 gap-1 text-ocean">{[1,2,3,4,5].map((star) => <Star key={star} aria-hidden="true" className={`size-4 ${star <= review.rating ? "fill-current" : "opacity-30"}`} />)}</div>
        </div>
        <p className="mt-5 line-clamp-3 break-words whitespace-pre-wrap leading-7 text-charcoal/75">{review.message}</p>
        <div className="mt-5 flex flex-col gap-4 border-t pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-charcoal/60">Submitted {review.createdAt.toLocaleString("en-GB")}</p><Link href={`/admin/reviews/${review.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full border px-5 text-sm font-semibold hover:border-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2">View and moderate</Link></div>
      </article>) : <p className="rounded-2xl border bg-white p-7 text-charcoal/65 shadow-soft">No reviews match this filter.</p>}
    </div>
  </section>;
}
