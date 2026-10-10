import { useState } from 'react';
import { ArrowLeft, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
    camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&h=1080&fit=crop&q=80',
    camera: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=600&fit=crop&q=80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80',
    camera: 'https://images.unsplash.com/photo-1473973266408-ed4e27abdd47?w=800&h=600&fit=crop&q=80',
  },
  {
    bg: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&h=1080&fit=crop&q=80',
    camera: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=800&h=600&fit=crop&q=80',
  },
];

export default function Hero() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(440px, 60vh, 560px)' }} aria-labelledby="hero-heading">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={SLIDES[active].bg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-l from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/40" />
      </div>

      {/* Content */}
      <div className="relative h-full container-lumen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full items-center gap-4">
          {/* Text - right side in RTL */}
          <div className="text-right z-10 max-w-lg lg:mr-0 mr-auto">
            <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ghost-white leading-tight mb-4">
              ثبت کن.<br />
              خلق کن.<br />
              <span className="text-gold-gradient">الهام ببخش.</span>
            </h1>
            <p className="text-sm sm:text-base text-silver-halide mb-6 max-w-md">
              تجهیزات حرفه‌ای برای عکاسانی که دنیا را متفاوت می‌بینند.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/category/mirrorless"
                className="inline-flex items-center gap-2 bg-gold text-obsidian px-6 py-3 rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold"
              >
                مشاهده تجهیزات
                <ArrowLeft size={18} />
              </Link>
              <button className="inline-flex items-center gap-2 glass-aperture text-ghost-white px-5 py-3 rounded-xl text-sm hover:border-gold/40 transition-colors focus-gold">
                <Play size={16} className="text-gold" />
                تماشای ویدئو
              </button>
            </div>
          </div>

          {/* Camera - left side in RTL */}
          <div className="hidden lg:flex items-center justify-center z-10 relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/10 blur-3xl rounded-full" />
              <img
                src={SLIDES[active].camera}
                alt="دوربین حرفه‌ای لومن"
                className="relative w-full max-w-md rounded-2xl object-cover shadow-2xl"
                style={{ aspectRatio: '4/3' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      <button
        onClick={() => setActive(p => (p - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full glass-aperture text-ghost-white hover:text-gold transition-colors z-20 focus-gold"
        aria-label="اسلاید قبلی"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setActive(p => (p + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full glass-aperture text-ghost-white hover:text-gold transition-colors z-20 focus-gold"
        aria-label="اسلاید بعدی"
      >
        <ChevronRight size={20} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all focus-gold ${i === active ? 'w-8 bg-gold' : 'w-2 bg-ghost-white/40'}`}
            aria-label={`اسلاید ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
