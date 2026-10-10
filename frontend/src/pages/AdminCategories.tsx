import { useEffect, useState } from 'react';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import { api } from '../lib/api';
import { Category } from '../lib/types';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', icon: 'Camera', sort_order: '0' });

  const load = () => {
    setLoading(true);
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { name: form.name, slug: form.slug, icon: form.icon, sort_order: parseInt(form.sort_order) || 0 };
      if (editId) {
        await api.updateCategory(String(editId), data);
      } else {
        await api.createCategory(data);
      }
      setShowForm(false);
      setEditId(null);
      setForm({ name: '', slug: '', icon: 'Camera', sort_order: '0' });
      load();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon || 'Camera', sort_order: String(cat.sort_order || 0) });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('حذف این دسته‌بندی؟')) return;
    try { await api.deleteCategory(String(id)); load(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-ghost-white">مدیریت دسته‌بندی‌ها</h1>
        <button onClick={() => { setEditId(null); setForm({ name: '', slug: '', icon: 'Camera', sort_order: '0' }); setShowForm(true); }}
          className="inline-flex items-center gap-2 bg-gold text-obsidian px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-bronze transition-colors focus-gold">
          <Plus size={16} />
          افزودن دسته
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="bg-card rounded-2xl border border-subtle-border p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ghost-white">{editId ? 'ویرایش دسته' : 'دسته جدید'}</h2>
              <button onClick={() => setShowForm(false)} className="text-silver-halide hover:text-ghost-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-silver-halide mb-1">نام</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
              </div>
              <div>
                <label className="block text-sm text-silver-halide mb-1">شناسه (انگلیسی)</label>
                <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required dir="ltr"
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
              </div>
              <div>
                <label className="block text-sm text-silver-halide mb-1">آیکون</label>
                <input type="text" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" dir="ltr" />
              </div>
              <button type="submit" className="w-full bg-gold text-obsidian py-2.5 rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold">
                ذخیره
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gold text-center py-10">در حال بارگذاری…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-card rounded-xl border border-subtle-border p-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-ghost-white">{cat.name}</h3>
                <p className="text-xs text-muted" dir="ltr">{cat.slug}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleEdit(cat)} className="w-8 h-8 grid place-items-center rounded-lg bg-elevated text-silver-halide hover:text-gold transition-colors focus-gold" aria-label="ویرایش">
                  <Pencil size={14} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 grid place-items-center rounded-lg bg-elevated text-silver-halide hover:text-red-400 transition-colors focus-gold" aria-label="حذف">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
