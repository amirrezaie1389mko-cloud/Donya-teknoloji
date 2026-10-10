import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FolderTree, Star, TrendingUp, Plus } from 'lucide-react';
import { api } from '../lib/api';
import { toPersianDigits } from '../lib/format';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, featured: 0, bestSellers: 0 });

  useEffect(() => {
    Promise.all([
      api.getProducts(),
      api.getCategories(),
    ]).then(([prodRes, catRes]) => {
      setStats({
        products: prodRes.products.length,
        categories: catRes.categories.length,
        featured: prodRes.products.filter((p: any) => p.is_featured).length,
        bestSellers: prodRes.products.filter((p: any) => p.is_best_seller).length,
      });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'کل محصولات', value: stats.products, icon: Package, color: 'text-gold' },
    { label: 'دسته‌بندی‌ها', value: stats.categories, icon: FolderTree, color: 'text-blue-400' },
    { label: 'محصولات منتخب', value: stats.featured, icon: Star, color: 'text-amber-400' },
    { label: 'پرفروش‌ترین‌ها', value: stats.bestSellers, icon: TrendingUp, color: 'text-green-400' },
  ];

  return (
    <div>
      <h1 className="text-xl font-bold text-ghost-white mb-6">داشبورد مدیریت</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-card rounded-xl border border-subtle-border p-5">
              <Icon size={24} className={card.color + ' mb-3'} />
              <p className="text-2xl font-bold text-ghost-white">{toPersianDigits(card.value)}</p>
              <p className="text-xs text-muted mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>
      <div className="bg-card rounded-xl border border-subtle-border p-5">
        <h2 className="text-sm font-bold text-ghost-white mb-4">اقدامات سریع</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-gold text-obsidian px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-bronze transition-colors focus-gold">
            <Plus size={16} />
            افزودن محصول جدید
          </Link>
          <Link to="/admin/products" className="inline-flex items-center gap-2 bg-elevated text-silver-halide px-4 py-2.5 rounded-xl text-sm font-bold hover:text-gold transition-colors focus-gold">
            <Package size={16} />
            مدیریت محصولات
          </Link>
          <Link to="/admin/categories" className="inline-flex items-center gap-2 bg-elevated text-silver-halide px-4 py-2.5 rounded-xl text-sm font-bold hover:text-gold transition-colors focus-gold">
            <FolderTree size={16} />
            مدیریت دسته‌بندی‌ها
          </Link>
        </div>
      </div>
    </div>
  );
}
