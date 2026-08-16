import { Quote, Star } from "lucide-react";

import type { Review } from "@/types/review";

type ReviewCardProps = {
  review: Review;
  labels: { outOfFive: string; submittedBy: string };
};

export function ReviewCard({ review, labels }: ReviewCardProps) {
  return (
    <article className="flex h-full flex-col border-t border-ocean/25 bg-white px-6 py-8 shadow-soft sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div
          aria-label={`${review.rating} ${labels.outOfFive}`}
          className="flex gap-1 text-ocean"
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              aria-hidden="true"
              className={
                index < Math.round(review.rating)
                  ? "size-3.5 fill-current"
                  : "size-3.5 opacity-30"
              }
            />
          ))}
        </div>
        <Quote
          aria-hidden="true"
          className="size-7 text-sand"
          strokeWidth={1.3}
        />
      </div>

      <p className="mt-6 line-clamp-6 flex-1 break-words whitespace-pre-wrap text-[0.95rem] leading-7 text-charcoal/70">
        “{review.message}”
      </p>

      <footer className="mt-7 border-t border-warm-line/70 pt-5">
        <div className="flex items-center gap-3">
          <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-soft-sand font-display text-lg font-semibold text-palm"
            >
              {review.name.charAt(0)}
            </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-charcoal">
              {review.name}
            </p>
            <p className="mt-0.5 text-xs text-charcoal/52">
              {labels.submittedBy}
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
