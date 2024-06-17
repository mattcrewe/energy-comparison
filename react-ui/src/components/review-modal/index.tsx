import { useEffect, useState } from "react";
import StarRating from "../rating";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ReviewModalProps } from "./type";
import {
  dateToDateString,
  dateToTimestamp,
  timestampToDate,
  dateToUTC,
  utcToLocal,
} from "@/lib/utils";
import { Review } from "../reviews/type";

export default function ReviewModal({
  review,
  modalOpen,
  setModalOpen,
  refreshReviews,
}: ReviewModalProps) {
  const [suppliers, setSuppliers] = useState<string[]>([]);
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/v1/suppliers");
        const data = await response.json();
        setSuppliers(data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  const [provider, setProvider] = useState(review?.provider ?? "");
  const [startDate, setStartDate] = useState<Date | undefined>(
    review && timestampToDate(review.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    review && timestampToDate(review.endDate)
  );
  const [price, setPrice] = useState(review?.affordabilityRating ?? 0);
  const [service, setService] = useState(review?.customerServiceRating ?? 0);

  async function updateReview(review: Review) {
    const requestBody = JSON.stringify({
      start_date: dateToTimestamp(startDate ?? new Date()),
      end_date: dateToTimestamp(endDate ?? new Date()),
      affordability_rating: price,
      customer_service_rating: service,
    });

    return fetch(`/api/v1/profile/review/${review.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    }).catch((error) => console.error("Error modifiying review:", error));
  }

  async function createReview() {
    const requestBody = JSON.stringify({
      provider: provider,
      start_date: dateToTimestamp(startDate ?? new Date()),
      end_date: dateToTimestamp(endDate ?? new Date()),
      affordability_rating: price,
      customer_service_rating: service,
    });

    return fetch("/api/v1/profile/review", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    }).catch((error) => console.error("Error creating review:", error));
  }

  function handleSaveReview() {
    (review ? updateReview(review) : createReview()).then(() => {
      setModalOpen(false);
      refreshReviews();
    });
  }

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="sm:max-w-[425px] min-w-[500px]">
        <DialogHeader className="gap-4">
          <DialogTitle>
            {review ? "Edit Supplier" : "Add New Supplier"}
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new supplier you want to add.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 py-6">
          <div className="flex items-center  gap-4">
            <Label htmlFor="new-supplier-name" className="min-w-[125px]">
              Provider Name
            </Label>
            <Select
              value={provider}
              onValueChange={(e) => setProvider(e)}
              disabled={review ? true : false}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a supplier" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier: string, index: number) => (
                  <SelectItem value={supplier} key={index}>
                    {supplier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center grid-cols-5 gap-4">
            <Label htmlFor="new-supplier-start-date" className="min-w-[125px]">
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left col-span-3 justify-start"
                >
                  {startDate
                    ? dateToDateString(startDate)
                    : "Select start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={startDate && utcToLocal(startDate)}
                  onSelect={(date) => date && setStartDate(dateToUTC(date))}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center grid-cols-4 gap-4">
            <Label htmlFor="new-supplier-end-date" className="min-w-[125px]">
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-left col-span-3 justify-start"
                >
                  {endDate ? dateToDateString(endDate) : "Select end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <Calendar
                  mode="single"
                  selected={endDate && utcToLocal(endDate)}
                  onSelect={(date) => date && setEndDate(dateToUTC(date))}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center grid-cols-4 gap-4 h-10">
            <Label
              htmlFor="new-supplier-affordability"
              className="min-w-[125px]"
            >
              Affordability
            </Label>
            <div className="pl-4">
              <StarRating rating={price} setRating={setPrice} />
            </div>
          </div>
          <div className="flex items-center grid-cols-4 gap-4 h-10">
            <Label
              htmlFor="new-supplier-affordability"
              className="min-w-[125px]"
            >
              Service
            </Label>
            <div className="pl-4">
              <StarRating rating={service} setRating={setService} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveReview}>Save</Button>
          <div>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
