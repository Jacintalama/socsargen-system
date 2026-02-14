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
  return new Date(user.locked_until) > new Date();
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
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
// LOGOUT
// ==========================================
const logout = async (req, res) => {
  try {
    await pool.query(
      'UPDATE refresh_tokens SET revoked = true WHERE user_id = $1',
      [req.user.id]
    );
    await pool.query('UPDATE users SET session_token = NULL WHERE id = $1', [req.user.id]);

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
// GET PROFILE
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
// UPDATE PROFILE
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
