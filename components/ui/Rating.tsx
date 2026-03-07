import { Star, StarHalf } from "lucide-react";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showNumber?: boolean;
}

export default function Rating({ rating, maxRating = 5, size = 16, showNumber = false }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf size={size} className="fill-yellow-400 text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-300" />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
      )}
    </div>
  );
}
