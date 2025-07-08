import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  totalStars?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange, totalStars = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={index}
            className={`cursor-pointer ${rating >= starValue ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            onClick={() => onRatingChange && onRatingChange(starValue)}
          />
        );
      })}
    </div>
  );
};

export default StarRating; 