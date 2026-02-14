const { verifyToken } = require('../utils/jwt.utils');
const pool = require('../config/database');

// Authenticate user from JWT token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const result = await pool.query(
      'SELECT id, email, first_name, last_name, role, session_token FROM users WHERE id = $1 AND is_active = true',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found or inactive.' });
    }

    const user = result.rows[0];

    // Single session enforcement (except admin)
    // If user's stored session_token doesn't match current token, they've been logged out
    if (user.role !== 'admin' && user.session_token && user.session_token !== token) {
      return res.status(401).json({
        error: 'Session expired. You have been logged in from another device.',
        code: 'SESSION_REPLACED'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Authorize by role(s)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};

module.exports = { authenticate, authorize };
