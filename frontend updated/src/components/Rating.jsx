import React from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text, color = '#fbbf24' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 fill-amber-400 stroke-amber-400"
          style={{ color }}
        />
      );
    } else if (value >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          className="w-4 h-4 fill-amber-400 stroke-amber-400"
          style={{ color }}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className="w-4 h-4 text-slate-300 dark:text-slate-700"
        />
      );
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">{stars}</div>
      {text && (
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 ml-1">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;
