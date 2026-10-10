import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatToman, toPersianDigits } from '../lib/format';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, total, count, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)} />
      <div className="absolute top-0 left-0 bottom-0 w-[22rem] max-w-[90vw] bg-surface border-r border-subtle-border shadow-2xl flex flex-col animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-subtle-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-gold" />
            <h2 className="text-base font-bold text-ghost-white">سبد خرید</h2>
            <span className="text-xs text-muted">({toPersianDigits(count)} کالا)</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-elevated text-silver-halide focus-gold" aria-label="بستن سبد خرید">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-8">
            <div className="text-center">
              <ShoppingBag size={48} className="text-muted mx-auto mb-4" />
              <p className="text-silver-halide text-sm">سبد خرید شما خالی است.</p>
              <button onClick={() => setIsOpen(false)} className="mt-4 text-gold text-sm hover:underline">ادامه خرید</button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-card rounded-xl p-3 border border-subtle-border">
                  <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-elevated flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs text-ghost-white font-medium line-clamp-2 mb-1">{item.product.name}</h3>
                    <p className="text-gold text-sm font-bold">{formatToman(item.product.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 grid place-items-center rounded-md bg-elevated text-silver-halide hover:text-gold focus-gold" aria-label="کاهش تعداد">
                        <Minus size={14} />
                      </button>
                      <span className="text-sm text-ghost-white w-6 text-center">{toPersianDigits(item.quantity)}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 grid place-items-center rounded-md bg-elevated text-silver-halide hover:text-gold focus-gold" aria-label="افزایش تعداد">
                        <Plus size={14} />
                      </button>
                      <button onClick={() => removeFromCart(item.product.id)} className="mr-auto w-7 h-7 grid place-items-center rounded-md text-muted hover:text-red-400 focus-gold" aria-label="حذف از سبد">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-subtle-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-silver-halide">مبلغ کل:</span>
                <span className="text-gold font-bold text-base">{formatToman(total)}</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); navigate('/'); }}
                className="w-full py-3 bg-gold text-obsidian rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold"
              >
                ادامه فرآیند خرید
              </button>
              <button onClick={clearCart} className="w-full py-2 text-xs text-muted hover:text-red-400 transition-colors">پاک کردن سبد</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
