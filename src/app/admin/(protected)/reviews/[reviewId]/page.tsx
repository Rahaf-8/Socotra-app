import { Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteReview, moderateReview } from "@/lib/actions/review-admin";
import { requireAdmin } from "@/lib/auth/admin";
import { getAdminReview } from "@/lib/reviews/review-repository";
import { reviewIdSchema } from "@/lib/validation/review";

const statuses = ["pending", "approved", "rejected", "archived"] as const;
const panel = "rounded-2xl border bg-white p-5 shadow-soft sm:p-7";

type AdminReviewDetailPageProps = {
  params: Promise<{ reviewId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReviewDetailPage({ params, searchParams }: AdminReviewDetailPageProps) {
  await requireAdmin();
  const [{ reviewId }, query] = await Promise.all([params, searchParams]);
  const parsedId = reviewIdSchema.safeParse(reviewId);
  if (!parsedId.success) notFound();
  const review = await getAdminReview(parsedId.data);
  if (!review) notFound();
  const result = typeof query.result === "string" ? query.result : undefined;

  return <section aria-labelledby="review-title">
    <nav aria-label="Breadcrumb" className="text-sm text-charcoal/60"><Link href="/admin/dashboard" className="underline">Dashboard</Link> / <Link href="/admin/reviews" className="underline">Reviews</Link> / Details</nav>
    <div className="mt-5"><p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean">{review.status} · {review.locale}</p><h1 id="review-title" className="mt-2 break-words font-display text-4xl font-semibold sm:text-5xl">{review.name}</h1></div>
    {result ? <p role="status" className="mt-6 rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Result: {result.replaceAll("-", " ")}.</p> : null}
    <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6">
        <article className={panel}><h2 className="font-display text-2xl font-semibold">Submitted review</h2><div aria-label={`${review.rating} out of 5 stars`} className="mt-4 flex gap-1 text-ocean">{[1,2,3,4,5].map((star) => <Star key={star} aria-hidden="true" className={`size-5 ${star <= review.rating ? "fill-current" : "opacity-30"}`} />)}</div><p className="mt-5 break-words whitespace-pre-wrap leading-8 text-charcoal/75">{review.message}</p></article>
        <article className={panel}><h2 className="font-display text-2xl font-semibold">Reviewer details</h2><dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm text-charcoal/55">Private email</dt><dd className="mt-1 break-all font-medium">{review.email}</dd></div><div><dt className="text-sm text-charcoal/55">Locale</dt><dd className="mt-1 font-medium uppercase">{review.locale}</dd></div><div><dt className="text-sm text-charcoal/55">Submitted</dt><dd className="mt-1 font-medium">{review.createdAt.toLocaleString("en-GB")}</dd></div><div><dt className="text-sm text-charcoal/55">Updated</dt><dd className="mt-1 font-medium">{review.updatedAt.toLocaleString("en-GB")}</dd></div></dl></article>
      </div>
      <div className="space-y-6">
        <form action={moderateReview} className={panel}><input type="hidden" name="id" value={review.id} /><input type="hidden" name="detail" value="1" /><h2 className="font-display text-2xl font-semibold">Moderation</h2><label className="mt-5 block text-sm font-semibold">Status<select name="status" defaultValue={review.status} className="mt-2 min-h-11 w-full rounded-xl border bg-white px-3">{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><button className="mt-5 min-h-11 w-full rounded-full bg-ocean px-5 text-sm font-semibold text-white hover:bg-deep-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2">Save status</button></form>
        <form action={deleteReview} className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6"><input type="hidden" name="id" value={review.id} /><h2 className="font-display text-2xl font-semibold text-red-950">Permanent deletion</h2><p className="mt-2 text-sm leading-6 text-red-900/75">This cannot be undone. Archive the review when record preservation is preferable.</p><label className="mt-4 flex min-h-11 items-center gap-3 text-sm font-semibold text-red-950"><input type="checkbox" name="confirm" className="size-5 accent-red-700" />I confirm permanent deletion</label><button className="mt-4 min-h-11 w-full rounded-full border border-red-300 bg-white px-5 text-sm font-semibold text-red-800 hover:bg-red-100 focus-visible:ring-2 focus-visible:ring-red-700 focus-visible:ring-offset-2">Delete review permanently</button></form>
      </div>
    </div>
  </section>;
}
