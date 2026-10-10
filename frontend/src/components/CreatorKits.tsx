import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { Kit } from '../lib/types';
import { formatToman } from '../lib/format';

export default function CreatorKits() {
  const [kits, setKits] = useState<Kit[]>([]);

  useEffect(() => {
    api.getKits().then(res => setKits(res.kits)).catch(() => {});
  }, []);

  return (
    <section className="py-10" aria-labelledby="kits-heading">
      <div className="container-lumen">
        <h2 id="kits-heading" className="text-xl sm:text-2xl font-bold text-ghost-white mb-6 text-center">
          کیت‌های تخصصی برای هر نوع تولید محتوا
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {kits.map(kit => (
            <div key={kit.id} className="group relative rounded-2xl overflow-hidden border border-subtle-border cursor-pointer transition-all hover:border-gold/40">
              <div className="relative h-64 sm:h-80 overflow-hidden">
                <img src={kit.image_url} alt={kit.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <h3 className="text-lg font-bold text-ghost-white mb-1">{kit.title}</h3>
                <p className="text-sm text-silver-halide mb-3 line-clamp-1">{kit.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gold font-bold text-base">{formatToman(kit.price)}</span>
                  <button className="w-10 h-10 grid place-items-center rounded-full bg-gold/10 border border-gold/30 text-gold group-hover:bg-gold group-hover:text-obsidian transition-all focus-gold" aria-label={`مشاهده ${kit.title}`}>
                    <ArrowLeft size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
