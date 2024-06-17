import StarRating from "@/components/rating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RecommendationProps } from "./type";

export default function MyRecommendations({
  recommendations,
}: RecommendationProps) {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-4">Recommended Suppliers</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Affordability</TableHead>
            <TableHead>Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((recommendation, index) => (
            <TableRow key={index}>
              <TableCell>{recommendation.provider}</TableCell>
              <TableCell>
                <StarRating rating={recommendation.affordability_rating} />
              </TableCell>
              <TableCell>
                <StarRating rating={recommendation.customer_service_rating} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
