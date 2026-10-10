import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Camera, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian grid place-items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Camera size={32} className="text-gold" />
            <span className="text-2xl font-bold tracking-wider text-ghost-white">LUMEN</span>
          </div>
          <p className="text-sm text-muted">پنل مدیریت</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-subtle-border p-6 sm:p-8 space-y-4">
          <div>
            <label className="block text-sm text-silver-halide mb-2">ایمیل</label>
            <div className="relative">
              <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@lumen.ir"
                className="w-full bg-elevated border border-subtle-border rounded-xl py-3 pr-11 pl-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold"
                dir="ltr"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-silver-halide mb-2">رمز عبور</label>
            <div className="relative">
              <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-elevated border border-subtle-border rounded-xl py-3 pr-11 pl-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold"
                dir="ltr"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-obsidian py-3 rounded-xl font-bold text-sm hover:bg-bronze transition-colors disabled:opacity-50 focus-gold"
          >
            {loading ? 'در حال ورود…' : 'ورود به پنل مدیریت'}
          </button>
        </form>
        <p className="text-center text-xs text-muted mt-4">
          دسترسی تنها برای مدیران مجاز.
        </p>
      </div>
    </div>
  );
}
