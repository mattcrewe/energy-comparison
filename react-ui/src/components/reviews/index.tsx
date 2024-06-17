import { timestampToDateString } from "@/lib/utils";
import StarRating from "../rating";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import { SupplierReviewProps } from "./type";

export default function SupplierReview({
  review,
  modifyReview,
  refreshReviews,
}: SupplierReviewProps) {
  function deleteReview() {
    fetch(`/api/v1/profile/review/${review.id}`, {
      method: "DELETE",
    })
      .then(refreshReviews)
      .catch((error) => console.error("Error fetching reviews:", error));
  }

  return (
    <>
      {review && (
        <TableRow key={review.id}>
          <TableCell>{review.provider}</TableCell>
          <TableCell>{timestampToDateString(review.startDate)}</TableCell>
          <TableCell>{timestampToDateString(review.endDate)}</TableCell>
          <TableCell>
            <StarRating rating={review.affordabilityRating} />
          </TableCell>
          <TableCell>
            <StarRating rating={review.customerServiceRating} />
          </TableCell>
          <TableCell>
            <Button variant="outline" onClick={() => modifyReview(review)}>
              Edit
            </Button>
          </TableCell>
          <TableCell>
            <Button variant="destructive" onClick={() => deleteReview()}>
              Delete
            </Button>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
