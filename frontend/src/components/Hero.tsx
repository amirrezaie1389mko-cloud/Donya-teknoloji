import { ArrowLeft, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const BG_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80';
const CAMERA_IMAGE = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'clamp(440px, 60vh, 560px)' }} aria-labelledby="hero-heading">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={BG_IMAGE} alt="" className="w-full h-full object-cover" />
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
                src={CAMERA_IMAGE}
                alt="دوربین حرفه‌ای لومن"
                className="relative w-full max-w-md rounded-2xl object-cover shadow-2xl"
                style={{ aspectRatio: '4/3' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
