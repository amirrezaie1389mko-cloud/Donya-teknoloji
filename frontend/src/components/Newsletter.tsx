import { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('نشانی ایمیل معتبر نیست.');
      return;
    }
    setStatus('loading');
    try {
      const res = await api.subscribe(email);
      setStatus('success');
      setMessage(res.message || 'عضویت شما با موفقیت ثبت شد.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'خطا در ثبت عضویت.');
    }
  };

  return (
    <section className="py-10" aria-labelledby="news-heading">
      <div className="container-lumen">
        <div className="relative rounded-2xl overflow-hidden border border-subtle-border">
          {/* Background */}
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=600&fit=crop&q=80" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/60" />
          </div>

          <div className="relative p-8 sm:p-12 lg:p-16 max-w-2xl">
            <h2 id="news-heading" className="text-2xl sm:text-3xl font-bold text-ghost-white mb-3">
              همیشه الهام بگیرید
            </h2>
            <p className="text-sm sm:text-base text-silver-halide mb-6">
              از تازه‌ترین تجهیزات، راهنماهای تخصصی و پیشنهادهای ویژه باخبر شوید.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="نشانی ایمیل خود را وارد کنید"
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-3 pr-11 pl-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold"
                  aria-label="نشانی ایمیل"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="bg-gold text-obsidian px-6 py-3 rounded-xl font-bold text-sm hover:bg-bronze transition-colors disabled:opacity-50 focus-gold whitespace-nowrap"
              >
                {status === 'loading' ? 'در حال ثبت…' : 'عضویت در خبرنامه'}
              </button>
            </form>
            {status === 'success' && (
              <div className="flex items-center gap-2 mt-3 text-gold text-sm animate-fade-in">
                <CheckCircle size={16} />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <p className="mt-3 text-red-400 text-sm animate-fade-in">{message}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
