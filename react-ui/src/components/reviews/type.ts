export interface SupplierReviewProps {
  review: Review;
  modifyReview: (param: Review) => void;
  refreshReviews: () => void;
}

export interface Review {
  id: number;
  provider: string;
  startDate: number;
  endDate: number;
  customerServiceRating: number;
  affordabilityRating: number;
}
