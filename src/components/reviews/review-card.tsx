import Image from "next/image";
import Link from "next/link";
import { Quote, Star } from "lucide-react";

import type { Review } from "@/types/review";

type ReviewCardProps = {
  review: Review;
  labels: { outOfFive: string; readOn: string };
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

      {review.reviewTitle ? (
        <h3 className="mt-6 font-display text-[1.75rem] font-semibold leading-tight tracking-[-0.015em] text-charcoal">
          {review.reviewTitle}
        </h3>
      ) : null}
      <p className="mt-4 line-clamp-6 flex-1 text-[0.95rem] leading-7 text-charcoal/70">
        “{review.reviewText}”
      </p>

      <footer className="mt-7 border-t border-warm-line/70 pt-5">
        <div className="flex items-center gap-3">
          {review.guestImage ? (
            <Image
              src={review.guestImage.src}
              alt={review.guestImage.alt}
              width={44}
              height={44}
              className="size-11 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-full bg-soft-sand font-display text-lg font-semibold text-palm"
            >
              {review.guestName.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-charcoal">
              {review.guestName}
            </p>
            <p className="mt-0.5 text-xs text-charcoal/52">
              {[review.guestCountry, review.travelDate]
                .filter(Boolean)
                .join(" · ") || review.source}
            </p>
          </div>
        </div>

        {review.sourceUrl ? (
          <Link
            href={review.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${labels.readOn} ${review.source}: ${review.guestName}`}
            className="mt-4 inline-flex min-h-8 items-center text-xs font-bold text-deep-ocean outline-none transition-colors hover:text-ocean focus-visible:ring-2 focus-visible:ring-ocean focus-visible:ring-offset-2"
          >
            {labels.readOn} {review.source}
          </Link>
        ) : null}
      </footer>
    </article>
  );
}
