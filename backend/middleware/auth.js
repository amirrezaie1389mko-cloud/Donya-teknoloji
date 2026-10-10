const jwt = require('jsonwebtoken');

function getToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function verifyToken(req, res, next) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'توکن احراز هویت یافت نشد.' });
  try {
    const secret = process.env.JWT_SECRET || 'dev-jwt-secret-placeholder-change-in-production-7f3a9b2e';
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    return res.status(401).json({ error: 'توکن نامعتبر است.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'دسترسی غیرمجاز.' });
  if (req.user.role !== 'OWNER' && req.user.role !== 'AUTHORIZED_ADMIN') {
    return res.status(403).json({ error: 'دسترسی مدیر 필요 است.' });
  }
  next();
}

function requireOwner(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'دسترسی غیرمجاز.' });
  if (req.user.role !== 'OWNER') {
    return res.status(403).json({ error: 'دسترسی مالک required.' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin, requireOwner };
