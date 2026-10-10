import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import CategoryNav from '../components/CategoryNav';
import FeaturedGear from '../components/FeaturedGear';
import BestSellers from '../components/BestSellers';
import CreatorKits from '../components/CreatorKits';
import Editorial from '../components/Editorial';
import PromoBanner from '../components/PromoBanner';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';
import { api } from '../lib/api';
import { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (searchQuery) {
      api.getProducts({ search: searchQuery }).then(res => setResults(res.products)).catch(() => setResults([]));
    }
  }, [searchQuery]);

  if (searchQuery) {
    return (
      <div className="container-lumen py-8 min-h-screen">
        <h1 className="text-xl font-bold text-ghost-white mb-6">
          نتایج جستجو برای: <span className="text-gold">{searchQuery}</span>
        </h1>
        {results.length === 0 ? (
          <p className="text-muted text-sm">محصولی یافت نشد.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {results.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <main>
      <Hero />
      <CategoryNav />
      <FeaturedGear />
      <BestSellers />
      <CreatorKits />
      <Editorial />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
    </main>
  );
}
