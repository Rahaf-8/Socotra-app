import { Star } from "lucide-react";
import type { ReviewsSummaryData } from "@/types/review";

type ReviewsSummaryProps = {
  summary: ReviewsSummaryData;
  labels: { outOfFive: string; basedOn: string; reviews: string };
};

export function ReviewsSummary({ summary, labels }: ReviewsSummaryProps) {
  const hasReviews = summary.totalReviewCount > 0;
  return (
    <div className="flex flex-col gap-5 border-y border-warm-line py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-end gap-4">
        <p className="font-display text-6xl font-semibold leading-none tracking-[-0.04em] text-charcoal">
          {hasReviews ? summary.averageRating.toFixed(1) : "—"}
        </p>
        <div className="pb-1">
          <div
            aria-label={hasReviews ? `${summary.averageRating} ${labels.outOfFive}` : `${labels.basedOn} 0 ${labels.reviews}`}
            className="flex gap-1 text-ocean"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className={index < Math.round(summary.averageRating) ? "size-4 fill-current" : "size-4 opacity-30"}
              />
            ))}
          </div>
          <p className="mt-1.5 text-sm text-charcoal/58">
            {labels.basedOn} {summary.totalReviewCount} {labels.reviews}
          </p>
        </div>
      </div>

    </div>
  );
}
