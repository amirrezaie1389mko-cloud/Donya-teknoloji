import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getProducts({ best_seller: 'true' }).then(res => setProducts(res.products)).catch(() => {});
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  return (
    <section className="py-10" aria-labelledby="best-heading">
      <div className="container-lumen">
        <div className="flex items-center justify-between mb-6">
          <h2 id="best-heading" className="text-xl sm:text-2xl font-bold text-ghost-white">پرفروش‌ترین محصولات</h2>
          <div className="flex items-center gap-3">
            <Link to="/category/lenses" className="flex items-center gap-1 text-sm text-gold hover:text-bronze transition-colors">
              مشاهده همه
              <ArrowLeft size={16} />
            </Link>
            <div className="hidden sm:flex items-center gap-1">
              <button onClick={() => scroll('right')} className="w-9 h-9 grid place-items-center rounded-full bg-card border border-subtle-border text-silver-halide hover:text-gold hover:border-gold/30 transition-colors focus-gold" aria-label="قبلی">
                <ChevronRight size={18} />
              </button>
              <button onClick={() => scroll('left')} className="w-9 h-9 grid place-items-center rounded-full bg-card border border-subtle-border text-silver-halide hover:text-gold hover:border-gold/30 transition-colors focus-gold" aria-label="بعدی">
                <ChevronLeft size={18} />
              </button>
            </div>
          </div>
        </div>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2">
          {products.map(p => (
            <div key={p.id} className="snap-start">
              <ProductCard product={p} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
