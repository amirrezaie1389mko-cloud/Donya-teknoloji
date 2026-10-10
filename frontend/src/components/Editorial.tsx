import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { api } from '../lib/api';
import { Editorial as EditorialType } from '../lib/types';

export default function Editorial() {
  const [items, setItems] = useState<EditorialType[]>([]);

  useEffect(() => {
    api.getEditorial().then(res => setItems(res.editorial)).catch(() => {});
  }, []);

  return (
    <section className="py-10" aria-labelledby="editorial-heading">
      <div className="container-lumen">
        <h2 id="editorial-heading" className="text-xl sm:text-2xl font-bold text-ghost-white mb-6">
          یاد بگیرید، برنامه‌ریزی کنید، بهتر ثبت کنید
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <article key={item.id} className="group bg-card rounded-xl overflow-hidden border border-subtle-border cursor-pointer transition-all hover:border-gold/40">
              <div className="h-40 sm:h-44 overflow-hidden bg-elevated">
                <img src={item.image_url} alt={item.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="p-4">
                <span className="inline-block text-xs text-gold bg-gold/10 px-2 py-1 rounded-md mb-2">{item.category_label}</span>
                <h3 className="text-sm text-ghost-white font-medium leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs text-muted">
                  <Clock size={12} />
                  <span>{item.read_time}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
