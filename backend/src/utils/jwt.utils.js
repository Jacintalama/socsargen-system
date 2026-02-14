const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a short-lived access token (15 minutes)
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate a long-lived refresh token (7 days)
 * Returns { token, hash, expiresAt }
 */
const generateRefreshToken = () => {
  const token = crypto.randomBytes(64).toString('hex');
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return { token, hash, expiresAt };
};

/**
 * Hash a refresh token for DB comparison
 */
const hashRefreshToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify an access token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Backward compatibility: keep generateToken as alias
const generateToken = generateAccessToken;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyToken,
  generateToken
};
