export interface Recommendation {
  provider: string;
  affordability_rating: number;
  customer_service_rating: number;
}

export interface RecommendationProps {
  recommendations: Recommendation[];
}
