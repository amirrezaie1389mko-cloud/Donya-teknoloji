import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toPersianDigits } from '../lib/format';

export default function PromoBanner() {
  return (
    <section className="py-10" aria-labelledby="promo-heading">
      <div className="container-lumen">
        <div className="relative rounded-2xl overflow-hidden border border-gold/20">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-bronze/30 via-card to-bronze/20" />

          {/* Product images */}
          <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-30 hidden md:block">
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card" />
          </div>

          <div className="relative p-6 sm:p-10 flex flex-col items-center text-center md:items-start md:text-right gap-4">
            <span className="text-xs text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/20">فرصتی محدود</span>
            <h2 id="promo-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ghost-white">
              جشنواره تجهیزات عکاسی
            </h2>
            <p className="text-lg sm:text-xl text-gold font-bold">
              تا {toPersianDigits('۲۵')}٪ تخفیف
            </p>
            <p className="text-sm text-silver-halide max-w-md">
              روی محصولات منتخب — فرصتی محدود برای ارتقای تجهیزات شما
            </p>
            <Link
              to="/category/mirrorless"
              className="inline-flex items-center gap-2 bg-gold text-obsidian px-6 py-3 rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold"
            >
              مشاهده پیشنهادها
              <ArrowLeft size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
