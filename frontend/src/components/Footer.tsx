import { Link } from 'react-router-dom';
import { Camera, Instagram, Twitter, Youtube } from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'فروشگاه',
    links: [
      { label: 'دوربین‌ها', slug: 'mirrorless' },
      { label: 'لنزها', slug: 'lenses' },
      { label: 'پهپادها', slug: 'drones' },
      { label: 'گیمبال‌ها', slug: 'gimbals' },
    ],
  },
  {
    title: 'پشتیبانی',
    links: [
      { label: 'تماس با ما', slug: '' },
      { label: 'شرایط ارسال و بازگشت کالا', slug: '' },
      { label: 'ضمانت محصولات', slug: '' },
      { label: 'پرسش‌های متداول', slug: '' },
    ],
  },
  {
    title: 'راهنما',
    links: [
      { label: 'آموزش عکاسی', slug: '' },
      { label: 'راهنمای خرید تجهیزات', slug: '' },
      { label: 'حریم خصوصی', slug: '' },
      { label: 'شرایط استفاده', slug: '' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-subtle-border mt-20">
      <div className="container-lumen py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Camera size={26} className="text-gold" />
              <span className="text-xl font-bold tracking-wider text-ghost-white">LUMEN</span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              تجهیزات حرفه‌ای برای کسانی که دنیا را متفاوت می‌بینند.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-card border border-subtle-border text-silver-halide hover:text-gold hover:border-gold/30 transition-colors" aria-label="اینستاگرام"><Instagram size={18} /></a>
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-card border border-subtle-border text-silver-halide hover:text-gold hover:border-gold/30 transition-colors" aria-label="توییتر"><Twitter size={18} /></a>
              <a href="#" className="w-9 h-9 grid place-items-center rounded-full bg-card border border-subtle-border text-silver-halide hover:text-gold hover:border-gold/30 transition-colors" aria-label="یوتیوب"><Youtube size={18} /></a>
            </div>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col, i) => (
            <div key={i}>
              <h3 className="text-sm font-bold text-ghost-white mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <Link to={link.slug ? `/category/${link.slug}` : '/'} className="text-sm text-muted hover:text-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-subtle-border text-center">
          <p className="text-xs text-muted">تمامی حقوق این وب‌سایت محفوظ است. © {String(new Date().getFullYear()).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])} لومن</p>
        </div>
      </div>
    </footer>
  );
}
