import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { Product, Category } from '../lib/types';
import ProductCard from '../components/ProductCard';

const CATEGORY_NAMES: Record<string, string> = {
  mirrorless: 'دوربین‌های بدون آینه',
  dslr: 'دوربین‌های DSLR',
  lenses: 'لنزها',
  drones: 'پهپادها',
  gimbals: 'گیمبال‌ها',
  tripods: 'سه‌پایه‌ها',
  lighting: 'تجهیزات نورپردازی',
  bags: 'کیف و لوازم حمل',
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = {};
    if (slug && slug !== 'kits') params.category = slug;
    if (slug === 'kits') {
      // For kits, we don't have a category - show all products
    }
    api.getProducts(slug === 'kits' ? {} : params)
      .then(res => setProducts(res.products))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  const title = slug ? (CATEGORY_NAMES[slug] || slug) : 'فروشگاه';

  return (
    <div className="container-lumen py-8 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-bold text-ghost-white mb-6">{title}</h1>
      {loading ? (
        <div className="text-center py-20 text-gold">در حال بارگذاری…</div>
      ) : products.length === 0 ? (
        <p className="text-muted text-sm text-center py-20">محصولی در این دسته‌بندی یافت نشد.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
