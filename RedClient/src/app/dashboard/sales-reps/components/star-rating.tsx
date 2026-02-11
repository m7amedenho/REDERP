// components/star-rating.tsx
import { IconStar, IconStarFilled } from "@tabler/icons-react";

interface StarRatingProps {
  rating: number;
  size?: number;
}

export function StarRating({ rating, size = 16 }: StarRatingProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) =>
        star <= rating ? (
          <IconStarFilled
            key={star}
            className="text-yellow-500"
            size={size}
          />
        ) : (
          <IconStar
            key={star}
            className="text-gray-300"
            size={size}
          />
        )
      )}
      <span className="text-sm text-muted-foreground mr-2">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
}