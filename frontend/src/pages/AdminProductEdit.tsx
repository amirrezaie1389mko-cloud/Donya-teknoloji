import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Upload, Save, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';
import { Product, Category } from '../lib/types';
import { toPersianDigits } from '../lib/format';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id !== undefined;
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '', discount_price: '', image_url: '',
    category_id: '', inventory: '0', is_featured: false, is_best_seller: false,
    is_published: true, rating: '5.0', review_count: '0',
  });

  useEffect(() => {
    api.getCategories().then(res => setCategories(res.categories)).catch(() => {});
    if (isEdit) {
      api.getProduct(id!).then(res => {
        const p = res.product;
        setForm({
          name: p.name || '', description: p.description || '', price: String(p.price || ''),
          discount_price: p.discount_price ? String(p.discount_price) : '', image_url: p.image_url || '',
          category_id: p.category_id ? String(p.category_id) : '', inventory: String(p.inventory || 0),
          is_featured: p.is_featured, is_best_seller: p.is_best_seller, is_published: p.is_published,
          rating: String(p.rating || 5.0), review_count: String(p.review_count || 0),
        });
      }).catch(() => setError('محصول یافت نشد.')).finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await api.uploadImage(file);
      setForm(f => ({ ...f, image_url: url }));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('نام و قیمت محصول الزامی است.'); return; }
    setSaving(true);
    setError('');
    const data = {
      name: form.name,
      description: form.description,
      price: parseInt(form.price),
      discount_price: form.discount_price ? parseInt(form.discount_price) : null,
      image_url: form.image_url,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      inventory: parseInt(form.inventory) || 0,
      is_featured: form.is_featured,
      is_best_seller: form.is_best_seller,
      is_published: form.is_published,
      rating: parseFloat(form.rating) || 5.0,
      review_count: parseInt(form.review_count) || 0,
    };
    try {
      if (isEdit) {
        await api.updateProduct(id!, data);
      } else {
        await api.createProduct(data);
      }
      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gold text-center py-10">در حال بارگذاری…</div>;

  return (
    <div>
      <nav className="flex items-center gap-2 text-xs text-muted mb-4">
        <Link to="/admin/products" className="hover:text-gold">محصولات</Link>
        <ArrowRight size={12} />
        <span className="text-silver-halide">{isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}</span>
      </nav>
      <h1 className="text-xl font-bold text-ghost-white mb-6">{isEdit ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>}

        <div>
          <label className="block text-sm text-silver-halide mb-2">نام محصول</label>
          <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
        </div>

        <div>
          <label className="block text-sm text-silver-halide mb-2">توضیحات محصول</label>
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
            className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold resize-none" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-silver-halide mb-2">قیمت محصول (تومان)</label>
            <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
              className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" dir="ltr" />
          </div>
          <div>
            <label className="block text-sm text-silver-halide mb-2">قیمت با تخفیف (اختیاری)</label>
            <input type="number" value={form.discount_price} onChange={e => setForm(f => ({ ...f, discount_price: e.target.value }))}
              className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" dir="ltr" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-silver-halide mb-2">دسته‌بندی</label>
            <select value={form.category_id} onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
              className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold">
              <option value="">بدون دسته</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-silver-halide mb-2">موجودی انبار</label>
            <input type="number" value={form.inventory} onChange={e => setForm(f => ({ ...f, inventory: e.target.value }))}
              className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" dir="ltr" />
          </div>
        </div>

        {/* Image upload */}
        <div>
          <label className="block text-sm text-silver-halide mb-2">تصاویر محصول</label>
          <div className="flex items-center gap-4">
            {form.image_url && (
              <img src={form.image_url} alt="پیش‌نمایش" className="w-20 h-20 rounded-xl object-cover bg-elevated border border-subtle-border" />
            )}
            <label className="flex-1 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleUpload(e.target.files[0])} />
              <div className="border-2 border-dashed border-subtle-border rounded-xl p-4 text-center text-sm text-muted hover:border-gold/40 transition-colors">
                {uploading ? 'در حال آپلود…' : (
                  <span className="flex items-center justify-center gap-2">
                    <Upload size={16} />
                    انتخاب تصویر
                  </span>
                )}
              </div>
            </label>
          </div>
          <input type="text" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
            placeholder="یا نشانی تصویر را وارد کنید"
            className="w-full mt-2 bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white placeholder:text-muted focus:outline-none focus:border-gold/40 focus-gold" dir="ltr" />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="accent-gold w-4 h-4" />
            <span className="text-sm text-silver-halide">محصول منتخب</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_best_seller} onChange={e => setForm(f => ({ ...f, is_best_seller: e.target.checked }))} className="accent-gold w-4 h-4" />
            <span className="text-sm text-silver-halide">پرفروش‌ترین</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_published} onChange={e => setForm(f => ({ ...f, is_published: e.target.checked }))} className="accent-gold w-4 h-4" />
            <span className="text-sm text-silver-halide">منتشر شده</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 bg-gold text-obsidian px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-bronze transition-colors disabled:opacity-50 focus-gold">
            <Save size={16} />
            {saving ? 'در حال ذخیره…' : 'ذخیره تغییرات'}
          </button>
          <Link to="/admin/products" className="px-6 py-2.5 rounded-xl text-sm text-silver-halide border border-subtle-border hover:text-ghost-white transition-colors focus-gold">
            لغو
          </Link>
        </div>
      </form>
    </div>
  );
}
