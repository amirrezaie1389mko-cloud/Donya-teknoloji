import { Star } from 'lucide-react';
import { toPersianDigits } from '../lib/format';

export default function StarRating({ rating, count, size = 14 }: { rating: number; count?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5" dir="ltr">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(n => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(rating) ? 'fill-gold text-gold' : 'text-muted'}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted">({toPersianDigits(count)})</span>
      )}
    </div>
  );
}
