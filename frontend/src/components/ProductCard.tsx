import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/types';
import { formatToman } from '../lib/format';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, variant = 'grid' }: { product: Product; variant?: 'grid' | 'compact' }) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();
  const isWishlisted = wishlist.includes(product.id);

  if (variant === 'compact') {
    return (
      <div
        className="group flex-shrink-0 w-[200px] sm:w-[240px] bg-card rounded-xl border border-subtle-border overflow-hidden cursor-pointer transition-all hover:border-gold/40"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <div className="h-36 bg-elevated overflow-hidden">
          <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-3">
          <h3 className="text-sm text-ghost-white font-medium leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">{product.name}</h3>
          <StarRating rating={Number(product.rating)} count={product.review_count} size={12} />
          <p className="text-gold font-bold text-sm mt-2">{formatToman(product.price)}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-card rounded-xl border border-subtle-border overflow-hidden cursor-pointer transition-all duration-300 hover:border-gold/40 hover:shadow-lg hover:shadow-black/30"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="relative h-48 sm:h-52 bg-elevated overflow-hidden">
        <img src={product.image_url} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <button
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-3 left-3 w-9 h-9 grid place-items-center rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-black/60 focus-gold"
          aria-label="افزودن به علاقه‌مندی"
        >
          <Heart size={18} className={isWishlisted ? 'fill-gold text-gold' : 'text-ghost-white'} />
        </button>
        {product.discount_price && (
          <span className="absolute top-3 right-3 bg-gold text-obsidian text-xs font-bold px-2 py-1 rounded-md">تخفیف</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm sm:text-base text-ghost-white font-medium leading-snug line-clamp-2 mb-2 min-h-[2.8rem]">{product.name}</h3>
        <StarRating rating={Number(product.rating)} count={product.review_count} />
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.discount_price && (
              <p className="text-xs text-muted line-through">{formatToman(product.price)}</p>
            )}
            <p className="text-gold font-bold text-sm sm:text-base">
              {formatToman(product.discount_price || product.price)}
            </p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            className="w-10 h-10 grid place-items-center rounded-full bg-gold/10 border border-gold/30 text-gold transition-all hover:bg-gold hover:text-obsidian focus-gold"
            aria-label="افزودن به سبد خرید"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
