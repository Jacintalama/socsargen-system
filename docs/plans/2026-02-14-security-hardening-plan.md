# Security Hardening Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Harden the Socsargen Hospital System against data breaches, brute-force attacks, and credential theft using free/open-source tools only.

**Architecture:** Add Argon2id password hashing with transparent bcrypt migration, account lockout after failed attempts, rate limiting on auth endpoints, JWT refresh token rotation, and CORS/CSP lockdown. All changes are backward-compatible with existing users.

**Tech Stack:** Node.js/Express, PostgreSQL, argon2, express-rate-limit, jsonwebtoken, crypto (built-in)

---

## Task 1: Install Security Dependencies

**Files:**
- Modify: `backend/package.json`

**Step 1: Install argon2 and express-rate-limit**

Run:
```bash
cd backend && npm install argon2 express-rate-limit
```

Expected: Both packages added to `dependencies` in package.json.

**Step 2: Verify installation**

Run:
```bash
cd backend && node -e "const argon2 = require('argon2'); console.log('argon2 OK'); const rateLimit = require('express-rate-limit'); console.log('rate-limit OK');"
```

Expected: Both "OK" messages printed.

**Step 3: Commit**

```bash
git add backend/package.json backend/package-lock.json
git commit -m "chore: add argon2 and express-rate-limit dependencies"
```

---

## Task 2: Create Password Utility with Argon2id + bcrypt Migration

**Files:**
- Create: `backend/src/utils/password.utils.js`

**Step 1: Create the password utility module**

Create `backend/src/utils/password.utils.js`:

```javascript
const argon2 = require('argon2');
const bcrypt = require('bcryptjs');

// Argon2id configuration (OWASP recommended)
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 65536,   // 64 MB
  timeCost: 3,         // 3 iterations
  parallelism: 4       // 4 threads
};

/**
 * Hash a password using Argon2id
 */
const hashPassword = async (plainPassword) => {
  return argon2.hash(plainPassword, ARGON2_OPTIONS);
};

/**
 * Verify a password against a hash.
 * Supports both Argon2id and legacy bcrypt hashes.
 * Returns { valid: boolean, needsRehash: boolean }
 */
const verifyPassword = async (plainPassword, storedHash) => {
  // Detect bcrypt hash (starts with $2a$ or $2b$)
  const isBcrypt = storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$');

  if (isBcrypt) {
    const valid = await bcrypt.compare(plainPassword, storedHash);
    return { valid, needsRehash: valid }; // rehash on next successful login
  }

  // Argon2 hash
  const valid = await argon2.verify(storedHash, plainPassword);
  return { valid, needsRehash: false };
};

module.exports = { hashPassword, verifyPassword };
```

**Step 2: Verify the module loads**

Run:
```bash
cd backend && node -e "const pw = require('./src/utils/password.utils'); console.log('Module loaded:', Object.keys(pw));"
```

Expected: `Module loaded: [ 'hashPassword', 'verifyPassword' ]`

**Step 3: Quick smoke test**

Run:
```bash
cd backend && node -e "
const { hashPassword, verifyPassword } = require('./src/utils/password.utils');
(async () => {
  const hash = await hashPassword('TestPass123!');
  console.log('Argon2 hash starts with $argon2:', hash.startsWith('\$argon2'));
  const result = await verifyPassword('TestPass123!', hash);
  console.log('Verify correct:', result.valid, 'Needs rehash:', result.needsRehash);
  const wrong = await verifyPassword('WrongPass', hash);
  console.log('Verify wrong:', wrong.valid);
})();
"
```

Expected:
```
Argon2 hash starts with $argon2: true
Verify correct: true Needs rehash: false
Verify wrong: false
```

**Step 4: Commit**

```bash
git add backend/src/utils/password.utils.js
git commit -m "feat: add Argon2id password hashing with bcrypt migration support"
```

---

## Task 3: Database Schema - Add Lockout Columns and Refresh Tokens Table

**Files:**
- Create: `backend/src/database/migrations/001_security_hardening.sql`
- Modify: `backend/src/database/schema.sql` (append new table + columns)

**Step 1: Create migration SQL file**

Create `backend/src/database/migrations/001_security_hardening.sql`:

```sql
-- Security Hardening Migration
-- Adds account lockout columns and refresh_tokens table

-- 1. Add lockout columns to users table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'failed_login_attempts') THEN
        ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'locked_until') THEN
        ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_failed_login') THEN
        ALTER TABLE users ADD COLUMN last_failed_login TIMESTAMP;
    END IF;
END $$;

-- 2. Create refresh_tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast token lookup
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- 3. Create security_audit_log table (for login attempts)
CREATE TABLE IF NOT EXISTS security_audit_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON security_audit_log(created_at);
```

**Step 2: Also append to the main schema.sql**

Add to the end of `backend/src/database/schema.sql`:

```sql
-- =============================================
-- SECURITY: Account lockout columns
-- =============================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'failed_login_attempts') THEN
        ALTER TABLE users ADD COLUMN failed_login_attempts INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'locked_until') THEN
        ALTER TABLE users ADD COLUMN locked_until TIMESTAMP;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'last_failed_login') THEN
        ALTER TABLE users ADD COLUMN last_failed_login TIMESTAMP;
    END IF;
END $$;

-- =============================================
-- SECURITY: Refresh tokens table
-- =============================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

-- =============================================
-- SECURITY: Audit log table
-- =============================================
CREATE TABLE IF NOT EXISTS security_audit_log (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    user_id UUID REFERENCES users(id),
    email VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_event_type ON security_audit_log(event_type);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON security_audit_log(created_at);
```

**Step 3: Run the migration**

Run:
```bash
cd backend && node -e "
const pool = require('./src/config/database');
const fs = require('fs');
(async () => {
  const sql = fs.readFileSync('./src/database/migrations/001_security_hardening.sql', 'utf8');
  await pool.query(sql);
  console.log('Migration complete');
  // Verify
  const cols = await pool.query(\"SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name IN ('failed_login_attempts', 'locked_until', 'last_failed_login')\");
  console.log('New user columns:', cols.rows.map(r => r.column_name));
  const tables = await pool.query(\"SELECT table_name FROM information_schema.tables WHERE table_name IN ('refresh_tokens', 'security_audit_log')\");
  console.log('New tables:', tables.rows.map(r => r.table_name));
  process.exit(0);
})();
"
```

Expected:
```
Migration complete
New user columns: [ 'failed_login_attempts', 'locked_until', 'last_failed_login' ]
New tables: [ 'refresh_tokens', 'security_audit_log' ]
```

**Step 4: Commit**

```bash
git add backend/src/database/migrations/001_security_hardening.sql backend/src/database/schema.sql
git commit -m "feat: add database schema for account lockout, refresh tokens, and audit log"
```

---

## Task 4: Create Rate Limiter Middleware

**Files:**
- Create: `backend/src/middleware/rateLimiter.middleware.js`

**Step 1: Create the rate limiter middleware**

Create `backend/src/middleware/rateLimiter.middleware.js`:

```javascript
const rateLimit = require('express-rate-limit');

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
    // Rate limit by IP + email combo to prevent distributed attacks
    return `${req.ip}-${req.body?.email || 'unknown'}`;
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
```

**Step 2: Verify module loads**

Run:
```bash
cd backend && node -e "const rl = require('./src/middleware/rateLimiter.middleware'); console.log('Loaded:', Object.keys(rl));"
```

Expected: `Loaded: [ 'loginLimiter', 'registerLimiter', 'apiLimiter' ]`

**Step 3: Commit**

```bash
git add backend/src/middleware/rateLimiter.middleware.js
git commit -m "feat: add rate limiting middleware for auth endpoints"
```

---

## Task 5: Upgrade JWT Utils - Access + Refresh Tokens

**Files:**
- Modify: `backend/src/utils/jwt.utils.js`

**Step 1: Rewrite jwt.utils.js with refresh token support**

Replace entire contents of `backend/src/utils/jwt.utils.js` with:

```javascript
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

// Backward compatibility: keep generateToken as alias for generateAccessToken
const generateToken = generateAccessToken;

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
  verifyToken,
  generateToken
};
```

**Step 2: Verify backward compatibility**

Run:
```bash
cd backend && node -e "
const jwt = require('./src/utils/jwt.utils');
console.log('Functions:', Object.keys(jwt));
const token = jwt.generateToken({ id: '123', email: 'test@test.com', role: 'patient' });
console.log('generateToken works:', !!token);
const access = jwt.generateAccessToken({ id: '123', email: 'test@test.com', role: 'patient' });
console.log('generateAccessToken works:', !!access);
const refresh = jwt.generateRefreshToken();
console.log('Refresh token length:', refresh.token.length);
console.log('Refresh hash length:', refresh.hash.length);
console.log('Refresh expiresAt:', refresh.expiresAt instanceof Date);
"
```

Expected: All checks pass, refresh token is 128 chars, hash is 64 chars.

**Step 3: Commit**

```bash
git add backend/src/utils/jwt.utils.js
git commit -m "feat: add refresh token generation and short-lived access tokens"
```

---

## Task 6: Rewrite Auth Controller - Argon2, Lockout, Refresh Tokens, Audit Log

**Files:**
- Modify: `backend/src/controllers/auth.controller.js`

**Step 1: Rewrite auth.controller.js**

Replace entire contents of `backend/src/controllers/auth.controller.js` with:

```javascript
const pool = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/password.utils');
const { generateAccessToken, generateRefreshToken, hashRefreshToken } = require('../utils/jwt.utils');
const { validationResult } = require('express-validator');

// Lockout configuration
const LOCKOUT_THRESHOLDS = [
  { attempts: 5, duration: 15 * 60 * 1000 },   // 5 fails  -> 15 min lock
  { attempts: 10, duration: 30 * 60 * 1000 },   // 10 fails -> 30 min lock
  { attempts: 15, duration: 60 * 60 * 1000 }    // 15 fails -> 1 hour lock
];

/**
 * Log a security event to the audit table
 */
const logSecurityEvent = async (eventType, { userId, email, ip, userAgent, details }) => {
  try {
    await pool.query(
      `INSERT INTO security_audit_log (event_type, user_id, email, ip_address, user_agent, details)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [eventType, userId || null, email || null, ip, userAgent, details ? JSON.stringify(details) : null]
    );
  } catch (err) {
    console.error('Audit log error:', err.message);
  }
};

/**
 * Check if account is locked
 */
const isAccountLocked = (user) => {
  if (!user.locked_until) return false;
  if (new Date(user.locked_until) > new Date()) return true;
  return false; // Lock expired
};

/**
 * Calculate lockout duration based on failed attempts
 */
const getLockoutDuration = (failedAttempts) => {
  let duration = 0;
  for (const threshold of LOCKOUT_THRESHOLDS) {
    if (failedAttempts >= threshold.attempts) {
      duration = threshold.duration;
    }
  }
  return duration;
};

// ==========================================
// REGISTER
// ==========================================
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, phone, consentPrivacy, consentMarketing } = req.body;

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password with Argon2id
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES ($1, $2, $3, $4, $5, 'patient')
       RETURNING id, email, first_name, last_name, role, created_at`,
      [email, hashedPassword, firstName, lastName, phone]
    );

    const user = result.rows[0];

    // Log consent (DPO Compliance)
    await pool.query(
      `INSERT INTO consent_logs (user_id, consent_type, consented, ip_address, user_agent) VALUES
       ($1, 'privacy_policy', $2, $3, $4),
       ($1, 'marketing', $5, $3, $4)`,
      [user.id, consentPrivacy !== false, req.ip, req.headers['user-agent'], consentMarketing || false]
    );

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refresh = generateRefreshToken();

    // Store refresh token hash in DB
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refresh.hash, refresh.expiresAt]
    );

    // Audit log
    await logSecurityEvent('REGISTER', {
      userId: user.id,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refresh.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth'
    });

    res.status(201).json({
      message: 'Registration successful!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token: accessToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ==========================================
// LOGIN
// ==========================================
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (result.rows.length === 0) {
      await logSecurityEvent('LOGIN_FAILED', {
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        details: { reason: 'User not found' }
      });
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Check if account is locked
    if (isAccountLocked(user)) {
      const lockedUntil = new Date(user.locked_until);
      const minutesLeft = Math.ceil((lockedUntil - new Date()) / 60000);

      await logSecurityEvent('LOGIN_LOCKED', {
        userId: user.id,
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        details: { minutesLeft, failedAttempts: user.failed_login_attempts }
      });

      return res.status(423).json({
        error: `Account is temporarily locked. Try again in ${minutesLeft} minute(s).`,
        lockedUntil: lockedUntil.toISOString()
      });
    }

    // Verify password (supports both Argon2 and legacy bcrypt)
    const { valid, needsRehash } = await verifyPassword(password, user.password);

    if (!valid) {
      // Increment failed attempts
      const newAttempts = (user.failed_login_attempts || 0) + 1;
      const lockDuration = getLockoutDuration(newAttempts);
      const lockedUntil = lockDuration > 0 ? new Date(Date.now() + lockDuration) : null;

      await pool.query(
        `UPDATE users SET
          failed_login_attempts = $1,
          last_failed_login = CURRENT_TIMESTAMP,
          locked_until = $2
         WHERE id = $3`,
        [newAttempts, lockedUntil, user.id]
      );

      await logSecurityEvent('LOGIN_FAILED', {
        userId: user.id,
        email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        details: { reason: 'Invalid password', attempt: newAttempts, locked: !!lockedUntil }
      });

      if (lockedUntil) {
        const minutesLocked = Math.ceil(lockDuration / 60000);
        return res.status(423).json({
          error: `Too many failed attempts. Account locked for ${minutesLocked} minutes.`,
          lockedUntil: lockedUntil.toISOString()
        });
      }

      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // === LOGIN SUCCESSFUL ===

    // Reset failed login attempts
    await pool.query(
      'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_failed_login = NULL WHERE id = $1',
      [user.id]
    );

    // If password was bcrypt, rehash with Argon2id (transparent migration)
    if (needsRehash) {
      const newHash = await hashPassword(password);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, user.id]);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refresh = generateRefreshToken();

    // Revoke old refresh tokens for this user (single session)
    if (user.role !== 'admin') {
      await pool.query(
        'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1 AND revoked = false',
        [user.id]
      );
    }

    // Store new refresh token
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, refresh.hash, refresh.expiresAt]
    );

    // Save session token for single-session enforcement (except admin)
    if (user.role !== 'admin') {
      await pool.query(
        'UPDATE users SET session_token = $1 WHERE id = $2',
        [accessToken, user.id]
      );
    }

    // Audit log
    await logSecurityEvent('LOGIN_SUCCESS', {
      userId: user.id,
      email,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      details: { rehashed: needsRehash }
    });

    // Set refresh token as HttpOnly cookie
    res.cookie('refreshToken', refresh.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth'
    });

    res.json({
      message: 'Login successful!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      },
      token: accessToken
    });
  } catch (error) {
    console.error('Login error:', error.message, error.stack);
    res.status(500).json({
      error: 'Login failed. Please try again.',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
};

// ==========================================
// REFRESH TOKEN
// ==========================================
const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided.' });
    }

    const tokenHash = hashRefreshToken(refreshToken);

    // Find valid refresh token
    const result = await pool.query(
      `SELECT rt.*, u.id as user_id, u.email, u.role, u.is_active, u.first_name, u.last_name
       FROM refresh_tokens rt
       JOIN users u ON rt.user_id = u.id
       WHERE rt.token_hash = $1 AND rt.revoked = false AND rt.expires_at > NOW() AND u.is_active = true`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    const row = result.rows[0];

    // Revoke used refresh token (rotation)
    await pool.query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [row.id]);

    // Generate new tokens
    const user = { id: row.user_id, email: row.email, role: row.role };
    const newAccessToken = generateAccessToken(user);
    const newRefresh = generateRefreshToken();

    // Store new refresh token
    await pool.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, newRefresh.hash, newRefresh.expiresAt]
    );

    // Update session token
    if (row.role !== 'admin') {
      await pool.query('UPDATE users SET session_token = $1 WHERE id = $2', [newAccessToken, user.id]);
    }

    // Set new refresh token cookie
    res.cookie('refreshToken', newRefresh.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth'
    });

    res.json({
      token: newAccessToken,
      user: {
        id: row.user_id,
        email: row.email,
        firstName: row.first_name,
        lastName: row.last_name,
        role: row.role
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(500).json({ error: 'Failed to refresh token.' });
  }
};

// ==========================================
// LOGOUT (revoke refresh tokens)
// ==========================================
const logout = async (req, res) => {
  try {
    // Revoke all refresh tokens for this user
    await pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1',
      [req.user.id]
    );

    // Clear session token
    await pool.query('UPDATE users SET session_token = NULL WHERE id = $1', [req.user.id]);

    // Clear refresh token cookie
    res.clearCookie('refreshToken', { path: '/api/auth' });

    await logSecurityEvent('LOGOUT', {
      userId: req.user.id,
      email: req.user.email,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed.' });
  }
};

// ==========================================
// GET PROFILE (unchanged)
// ==========================================
const getProfile = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, created_at
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile.' });
  }
};

// ==========================================
// UPDATE PROFILE (unchanged)
// ==========================================
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const result = await pool.query(
      `UPDATE users SET
        first_name = COALESCE($1, first_name),
        last_name = COALESCE($2, last_name),
        phone = COALESCE($3, phone),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, first_name, last_name, phone, role`,
      [firstName, lastName, phone, req.user.id]
    );

    const user = result.rows[0];
    res.json({
      message: 'Profile updated successfully!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
};

module.exports = { register, login, refreshAccessToken, logout, getProfile, updateProfile };
```

**Step 2: Verify module loads**

Run:
```bash
cd backend && node -e "const auth = require('./src/controllers/auth.controller'); console.log('Exports:', Object.keys(auth));"
```

Expected: `Exports: [ 'register', 'login', 'refreshAccessToken', 'logout', 'getProfile', 'updateProfile' ]`

**Step 3: Commit**

```bash
git add backend/src/controllers/auth.controller.js
git commit -m "feat: add Argon2id hashing, account lockout, refresh tokens, and audit logging to auth"
```

---

## Task 7: Update Auth Routes - Rate Limiting, Refresh, Logout, Password Validation

**Files:**
- Modify: `backend/src/routes/auth.routes.js`

**Step 1: Rewrite auth.routes.js**

Replace entire contents of `backend/src/routes/auth.routes.js` with:

```javascript
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, refreshAccessToken, logout, getProfile, updateProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter.middleware');

// Password complexity validation
const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must contain at least one special character');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  passwordValidation,
  body('firstName')
    .trim().notEmpty().withMessage('First name is required'),
  body('lastName')
    .trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .optional().trim()
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Public routes (with rate limiting)
router.post('/register', registerLimiter, registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
```

**Step 2: Commit**

```bash
git add backend/src/routes/auth.routes.js
git commit -m "feat: add rate limiting, password complexity, refresh and logout routes"
```

---

## Task 8: Update Server Config - CORS Lockdown, Cookie Parser, CSP

**Files:**
- Modify: `backend/src/index.js`

**Step 1: Install cookie-parser**

Run:
```bash
cd backend && npm install cookie-parser
```

**Step 2: Update index.js - add cookie-parser import and CORS fix**

In `backend/src/index.js`, make these changes:

After line 5 (`const morgan = require('morgan');`), add:
```javascript
const cookieParser = require('cookie-parser');
```

Replace the CORS config (lines 59-66) with:
```javascript
// CORS - Whitelist allowed origins
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map(s => s.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow LAN IPs in development
    if (process.env.NODE_ENV !== 'production' && (origin.match(/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
```

Also replace the Socket.IO CORS (lines 29-37) with the same pattern:
```javascript
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (process.env.NODE_ENV !== 'production' && origin.match(/^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST'],
    credentials: true
  }
});
```

After the CORS middleware, add cookie-parser:
```javascript
app.use(cookieParser());
```

Remove `'unsafe-eval'` from the CSP scriptSrc (line 49):
```javascript
scriptSrc: ["'self'", "'unsafe-inline'", "https://connect.facebook.net"],
```

Add the general API rate limiter after the JSON parser:
```javascript
const { apiLimiter } = require('./middleware/rateLimiter.middleware');
app.use('/api/', apiLimiter);
```

**Step 3: Commit**

```bash
git add backend/src/index.js backend/package.json backend/package-lock.json
git commit -m "feat: CORS whitelist, cookie-parser, CSP hardening, API rate limiting"
```

---

## Task 9: Clean Up .env.example

**Files:**
- Modify: `backend/.env.example`

**Step 1: Replace .env.example with safe placeholder values**

Replace entire contents of `backend/.env.example` with:

```env
# ===========================================
# SOCSARGEN HOSPITAL SYSTEM - ENVIRONMENT
# ===========================================
# IMPORTANT: Copy this file to .env and fill in real values
# Command: cp .env.example .env

# Database (PostgreSQL)
DATABASE_URL=postgresql://postgres:YOUR_STRONG_PASSWORD@localhost:5432/socsargen_hospital

# JWT Authentication (CHANGE THESE IN PRODUCTION!)
# Generate a secure secret: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=CHANGE_ME_TO_A_RANDOM_64_CHAR_STRING

# Google Gemini API (for AI Chatbot)
# Get your key at: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE

# Email (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=

# Server
PORT=5000
NODE_ENV=development

# CORS - Comma-separated list of allowed frontend origins
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

# Security
# Access token expiry (default: 15m)
ACCESS_TOKEN_EXPIRY=15m
# Refresh token expiry in days (default: 7)
REFRESH_TOKEN_DAYS=7
```

**Step 2: Commit**

```bash
git add backend/.env.example
git commit -m "security: remove exposed API key from .env.example, add safe placeholders"
```

---

## Task 10: Update Frontend Auth to Handle Token Refresh

**Files:**
- Modify: Frontend axios interceptor or auth context (wherever API calls are configured)

**Step 1: Find and update the frontend API/auth setup**

The frontend needs to:
1. Store access token in memory (not localStorage for max security) or localStorage (practical)
2. On 401 response, try `/api/auth/refresh` to get a new access token
3. Retry the failed request with the new token
4. If refresh fails, redirect to login

Look for the axios instance or API configuration file in `frontend/src/` and add a response interceptor:

```javascript
// Add to your axios instance configuration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post('/auth/refresh');
        // Update stored token
        localStorage.setItem('token', data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - force logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
```

**Step 2: Commit**

```bash
git add frontend/src/
git commit -m "feat: add automatic token refresh on 401 responses"
```

---

## Task 11: Final Integration Test

**Step 1: Restart the backend server**

```bash
cd backend && npm run dev
```

**Step 2: Test registration with weak password (should fail)**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"weak","firstName":"Test","lastName":"User"}'
```

Expected: 400 with password complexity errors.

**Step 3: Test registration with strong password**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"sectest@test.com","password":"SecureP@ss123!","firstName":"Test","lastName":"User"}'
```

Expected: 201 with user data and token.

**Step 4: Test login and verify Argon2 hash in DB**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sectest@test.com","password":"SecureP@ss123!"}'
```

Expected: 200 with token. Check DB - password should start with `$argon2id$`.

**Step 5: Test account lockout (5 wrong passwords)**

```bash
for i in {1..6}; do
  curl -s -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"sectest@test.com","password":"WrongPass'$i'!"}' | head -1
  echo ""
done
```

Expected: First 4 return 401, 5th returns 423 (locked).

**Step 6: Test rate limiting (many rapid requests)**

```bash
for i in {1..12}; do
  curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}'
  echo " attempt $i"
done
```

Expected: After 10 attempts, returns 429 (Too Many Requests).

**Step 7: Verify audit log has entries**

```bash
cd backend && node -e "
const pool = require('./src/config/database');
(async () => {
  const result = await pool.query('SELECT event_type, email, ip_address, created_at FROM security_audit_log ORDER BY created_at DESC LIMIT 10');
  console.table(result.rows);
  process.exit(0);
})();
"
```

Expected: Table showing LOGIN_SUCCESS, LOGIN_FAILED, LOGIN_LOCKED events.

**Step 8: Final commit**

```bash
git add -A
git commit -m "feat: complete security hardening - Argon2id, lockout, rate limiting, refresh tokens"
```

---

## Summary of Security Improvements

| Feature | Before | After |
|---------|--------|-------|
| Password hashing | bcrypt (10 rounds) | Argon2id (64MB memory-hard) |
| Password requirements | 8 chars minimum | 8+ chars, upper, lower, number, special |
| Brute-force protection | None | Rate limiting (10/15min) + account lockout |
| Account lockout | None | Progressive: 15min -> 30min -> 1hr |
| Token expiry | 7 days | 15 min access + 7 day refresh |
| Token refresh | None | Automatic rotation with HttpOnly cookie |
| CORS | Allow all origins | Whitelist from env var |
| CSP | unsafe-eval allowed | unsafe-eval removed |
| Audit logging | None | All auth events logged with IP/UA |
| .env security | API key exposed | Safe placeholders only |
