import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Testimonial } from '../lib/types';
import StarRating from './StarRating';

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    api.getTestimonials().then(res => setItems(res.testimonials)).catch(() => {});
  }, []);

  return (
    <section className="py-10" aria-labelledby="testi-heading">
      <div className="container-lumen">
        <h2 id="testi-heading" className="text-xl sm:text-2xl font-bold text-ghost-white mb-6 text-center">
          تجربه عکاسان و تولیدکنندگان محتوا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {items.map(t => (
            <div key={t.id} className="bg-card rounded-xl p-5 border border-subtle-border flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <img src={t.avatar_url} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover bg-elevated" />
                <div>
                  <h3 className="text-sm font-bold text-ghost-white">{t.name}</h3>
                  <StarRating rating={t.rating} size={12} />
                </div>
              </div>
              <p className="text-sm text-silver-halide leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
