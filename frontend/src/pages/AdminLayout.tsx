import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Camera, LayoutDashboard, Package, FolderTree, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const NAV = [
  { to: '/admin', label: 'داشبورد', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'محصولات', icon: Package, end: false },
  { to: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree, end: false },
  { to: '/admin/settings', label: 'تنظیمات', icon: Settings, end: false },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 right-0 z-30 h-screen w-64 bg-surface border-l border-subtle-border flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-subtle-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera size={24} className="text-gold" />
            <span className="text-lg font-bold text-ghost-white">LUMEN</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden w-8 h-8 grid place-items-center text-silver-halide" aria-label="بستن منو">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${isActive ? 'bg-gold/10 text-gold border border-gold/20' : 'text-silver-halide hover:bg-elevated hover:text-ghost-white'}`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t border-subtle-border">
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-muted">{user?.name}</p>
            <p className="text-xs text-gold">{user?.role === 'OWNER' ? 'مالک' : 'مدیر مجاز'}</p>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-colors">
            <LogOut size={18} />
            خروج
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-10 bg-surface border-b border-subtle-border p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 grid place-items-center text-silver-halide" aria-label="منو">
            <Menu size={22} />
          </button>
          <span className="text-sm font-bold text-ghost-white">پنل مدیریت</span>
          <div className="w-9" />
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
