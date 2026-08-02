import type { Review, ReviewsSummaryData } from "@/types/review";

export const placeholderReviewsSummary = {
  averageRating: 5,
  totalReviewCount: 120,
  platformName: "Tripadvisor",
  platformIcon: "message-circle",
} satisfies ReviewsSummaryData;

/**
 * Development-only sample records.
 * ReviewsSection prevents these unverified records from rendering in production.
 */
export const placeholderReviews = [
  {
    id: "placeholder-review-1",
    guestName: "Placeholder Guest 01",
    rating: 5,
    reviewTitle: "A memorable island journey",
    reviewText:
      "Temporary review copy illustrating how an approved guest experience will appear. Replace this text with an authentic, permissioned client review before publication.",
    source: "Tripadvisor",
    featured: true,
    published: true,
    displayOrder: 1,
  },
  {
    id: "placeholder-review-2",
    guestName: "Placeholder Guest 02",
    rating: 5,
    reviewTitle: "Thoughtfully planned from start to finish",
    reviewText:
      "Temporary review copy reserved for development and visual testing. Final wording, guest identity, travel details, and source must be verified by the client.",
    source: "Tripadvisor",
    featured: true,
    published: true,
    displayOrder: 2,
  },
  {
    id: "placeholder-review-3",
    guestName: "Placeholder Guest 03",
    rating: 5,
    reviewTitle: "An extraordinary natural experience",
    reviewText:
      "Temporary review copy demonstrating the intended editorial card length. Only authentic reviews with confirmed publication permission may replace this placeholder.",
    source: "Tripadvisor",
    featured: true,
    published: true,
    displayOrder: 3,
  },
] satisfies readonly Review[];
