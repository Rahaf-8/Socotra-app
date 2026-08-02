export type ReviewPlatformIconKey = "message-circle" | "star";

export type ReviewGuestImage = {
  src: string;
  alt: string;
};

export type Review = {
  id: string;
  guestName: string;
  guestImage?: ReviewGuestImage;
  guestCountry?: string;
  rating: number;
  reviewTitle?: string;
  reviewText: string;
  travelDate?: string;
  publishedDate?: string;
  source: string;
  sourceUrl?: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
};

export type ReviewsSummaryData = {
  averageRating: number;
  totalReviewCount: number;
  platformName: string;
  platformIcon?: ReviewPlatformIconKey;
  platformUrl?: string;
};
