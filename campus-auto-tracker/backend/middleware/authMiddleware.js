const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'change-this';

async function driverAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'driver' && payload.role !== 'admin') {
      return res.status(403).json({ error: 'Invalid role' });
    }
    req.driverId = payload.id;
    req.role = payload.role;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { driverAuth };
