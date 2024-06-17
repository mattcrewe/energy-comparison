import { Review } from "@/components/reviews/type";

export interface MyReviewsProps {
  reviews: Review[];
  refresh: () => void;
}
