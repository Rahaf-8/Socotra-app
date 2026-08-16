import { ReviewCard } from "@/components/reviews/review-card";
import type { Review } from "@/types/review";

type ReviewsGridProps = {
  reviews: readonly Review[];
  labels: { outOfFive: string; submittedBy: string };
};

export function ReviewsGrid({ reviews, labels }: ReviewsGridProps) {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} labels={labels} />
      ))}
    </div>
  );
}
