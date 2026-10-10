import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Circle, Plane, Aperture, Triangle, Lightbulb, Briefcase, CameraOff } from 'lucide-react';
import { api } from '../lib/api';
import { Category } from '../lib/types';

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Camera, Circle, Plane, Aperture, Triangle, Lightbulb, Briefcase, CameraOff,
};

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {});
  }, []);

  if (categories.length === 0) {
    // Fallback static categories
    const fallback = [
      { name: 'دوربین‌های بدون آینه', slug: 'mirrorless', icon: 'Camera' },
      { name: 'دوربین‌های DSLR', slug: 'dslr', icon: 'CameraOff' },
      { name: 'لنزها', slug: 'lenses', icon: 'Circle' },
      { name: 'پهپادها', slug: 'drones', icon: 'Plane' },
      { name: 'گیمبال‌ها', slug: 'gimbals', icon: 'Aperture' },
      { name: 'سه‌پایه‌ها', slug: 'tripods', icon: 'Triangle' },
      { name: 'تجهیزات نورپردازی', slug: 'lighting', icon: 'Lightbulb' },
      { name: 'کیف و لوازم حمل', slug: 'bags', icon: 'Briefcase' },
    ];
    return (
      <section className="py-10" aria-labelledby="cat-heading">
        <div className="container-lumen">
          <h2 id="cat-heading" className="sr-only">دسته‌بندی محصولات</h2>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 lg:grid lg:grid-cols-8 lg:gap-4">
            {fallback.map((cat, i) => {
              const Icon = ICONS[cat.icon] || Camera;
              return (
                <Link key={i} to={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-subtle-border grid place-items-center text-silver-halide group-hover:border-gold/50 group-hover:text-gold transition-all">
                    <Icon size={28} />
                  </div>
                  <span className="text-xs text-silver-halide group-hover:text-gold transition-colors text-center whitespace-nowrap">{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10" aria-labelledby="cat-heading">
      <div className="container-lumen">
        <h2 id="cat-heading" className="sr-only">دسته‌بندی محصولات</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 lg:grid lg:grid-cols-8 lg:gap-4">
          {categories.map(cat => {
            const Icon = ICONS[cat.icon] || Camera;
            return (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="flex flex-col items-center gap-2 flex-shrink-0 group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-subtle-border grid place-items-center text-silver-halide group-hover:border-gold/50 group-hover:text-gold transition-all">
                  <Icon size={28} />
                </div>
                <span className="text-xs text-silver-halide group-hover:text-gold transition-colors text-center whitespace-nowrap">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
