const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://lumen:lumen_pass_2026@db:5432/lumen',
});

const U = (path, w, h) => `https://images.unsplash.com/${path}?w=${w}&h=${h}&fit=crop&q=80`;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'CUSTOMER'
);
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  discount_price BIGINT,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  inventory INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  rating NUMERIC(2,1) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS kits (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS editorial (
  id SERIAL PRIMARY KEY,
  category_label TEXT NOT NULL,
  title TEXT NOT NULL,
  image_url TEXT,
  read_time TEXT,
  is_published BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  avatar_url TEXT,
  is_published BOOLEAN DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS newsletter (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);
`;

async function initDB() {
  const client = await pool.connect();
  try {
    await client.query(SCHEMA);

    const { rows } = await client.query('SELECT COUNT(*) as cnt FROM categories');
    if (parseInt(rows[0].cnt) === 0) {
      await seed(client);
    }

    const { rows: users } = await client.query('SELECT COUNT(*) as cnt FROM users');
    if (parseInt(users[0].cnt) === 0) {
      const email = process.env.ADMIN_EMAIL || 'admin@lumen.ir';
      const pass = process.env.ADMIN_PASSWORD || 'LumenAdmin@2026';
      const hash = await bcrypt.hash(pass, 10);
      await client.query(
        'INSERT INTO users (email, password_hash, name, role) VALUES ($1,$2,$3,$4)',
        [email, hash, 'مدیر لومن', 'OWNER']
      );
      console.log('[db] Default owner created:', email);
    }
    console.log('[db] Initialized OK');
  } finally {
    client.release();
  }
}

async function seed(client) {
  // Categories
  const cats = [
    ['دوربین‌های بدون آینه', 'mirrorless', 'Camera'],
    ['دوربین‌های DSLR', 'dslr', 'Camera'],
    ['لنزها', 'lenses', 'Circle'],
    ['پهپادها', 'drones', 'Plane'],
    ['گیمبال‌ها', 'gimbals', 'Aperture'],
    ['سه‌پایه‌ها', 'tripods', 'Triangle'],
    ['تجهیزات نورپردازی', 'lighting', 'Lightbulb'],
    ['کیف و لوازم حمل', 'bags', 'Briefcase'],
  ];
  const catIds = {};
  for (const [name, slug, icon] of cats) {
    const r = await client.query(
      'INSERT INTO categories (name, slug, icon, sort_order) VALUES ($1,$2,$3,$4) RETURNING id',
      [name, slug, icon, 0]
    );
    catIds[slug] = r.rows[0].id;
  }

  // Featured products
  const featured = [
    ['دوربین بدون آینه Lumen Z9', 'دوربین بدون آینه حرفه‌ای با سنسور فول‌فریم و فیلم ۸K', 249000000, null, catIds.mirrorless, U('photo-1516035069371-29a1b244cc32', 600, 600), 15, 4.9, 128],
    ['لنز حرفه‌ای Lumen 24-70mm f/2.8', 'لنز زوم استاندارد با دیافراگم ثابت f/2.8', 119000000, null, catIds.lenses, U('photo-1516035069371-29a1b244cc32', 600, 600), 22, 4.8, 96],
    ['پهپاد حرفه‌ای Lumen Air X1', 'پهپاد با دوربین ۴K و پایدارکننده سه‌محوری', 89000000, null, catIds.drones, U('photo-1473973266408-ed4e27abdd47', 600, 600), 8, 4.7, 54],
    ['گیمبال حرفه‌ای Lumen Stabil Pro', 'گیمبال سه‌محوری با ظرفیت بار ۳.۵ کیلوگرم', 44900000, null, catIds.gimbals, U('photo-1452780212940-6f5c0d14d848', 600, 600), 18, 4.6, 41],
    ['سه‌پایه کربنی Lumen Carbon Pro', 'سه‌پایه سبک کربنی با ارتفاع ۱۶۵ سانتی‌متر', 29900000, null, catIds.tripods, U('photo-1516035069371-29a1b244cc32', 600, 600), 30, 4.8, 72],
  ];
  for (const [name, desc, price, disc, catId, img, inv, rating, reviews] of featured) {
    await client.query(
      `INSERT INTO products (name, description, price, discount_price, category_id, image_url, inventory, is_featured, is_best_seller, is_published, rating, review_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true,false,true,$8,$9)`,
      [name, desc, price, disc, catId, img, inv, rating, reviews]
    );
  }

  // Best sellers
  const best = [
    ['لنز Lumen 50mm f/1.8', 'لنز ثابت ۵۰ میلی‌متری با دیافراگم f/1.8', 19900000, null, catIds.lenses, U('photo-1452780212940-6f5c0d14d848', 600, 600), 45, 4.9, 210],
    ['نور حرفه‌ای Lumen Pro Light 600', 'نورپرداز LED با توان ۶۰ وات و دمای رنگ قابل تنظیم', 26900000, null, catIds.lighting, U('photo-1516035069371-29a1b244cc32', 600, 600), 12, 4.7, 38],
    ['کوله‌پشتی دوربین Lumen', 'کوله‌پشتی ضدآب با گنجایش ۲۵ لیتر', 14900000, null, catIds.bags, U('photo-1553062407-98eeb64c6a62', 600, 600), 28, 4.8, 87],
    ['میکروفون بی‌سیم Lumen Wireless Mic Pro', 'میکروفون بی‌سیم با گیرنده دو کاناله', 12900000, null, catIds.bags, U('photo-1553062407-98eeb64c6a62', 600, 600), 20, 4.6, 52],
  ];
  for (const [name, desc, price, disc, catId, img, inv, rating, reviews] of best) {
    await client.query(
      `INSERT INTO products (name, description, price, discount_price, category_id, image_url, inventory, is_featured, is_best_seller, is_published, rating, review_count)
       VALUES ($1,$2,$3,$4,$5,$6,$7,false,true,true,$8,$9)`,
      [name, desc, price, disc, catId, img, inv, rating, reviews]
    );
  }

  // Kits
  const kits = [
    ['کیت تولید محتوای سفر', 'سبک، کاربردی و آماده برای ماجراجویی.', 179900000, U('photo-1506905925346-21bda4d32df4', 800, 600), 1],
    ['تجهیزات ضروری فیلم‌سازی', 'هرآنچه برای روایت داستان‌های سینمایی نیاز دارید.', 249900000, U('photo-1493246507139-91e8fad9978e', 800, 600), 2],
    ['کیت تولید محتوای حرفه‌ای', 'راهکاری کامل برای تولید محتوا در هر پلتفرم.', 99900000, U('photo-1493246507139-91e8fad9978e', 800, 600), 3],
  ];
  for (const [title, desc, price, img, order] of kits) {
    await client.query(
      'INSERT INTO kits (title, description, price, image_url, is_published, sort_order) VALUES ($1,$2,$3,$4,true,$5)',
      [title, desc, price, img, order]
    );
  }

  // Editorial
  const editorial = [
    ['راهنما', 'آشنایی با دیافراگم و عمق میدان', U('photo-1516035069371-29a1b244cc32', 600, 400), '۶ دقیقه مطالعه'],
    ['نکات', 'بهترین تنظیمات دوربین در نور کم', U('photo-1516035069371-29a1b244cc32', 600, 400), '۵ دقیقه مطالعه'],
    ['راهنمای تجهیزات', 'چگونه لنز مناسب سبک عکاسی خود را انتخاب کنیم؟', U('photo-1516035069371-29a1b244cc32', 600, 400), '۸ دقیقه مطالعه'],
    ['آموزش', 'ویرایش حرفه‌ای عکس با لایت‌روم', U('photo-1493246507139-91e8fad9978e', 600, 400), '۱۰ دقیقه مطالعه'],
  ];
  for (const [label, title, img, readTime] of editorial) {
    await client.query(
      'INSERT INTO editorial (category_label, title, image_url, read_time, is_published) VALUES ($1,$2,$3,$4,true)',
      [label, title, img, readTime]
    );
  }

  // Testimonials
  const testimonials = [
    ['آرش رضایی', 'کیفیت محصولات لومن فوق‌العاده است. دوربین Z9 تجربه عکاسی من را کاملاً متحول کرد.', 5, U('photo-1494790108377-be9c29b29330', 200, 200)],
    ['مریم حسینی', 'ارسال سریع و بسته‌بندی حرفه‌ای. کوله‌پشتی دوربین دقیقاً مطابق توضیحات بود.', 5, U('photo-1494790108377-be9c29b29330', 200, 200)],
    ['سینا کریمی', 'پشتیبانی عالی و قیمت منصفانه. لنز ۵۰ میلی‌متری کیفیت بی‌نظیری دارد.', 5, U('photo-1438761681033-6461ffad8d80', 200, 200)],
  ];
  for (const [name, text, rating, avatar] of testimonials) {
    await client.query(
      'INSERT INTO testimonials (name, text, rating, avatar_url, is_published) VALUES ($1,$2,$3,$4,true)',
      [name, text, rating, avatar]
    );
  }

  console.log('[db] Seed data inserted');
}

module.exports = { pool, initDB };
