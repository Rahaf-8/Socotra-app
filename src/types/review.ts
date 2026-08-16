export type Review = {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
};

export type ReviewsSummaryData = {
  averageRating: number;
  totalReviewCount: number;
};
