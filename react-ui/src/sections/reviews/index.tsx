import { Button } from "@/components/ui/button";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { useState } from "react";
import { Review } from "@/components/reviews/type";

import SupplierReview from "@/components/reviews";
import ReviewModal from "@/components/review-modal";
import { MyReviewsProps } from "./type";

export default function MyReviews({ reviews, refresh }: MyReviewsProps) {
  const [showSupplierDialog, setShowSupplierDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | undefined>();

  function modifyReview(review: Review) {
    setSelectedReview(review);
    setShowSupplierDialog(true);
  }

  function addReview() {
    setSelectedReview(undefined);
    setShowSupplierDialog(true);
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">My Suppliers</h2>
          <Button onClick={() => addReview()}>Add</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Supplier</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Affordability</TableHead>
              <TableHead>Service</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review, index) => {
              return (
                <SupplierReview
                  key={index}
                  review={review}
                  modifyReview={modifyReview}
                  refreshReviews={refresh}
                />
              );
            })}
          </TableBody>
        </Table>
        {showSupplierDialog && (
          <ReviewModal
            review={selectedReview}
            modalOpen={showSupplierDialog}
            setModalOpen={setShowSupplierDialog}
            refreshReviews={refresh}
          />
        )}
      </section>
    </>
  );
}
