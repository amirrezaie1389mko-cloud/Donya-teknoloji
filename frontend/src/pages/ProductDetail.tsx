import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../lib/types';
import { formatToman, toPersianDigits } from '../lib/format';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.getProduct(id!).then(res => setProduct(res.product)).catch(() => setProduct(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-[60vh] grid place-items-center text-gold">در حال بارگذاری…</div>;
  if (!product) return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center">
        <p className="text-muted mb-4">محصول یافت نشد.</p>
        <Link to="/" className="text-gold hover:underline">بازگشت به صفحه اصلی</Link>
      </div>
    </div>
  );

  const isWishlisted = wishlist.includes(product.id);

  return (
    <div className="container-lumen py-8 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted mb-6">
        <Link to="/" className="hover:text-gold">خانه</Link>
        <ArrowRight size={12} />
        {product.category_slug && (
          <>
            <Link to={`/category/${product.category_slug}`} className="hover:text-gold">{product.category_name}</Link>
            <ArrowRight size={12} />
          </>
        )}
        <span className="text-silver-halide">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card rounded-2xl border border-subtle-border p-6 sm:p-8">
        {/* Image */}
        <div className="relative">
          <div className="h-72 sm:h-96 bg-elevated rounded-xl overflow-hidden">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 left-4 w-10 h-10 grid place-items-center rounded-full bg-black/40 backdrop-blur-sm focus-gold"
            aria-label="افزودن به علاقه‌مندی"
          >
            <Heart size={20} className={isWishlisted ? 'fill-gold text-gold' : 'text-ghost-white'} />
          </button>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category_name && (
            <span className="text-xs text-gold bg-gold/10 px-2 py-1 rounded-md w-fit mb-3">{product.category_name}</span>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-ghost-white mb-3">{product.name}</h1>
          <div className="mb-4">
            <StarRating rating={Number(product.rating)} count={product.review_count} size={16} />
          </div>
          <p className="text-sm text-silver-halide leading-relaxed mb-6">{product.description}</p>

          {/* Price */}
          <div className="mb-6">
            {product.discount_price && (
              <p className="text-sm text-muted line-through mb-1">{formatToman(product.price)}</p>
            )}
            <p className="text-2xl font-bold text-gold">{formatToman(product.discount_price || product.price)}</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <Check size={16} className={product.inventory > 0 ? 'text-green-500' : 'text-red-500'} />
            <span className={product.inventory > 0 ? 'text-silver-halide' : 'text-red-400'}>
              {product.inventory > 0 ? `${toPersianDigits(product.inventory)} عدد در انبار` : 'ناموجود'}
            </span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1 bg-elevated rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 grid place-items-center rounded-lg text-silver-halide hover:text-gold focus-gold" aria-label="کاهش تعداد">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center text-ghost-white">{toPersianDigits(qty)}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 grid place-items-center rounded-lg text-silver-halide hover:text-gold focus-gold" aria-label="افزایش تعداد">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.inventory === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-gold text-obsidian py-3 rounded-xl font-bold text-sm hover:bg-bronze transition-colors disabled:opacity-50 focus-gold"
            >
              <ShoppingCart size={18} />
              افزودن به سبد خرید
            </button>
          </div>

          <button
            onClick={() => { addToCart(product, qty); navigate('/'); }}
            disabled={product.inventory === 0}
            className="w-full py-3 border border-gold/30 text-gold rounded-xl font-bold text-sm hover:bg-gold/10 transition-colors disabled:opacity-50 focus-gold"
          >
            خرید فوری
          </button>
        </div>
      </div>
    </div>
  );
}
