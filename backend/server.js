const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, initDB } = require('./db');
const { verifyToken, requireAdmin, requireOwner } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-secret-placeholder-change-in-production-7f3a9b2e';
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Ensure uploads dir
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/api/uploads', express.static(UPLOAD_DIR));

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|webp|gif/.test(file.mimetype);
    cb(ok ? null : new Error('فقط فایل تصویری مجاز است.'), ok);
  },
});

// ── Health ──
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ── Auth ──
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است.' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'کاربر یافت نشد.' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'رمز عبور نادرست است.' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'کاربر یافت نشد.' });
    res.json({ user: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Products ──
app.get('/api/products', async (req, res) => {
  try {
    const { category, featured, best_seller, search } = req.query;
    let q = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_published = true';
    const params = [];
    const conds = [];
    if (category) { params.push(category); conds.push(`c.slug = $${params.length}`); }
    if (featured === 'true') conds.push('p.is_featured = true');
    if (best_seller === 'true') conds.push('p.is_best_seller = true');
    if (search) { params.push(`%${search}%`); conds.push(`p.name ILIKE $${params.length}`); }
    if (conds.length) q += ' AND ' + conds.join(' AND ');
    q += ' ORDER BY p.created_at DESC';
    const { rows } = await pool.query(q, params);
    res.json({ products: rows });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'محصول یافت نشد.' });
    res.json({ product: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// Admin product CRUD
app.post('/api/products', verifyToken, requireAdmin, async (req, res) => {
  const { name, description, price, discount_price, image_url, category_id, inventory, is_featured, is_best_seller, is_published, rating, review_count } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'نام و قیمت الزامی است.' });
  try {
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, discount_price, image_url, category_id, inventory, is_featured, is_best_seller, is_published, rating, review_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [name, description || '', price, discount_price || null, image_url || '', category_id || null, inventory || 0, is_featured || false, is_best_seller || false, is_published !== false, rating || 5.0, review_count || 0]
    );
    res.json({ product: rows[0] });
  } catch (e) {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.put('/api/products/:id', verifyToken, requireAdmin, async (req, res) => {
  const fields = ['name', 'description', 'price', 'discount_price', 'image_url', 'category_id', 'inventory', 'is_featured', 'is_best_seller', 'is_published', 'rating', 'review_count'];
  const sets = [];
  const vals = [];
  let i = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f} = $${i}`); vals.push(req.body[f]); i++; }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'فیلدی برای به‌روزرسانی وجود ندارد.' });
  vals.push(req.params.id);
  try {
    const { rows } = await pool.query(`UPDATE products SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (rows.length === 0) return res.status(404).json({ error: 'محصول یافت نشد.' });
    res.json({ product: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.delete('/api/products/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'محصول یافت نشد.' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Categories ──
app.get('/api/categories', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY sort_order, id');
    res.json({ categories: rows });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.post('/api/categories', verifyToken, requireAdmin, async (req, res) => {
  const { name, slug, icon, sort_order } = req.body;
  if (!name || !slug) return res.status(400).json({ error: 'نام و شناسه الزامی است.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories (name, slug, icon, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [name, slug, icon || '', sort_order || 0]
    );
    res.json({ category: rows[0] });
  } catch (e) {
    if (e.code === '23505') return res.status(409).json({ error: 'این شناسه قبلاً ثبت شده است.' });
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.put('/api/categories/:id', verifyToken, requireAdmin, async (req, res) => {
  const fields = ['name', 'slug', 'icon', 'sort_order'];
  const sets = []; const vals = []; let i = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f} = $${i}`); vals.push(req.body[f]); i++; }
  }
  if (!sets.length) return res.status(400).json({ error: 'فیلدی برای به‌روزرسانی وجود ندارد.' });
  vals.push(req.params.id);
  try {
    const { rows } = await pool.query(`UPDATE categories SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (rows.length === 0) return res.status(404).json({ error: 'دسته‌بندی یافت نشد.' });
    res.json({ category: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.delete('/api/categories/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Kits ──
app.get('/api/kits', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM kits WHERE is_published = true ORDER BY sort_order');
    res.json({ kits: rows });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.post('/api/kits', verifyToken, requireAdmin, async (req, res) => {
  const { title, description, price, image_url, sort_order } = req.body;
  if (!title || price == null) return res.status(400).json({ error: 'عنوان و قیمت الزامی است.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO kits (title, description, price, image_url, is_published, sort_order) VALUES ($1,$2,$3,$4,true,$5) RETURNING *',
      [title, description || '', price, image_url || '', sort_order || 0]
    );
    res.json({ kit: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.put('/api/kits/:id', verifyToken, requireAdmin, async (req, res) => {
  const fields = ['title', 'description', 'price', 'image_url', 'is_published', 'sort_order'];
  const sets = []; const vals = []; let i = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f} = $${i}`); vals.push(req.body[f]); i++; }
  }
  if (!sets.length) return res.status(400).json({ error: 'فیلدی برای به‌روزرسانی وجود ندارد.' });
  vals.push(req.params.id);
  try {
    const { rows } = await pool.query(`UPDATE kits SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (rows.length === 0) return res.status(404).json({ error: 'کیت یافت نشد.' });
    res.json({ kit: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.delete('/api/kits/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM kits WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Editorial ──
app.get('/api/editorial', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM editorial WHERE is_published = true ORDER BY id');
    res.json({ editorial: rows });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.post('/api/editorial', verifyToken, requireAdmin, async (req, res) => {
  const { category_label, title, image_url, read_time } = req.body;
  if (!title) return res.status(400).json({ error: 'عنوان الزامی است.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO editorial (category_label, title, image_url, read_time, is_published) VALUES ($1,$2,$3,$4,true) RETURNING *',
      [category_label || '', title, image_url || '', read_time || '']
    );
    res.json({ editorial: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.put('/api/editorial/:id', verifyToken, requireAdmin, async (req, res) => {
  const fields = ['category_label', 'title', 'image_url', 'read_time', 'is_published'];
  const sets = []; const vals = []; let i = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f} = $${i}`); vals.push(req.body[f]); i++; }
  }
  if (!sets.length) return res.status(400).json({ error: 'فیلدی برای به‌روزرسانی وجود ندارد.' });
  vals.push(req.params.id);
  try {
    const { rows } = await pool.query(`UPDATE editorial SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (rows.length === 0) return res.status(404).json({ error: 'مقاله یافت نشد.' });
    res.json({ editorial: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.delete('/api/editorial/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM editorial WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Testimonials ──
app.get('/api/testimonials', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM testimonials WHERE is_published = true ORDER BY id');
    res.json({ testimonials: rows });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.post('/api/testimonials', verifyToken, requireAdmin, async (req, res) => {
  const { name, text, rating, avatar_url } = req.body;
  if (!name || !text) return res.status(400).json({ error: 'نام و متن الزامی است.' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO testimonials (name, text, rating, avatar_url, is_published) VALUES ($1,$2,$3,$4,true) RETURNING *',
      [name, text, rating || 5, avatar_url || '']
    );
    res.json({ testimonial: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.put('/api/testimonials/:id', verifyToken, requireAdmin, async (req, res) => {
  const fields = ['name', 'text', 'rating', 'avatar_url', 'is_published'];
  const sets = []; const vals = []; let i = 1;
  for (const f of fields) {
    if (req.body[f] !== undefined) { sets.push(`${f} = $${i}`); vals.push(req.body[f]); i++; }
  }
  if (!sets.length) return res.status(400).json({ error: 'فیلدی برای به‌روزرسانی وجود ندارد.' });
  vals.push(req.params.id);
  try {
    const { rows } = await pool.query(`UPDATE testimonials SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`, vals);
    if (rows.length === 0) return res.status(404).json({ error: 'نظر یافت نشد.' });
    res.json({ testimonial: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

app.delete('/api/testimonials/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM testimonials WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Upload ──
app.post('/api/upload', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایلی آپلود نشد.' });
  res.json({ url: `/api/uploads/${req.file.filename}` });
});

// ── Newsletter ──
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'نشانی ایمیل معتبر نیست.' });
  }
  try {
    await pool.query('INSERT INTO newsletter (email) VALUES ($1) ON CONFLICT DO NOTHING', [email]);
    res.json({ ok: true, message: 'عضویت شما با موفقیت ثبت شد.' });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Settings / Ownership Transfer ──
app.get('/api/settings', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    res.json({ users: rows.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })) });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// Change own password
app.put('/api/settings/password', verifyToken, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: 'رمز فعلی و جدید الزامی است.' });
  if (new_password.length < 8) return res.status(400).json({ error: 'رمز جدید باید حداقل ۸ کاراکتر باشد.' });
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'کاربر یافت نشد.' });
    const match = await bcrypt.compare(current_password, rows[0].password_hash);
    if (!match) return res.status(401).json({ error: 'رمز فعلی نادرست است.' });
    const hash = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ ok: true, message: 'رمز عبور با موفقیت تغییر کرد.' });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// Add authorized admin
app.post('/api/settings/admins', verifyToken, requireOwner, async (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'ایمیل و رمز عبور الزامی است.' });
  if (password.length < 8) return res.status(400).json({ error: 'رمز باید حداقل ۸ کاراکتر باشد.' });
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'این ایمیل قبلاً ثبت شده است.' });
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4) RETURNING id, email, name, role',
      [email, hash, name || 'مدیر مجاز', 'AUTHORIZED_ADMIN']
    );
    res.json({ user: rows[0] });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// Transfer ownership
app.post('/api/settings/transfer-ownership', verifyToken, requireOwner, async (req, res) => {
  const { new_owner_email, confirm } = req.body;
  if (!new_owner_email) return res.status(400).json({ error: 'ایمیل مالک جدید الزامی است.' });
  if (confirm !== 'TRANSFER_OWNERSHIP') return res.status(400).json({ error: 'تأیید انتقال الزامی است.' });
  try {
    const target = await pool.query('SELECT * FROM users WHERE email = $1', [new_owner_email]);
    if (target.rows.length === 0) return res.status(404).json({ error: 'کاربر مقصد یافت نشد. ابتدا حساب کاربری ایجاد کنید.' });
    const oldOwner = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['AUTHORIZED_ADMIN', req.user.id]);
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['OWNER', target.rows[0].id]);
    res.json({ ok: true, message: 'مالکیت با موفقیت منتقل شد.' });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// Revoke admin
app.delete('/api/settings/admins/:id', verifyToken, requireOwner, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'کاربر یافت نشد.' });
    if (rows[0].role === 'OWNER') return res.status(403).json({ error: 'نمی‌توان مالک را حذف کرد.' });
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', ['CUSTOMER', req.params.id]);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'خطای سرور.' });
  }
});

// ── Start ──
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => console.log(`[server] Running on :${PORT}`));
}).catch(err => {
  console.error('[server] Failed to start:', err.message);
  setTimeout(() => process.exit(1), 3000);
});
