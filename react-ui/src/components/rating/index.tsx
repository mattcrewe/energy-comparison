import StarIcon from "@/components/rating/star-icon";

interface StarRatingProps {
  rating: number;
  setRating?: (param: number) => void;
}

export default function StarRating({ rating, setRating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <button key={i} onClick={() => setRating && setRating(i + 1)}>
          <StarIcon
            className={`w-4 h-4 ${
              i < rating ? "fill-primary" : "fill-muted stroke-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
