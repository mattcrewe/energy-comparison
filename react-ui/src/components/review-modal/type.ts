import { Review } from "../reviews/type";

export interface ReviewModalProps {
  review?: Review;
  modalOpen: boolean;
  setModalOpen: (param: boolean) => void;
  refreshReviews: () => void;
}
