import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../lib/types';
import ProductCard from './ProductCard';

export default function FeaturedGear() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.getProducts({ featured: 'true' }).then(res => setProducts(res.products)).catch(() => {});
  }, []);

  return (
    <section className="py-10" aria-labelledby="featured-heading">
      <div className="container-lumen">
        <div className="flex items-center justify-between mb-6">
          <h2 id="featured-heading" className="text-xl sm:text-2xl font-bold text-ghost-white">تجهیزات منتخب</h2>
          <Link to="/category/mirrorless" className="flex items-center gap-1 text-sm text-gold hover:text-bronze transition-colors">
            مشاهده همه
            <ArrowLeft size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
