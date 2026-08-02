import type { LucideIcon } from "lucide-react";
import { MessageCircle, Star } from "lucide-react";

import type {
  ReviewPlatformIconKey,
  ReviewsSummaryData,
} from "@/types/review";

const platformIcons = {
  "message-circle": MessageCircle,
  star: Star,
} satisfies Record<ReviewPlatformIconKey, LucideIcon>;

type ReviewsSummaryProps = {
  summary: ReviewsSummaryData;
  labels: { outOfFive: string; basedOn: string; reviews: string };
};

export function ReviewsSummary({ summary, labels }: ReviewsSummaryProps) {
  const PlatformIcon = summary.platformIcon
    ? platformIcons[summary.platformIcon]
    : null;

  return (
    <div className="flex flex-col gap-5 border-y border-warm-line py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-end gap-4">
        <p className="font-display text-6xl font-semibold leading-none tracking-[-0.04em] text-charcoal">
          {summary.averageRating.toFixed(1)}
        </p>
        <div className="pb-1">
          <div
            aria-label={`${summary.averageRating} ${labels.outOfFive}`}
            className="flex gap-1 text-ocean"
          >
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                aria-hidden="true"
                className="size-4 fill-current"
              />
            ))}
          </div>
          <p className="mt-1.5 text-sm text-charcoal/58">
            {labels.basedOn} {summary.totalReviewCount} {labels.reviews}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-bold text-charcoal">
        {PlatformIcon ? (
          <PlatformIcon
            aria-hidden="true"
            className="size-4 text-ocean"
            strokeWidth={1.8}
          />
        ) : null}
        {summary.platformName}
      </div>
    </div>
  );
}
