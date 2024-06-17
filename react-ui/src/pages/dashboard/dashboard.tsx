import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Review } from "@/components/reviews/type";

import { snakeToCamel } from "@/lib/utils";

import MyProperty from "@/sections/property";
// import MyReviews from "@/sections/reviews";
import MyRecommendations from "@/sections/recommendations";
import { Recommendation } from "@/sections/recommendations/type";
import MyReviews from "@/sections/reviews";
import { PropertyDetails } from "@/sections/property/type";

export default function Dashboard() {
  const [property, setProperty] = useState<PropertyDetails>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  function fetchProperty() {
    fetch("/api/v1/profile")
      .then((response) => response.json())
      .then((data) => setProperty(snakeToCamel(data)))
      .catch((error) => console.error("Error fetching profile:", error));
  }

  function fetchReviews() {
    fetch("/api/v1/profile/reviews")
      .then((response) => response.json())
      .then((data) => setReviews(snakeToCamel(data) as Review[]))
      .catch((error) => console.error("Error fetching reviews:", error));
  }

  function fetchRecommendations() {
    fetch("/api/v1/profile/recommendations")
      .then((response) => response.json())
      .then((data) => {
        setRecommendations(data);
      })
      .catch((error) =>
        console.error("Error fetching recommendations:", error)
      );
  }

  useEffect(() => {
    fetchProperty(), fetchReviews();
  }, []);

  useEffect(fetchRecommendations, [property, reviews]);

  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen">
      <header className="bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">Energy Comparison EPTech</span>
          <div className="flex items-center gap-4">
            <Button onClick={() => {}}>Sign Out</Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-8">
        <MyProperty details={property} refresh={fetchRecommendations} />
        <MyReviews reviews={reviews} refresh={fetchReviews} />
        <MyRecommendations recommendations={recommendations} />
      </main>
    </div>
  );
}
