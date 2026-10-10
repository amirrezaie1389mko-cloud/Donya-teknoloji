import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, ShoppingCart, Menu, X, Camera } from 'lucide-react';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'فروشگاه', slug: '' },
  { label: 'دوربین‌ها', slug: 'mirrorless' },
  { label: 'لنزها', slug: 'lenses' },
  { label: 'تجهیزات جانبی', slug: 'gimbals' },
  { label: 'کیت‌های تولید محتوا', slug: 'kits' },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { count, setIsOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass-aperture shadow-lg shadow-black/30' : 'bg-obsidian'}`}>
        <div className="container-lumen">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <Camera size={26} className="text-gold" />
              <span className="text-xl font-bold tracking-wider text-ghost-white">LUMEN</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={i}
                  to={link.slug ? `/category/${link.slug}` : '/'}
                  className="text-sm text-silver-halide hover:text-gold transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/category/lighting" className="text-sm text-silver-halide hover:text-gold transition-colors whitespace-nowrap">نورپردازی</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} className="w-10 h-10 grid place-items-center rounded-full hover:bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="جستجو">
                <Search size={20} />
              </button>
              <Link to="/admin/login" className="hidden sm:grid w-10 h-10 place-items-center rounded-full hover:bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="حساب کاربری">
                <User size={20} />
              </Link>
              <Link to="/category/lenses" className="hidden sm:grid w-10 h-10 place-items-center rounded-full hover:bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="علاقه‌مندی‌ها">
                <Heart size={20} />
              </Link>
              <button onClick={() => setIsOpen(true)} className="relative w-10 h-10 grid place-items-center rounded-full hover:bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="سبد خرید">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute -top-0.5 -left-0.5 bg-gold text-obsidian text-[10px] font-bold w-5 h-5 grid place-items-center rounded-full">
                    {count > 9 ? '۹+' : String(count).replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d])}
                  </span>
                )}
              </button>
              <button onClick={() => setDrawerOpen(true)} className="lg:hidden w-10 h-10 grid place-items-center rounded-full hover:bg-elevated text-silver-halide focus-gold" aria-label="منو">
                <Menu size={22} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-3 animate-fade-in">
              <div className="relative">
                <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصول…"
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-3 pr-11 pl-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold"
                  autoFocus
                />
              </div>
            </form>
          )}
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-surface border-l border-subtle-border shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-subtle-border">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2">
                <Camera size={24} className="text-gold" />
                <span className="text-lg font-bold text-ghost-white">LUMEN</span>
              </Link>
              <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-elevated text-silver-halide focus-gold" aria-label="بستن منو">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <Link
                  key={i}
                  to={link.slug ? `/category/${link.slug}` : '/'}
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-3 rounded-xl text-silver-halide hover:bg-elevated hover:text-gold transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/category/lighting" onClick={() => setDrawerOpen(false)} className="px-4 py-3 rounded-xl text-silver-halide hover:bg-elevated hover:text-gold transition-colors text-sm">نورپردازی</Link>
              <Link to="/category/bags" onClick={() => setDrawerOpen(false)} className="px-4 py-3 rounded-xl text-silver-halide hover:bg-elevated hover:text-gold transition-colors text-sm">کیف و لوازم حمل</Link>
              <div className="h-px bg-subtle-border my-2" />
              <Link to="/admin/login" onClick={() => setDrawerOpen(false)} className="px-4 py-3 rounded-xl text-silver-halide hover:bg-elevated hover:text-gold transition-colors text-sm">حساب کاربری / مدیریت</Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
