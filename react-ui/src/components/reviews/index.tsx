import { timestampToDateString } from "@/lib/utils";
import StarRating from "../rating";
import { Button } from "../ui/button";
import { TableCell, TableRow } from "../ui/table";
import { SupplierReviewProps } from "./type";

export default function SupplierReview({
  review,
  modifyReview,
}: SupplierReviewProps) {
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
        </TableRow>
      )}
    </>
  );
}
