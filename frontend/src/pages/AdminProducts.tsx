import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category } from '../lib/types';
import { formatToman, toPersianDigits } from '../lib/format';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api.getProducts({}).then(res => setProducts(res.products)).catch(() => {}).finally(() => setLoading(false));
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('آیا از حذف این محصول مطمئن هستید؟')) return;
    try {
      await api.deleteProduct(String(id));
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-xl font-bold text-ghost-white">مدیریت محصولات</h1>
        <Link to="/admin/products/new" className="inline-flex items-center gap-2 bg-gold text-obsidian px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-bronze transition-colors focus-gold">
          <Plus size={16} />
          افزودن محصول جدید
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجوی محصول…"
          className="w-full sm:max-w-xs bg-elevated border border-subtle-border rounded-xl py-2.5 pr-11 pl-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold"
        />
      </div>

      {loading ? (
        <p className="text-gold text-center py-10">در حال بارگذاری…</p>
      ) : (
        <div className="overflow-x-auto bg-card rounded-xl border border-subtle-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-subtle-border text-muted text-xs">
                <th className="text-right p-3 font-medium">تصویر</th>
                <th className="text-right p-3 font-medium">نام محصول</th>
                <th className="text-right p-3 font-medium hidden sm:table-cell">دسته‌بندی</th>
                <th className="text-right p-3 font-medium">قیمت</th>
                <th className="text-right p-3 font-medium hidden sm:table-cell">موجودی</th>
                <th className="text-right p-3 font-medium">وضعیت</th>
                <th className="text-right p-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-subtle-border hover:bg-elevated/50">
                  <td className="p-3">
                    <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover bg-elevated" />
                  </td>
                  <td className="p-3 text-ghost-white max-w-[200px]">
                    <div className="truncate">{p.name}</div>
                    {p.is_featured && <span className="text-xs text-gold">منتخب</span>}
                    {p.is_best_seller && <span className="text-xs text-green-400 mr-2">پرفروش</span>}
                  </td>
                  <td className="p-3 text-silver-halide hidden sm:table-cell">{p.category_name || '—'}</td>
                  <td className="p-3 text-gold whitespace-nowrap">{formatToman(p.price)}</td>
                  <td className="p-3 text-silver-halide hidden sm:table-cell">{toPersianDigits(p.inventory)}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded ${p.is_published ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {p.is_published ? 'منتشر' : 'پیش‌نویس'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Link to={`/admin/products/${p.id}`} className="w-8 h-8 grid place-items-center rounded-lg bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="ویرایش">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => handleDelete(p.id)} className="w-8 h-8 grid place-items-center rounded-lg bg-elevated text-silver-halide hover:text-red-400 transition-colors focus-gold" aria-label="حذف">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-muted py-10 text-sm">محصولی یافت نشد.</p>}
        </div>
      )}
    </div>
  );
}
