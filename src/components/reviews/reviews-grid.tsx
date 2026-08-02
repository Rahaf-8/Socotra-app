import { ReviewCard } from "@/components/reviews/review-card";
import type { Review } from "@/types/review";

type ReviewsGridProps = {
  reviews: readonly Review[];
  labels: { outOfFive: string; readOn: string };
};

export function ReviewsGrid({ reviews, labels }: ReviewsGridProps) {
  const visibleReviews = [...reviews]
    .filter((review) => review.published && review.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, 3);

  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {visibleReviews.map((review) => (
        <ReviewCard key={review.id} review={review} labels={labels} />
      ))}
    </div>
  );
}
