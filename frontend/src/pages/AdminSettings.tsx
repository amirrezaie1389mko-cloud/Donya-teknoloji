import { useEffect, useState } from 'react';
import { KeyRound, UserPlus, Crown, Shield, AlertTriangle } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminSettings() {
  const { user, isOwner } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<'password' | 'admins' | 'transfer'>('password');

  // Password form
  const [pwForm, setPwForm] = useState({ current: '', next: '' });
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' });

  // Admin form
  const [adminForm, setAdminForm] = useState({ email: '', name: '', password: '' });
  const [adminMsg, setAdminMsg] = useState({ type: '', text: '' });

  // Transfer form
  const [transferEmail, setTransferEmail] = useState('');
  const [transferConfirm, setTransferConfirm] = useState(false);
  const [transferMsg, setTransferMsg] = useState({ type: '', text: '' });

  const loadUsers = () => api.getUsers().then(res => setUsers(res.users)).catch(() => {});
  useEffect(() => { loadUsers(); }, []);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg({ type: '', text: '' });
    try {
      const res = await api.changePassword(pwForm.current, pwForm.next);
      setPwMsg({ type: 'success', text: 'رمز عبور با موفقیت تغییر کرد.' });
      setPwForm({ current: '', next: '' });
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message });
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminMsg({ type: '', text: '' });
    try {
      await api.addAdmin(adminForm);
      setAdminMsg({ type: 'success', text: 'مدیر مجاز با موفقیت اضافه شد.' });
      setAdminForm({ email: '', name: '', password: '' });
      loadUsers();
    } catch (err: any) {
      setAdminMsg({ type: 'error', text: err.message });
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setTransferMsg({ type: '', text: '' });
    if (!transferConfirm) { setTransferMsg({ type: 'error', text: 'لطفاً تأیید انتقال را علامت بزنید.' }); return; }
    try {
      await api.transferOwnership(transferEmail);
      setTransferMsg({ type: 'success', text: 'مالکیت با موفقیت منتقل شد. لطفاً دوباره وارد شوید.' });
      setTimeout(() => window.location.href = '/admin/login', 2000);
    } catch (err: any) {
      setTransferMsg({ type: 'error', text: err.message });
    }
  };

  const handleRevoke = async (id: string) => {
    if (!confirm('سطح دسترسی این کاربر به مشتری تغییر یابد؟')) return;
    try { await api.revokeAdmin(id); loadUsers(); } catch (err: any) { alert(err.message); }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-ghost-white mb-6">تنظیمات</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
        <button onClick={() => setTab('password')} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${tab === 'password' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-card text-silver-halide border border-subtle-border'}`}>تغییر رمز عبور</button>
        {isOwner && (
          <>
            <button onClick={() => setTab('admins')} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${tab === 'admins' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-card text-silver-halide border border-subtle-border'}`}>مدیران مجاز</button>
            <button onClick={() => setTab('transfer')} className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${tab === 'transfer' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-card text-silver-halide border border-subtle-border'}`}>انتقال مالکیت</button>
          </>
        )}
      </div>

      {/* Password tab */}
      {tab === 'password' && (
        <div className="max-w-md bg-card rounded-xl border border-subtle-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <KeyRound size={20} className="text-gold" />
            <h2 className="text-sm font-bold text-ghost-white">تغییر رمز عبور</h2>
          </div>
          <form onSubmit={handlePassword} className="space-y-3">
            <div>
              <label className="block text-sm text-silver-halide mb-1">رمز فعلی</label>
              <input type="password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} required dir="ltr"
                className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
            </div>
            <div>
              <label className="block text-sm text-silver-halide mb-1">رمز جدید</label>
              <input type="password" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} required dir="ltr"
                className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
            </div>
            {pwMsg.text && <p className={`text-sm ${pwMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{pwMsg.text}</p>}
            <button type="submit" className="w-full bg-gold text-obsidian py-2.5 rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold">تغییر رمز</button>
          </form>
        </div>
      )}

      {/* Admins tab */}
      {tab === 'admins' && isOwner && (
        <div className="space-y-6">
          <div className="max-w-md bg-card rounded-xl border border-subtle-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-gold" />
              <h2 className="text-sm font-bold text-ghost-white">افزودن مدیر مجاز</h2>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div>
                <label className="block text-sm text-silver-halide mb-1">نام</label>
                <input type="text" value={adminForm.name} onChange={e => setAdminForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
              </div>
              <div>
                <label className="block text-sm text-silver-halide mb-1">ایمیل</label>
                <input type="email" value={adminForm.email} onChange={e => setAdminForm(f => ({ ...f, email: e.target.value }))} required dir="ltr"
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
              </div>
              <div>
                <label className="block text-sm text-silver-halide mb-1">رمز عبور</label>
                <input type="password" value={adminForm.password} onChange={e => setAdminForm(f => ({ ...f, password: e.target.value }))} required dir="ltr"
                  className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
              </div>
              {adminMsg.text && <p className={`text-sm ${adminMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{adminMsg.text}</p>}
              <button type="submit" className="w-full bg-gold text-obsidian py-2.5 rounded-xl font-bold text-sm hover:bg-bronze transition-colors focus-gold">افزودن مدیر</button>
            </form>
          </div>

          <div className="bg-card rounded-xl border border-subtle-border p-6">
            <h2 className="text-sm font-bold text-ghost-white mb-4">لیست کاربران</h2>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between bg-elevated rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    {u.role === 'OWNER' ? <Crown size={18} className="text-gold" /> : <Shield size={18} className="text-silver-halide" />}
                    <div>
                      <p className="text-sm text-ghost-white">{u.name}</p>
                      <p className="text-xs text-muted" dir="ltr">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${u.role === 'OWNER' ? 'bg-gold/10 text-gold' : u.role === 'AUTHORIZED_ADMIN' ? 'bg-blue-500/10 text-blue-400' : 'bg-muted/10 text-muted'}`}>
                      {u.role === 'OWNER' ? 'مالک' : u.role === 'AUTHORIZED_ADMIN' ? 'مدیر مجاز' : 'مشتری'}
                    </span>
                    {u.role === 'AUTHORIZED_ADMIN' && (
                      <button onClick={() => handleRevoke(String(u.id))} className="text-xs text-red-400 hover:underline">سلب دسترسی</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfer tab */}
      {tab === 'transfer' && isOwner && (
        <div className="max-w-md bg-card rounded-xl border border-gold/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-gold" />
            <h2 className="text-sm font-bold text-ghost-white">انتقال مالکیت وب‌سایت</h2>
          </div>
          <p className="text-xs text-muted mb-4 leading-relaxed">
            با انتقال مالکیت، شما به مدیر مجاز تبدیل می‌شوید و کاربر مقصد مالک جدید خواهد بود. این عملیات قابل بازگشت نیست.
          </p>
          <form onSubmit={handleTransfer} className="space-y-3">
            <div>
              <label className="block text-sm text-silver-halide mb-1">ایمیل مالک جدید</label>
              <input type="email" value={transferEmail} onChange={e => setTransferEmail(e.target.value)} required dir="ltr"
                className="w-full bg-elevated border border-subtle-border rounded-xl py-2.5 px-4 text-sm text-ghost-white focus:outline-none focus:border-gold/40 focus-gold" />
            </div>
            <p className="text-xs text-muted">کاربر مقصد باید قبلاً ثبت‌نام کرده باشد (به‌عنوان مدیر مجاز).</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={transferConfirm} onChange={e => setTransferConfirm(e.target.checked)} className="accent-gold w-4 h-4" />
              <span className="text-sm text-silver-halide">تأیید می‌کنم که مالکیت را منتقل می‌کنم.</span>
            </label>
            {transferMsg.text && <p className={`text-sm ${transferMsg.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>{transferMsg.text}</p>}
            <button type="submit" className="w-full bg-red-500/80 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-500 transition-colors focus-gold">
              انتقال مالکیت
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
