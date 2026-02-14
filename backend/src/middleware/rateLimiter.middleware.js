const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

// Strict limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window
  message: {
    error: 'Too many login attempts. Please try again after 15 minutes.',
    retryAfter: 15
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req);
    return `${ip}-${req.body?.email || 'unknown'}`;
  }
});

// Limiter for registration
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // 5 registrations per hour per IP
  message: {
    error: 'Too many registration attempts. Please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 100,              // 100 requests per minute
  message: {
    error: 'Too many requests. Please slow down.',
    retryAfter: 1
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, registerLimiter, apiLimiter };
