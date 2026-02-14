# Security Hardening Design - Socsargen Hospital System

**Date:** 2026-02-14
**Scope:** Password & Auth Hardening + Quick Wins
**Priority:** High - Healthcare system handling patient data

## Current State

### Strengths
- bcryptjs password hashing (10 salt rounds)
- Parameterized SQL queries (no injection risk)
- JWT with single-session enforcement
- Input validation via express-validator
- Helmet security headers
- RBAC authorization middleware

### Critical Vulnerabilities
1. CORS allows ALL origins (`callback(null, true)` in index.js:68)
2. No rate limiting - brute-force attacks possible
3. No account lockout - unlimited failed login attempts
4. `.env` tracked in git with weak DB password and exposed Gemini API key
5. JWT expires in 7 days with no refresh token
6. No audit logging for auth events
7. CSP uses `unsafe-inline` and `unsafe-eval`
8. Password only requires 8 chars minimum

## Design

### 1. Password Hashing Upgrade (bcrypt -> Argon2id)

Replace `bcryptjs` with `argon2` (winner of Password Hashing Competition).

**Why Argon2id over bcrypt:**
- Memory-hard: resists GPU/ASIC attacks (requires 64MB RAM per hash attempt)
- OWASP 2024 recommended algorithm
- Even if database is breached, passwords are practically uncrackable

**Configuration:**
- Algorithm: Argon2id (hybrid of Argon2i and Argon2d)
- Memory cost: 65536 KB (64MB)
- Time cost: 3 iterations
- Parallelism: 4 threads

**Migration strategy:**
- On login, detect hash format (bcrypt starts with `$2b$`)
- If bcrypt: verify with bcrypt, re-hash with argon2, update DB
- All new registrations use argon2 immediately
- Zero downtime, transparent to users

### 2. Password Complexity Enforcement

Backend validation (express-validator):
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

Frontend: real-time password strength indicator.

### 3. Account Lockout System

New database columns on `users` table:
- `failed_login_attempts` (INTEGER, default 0)
- `locked_until` (TIMESTAMP, nullable)
- `last_failed_login` (TIMESTAMP, nullable)

Logic:
- After 5 failed attempts: lock for 15 minutes
- After 10 failed attempts: lock for 30 minutes
- After 15 failed attempts: lock for 1 hour
- Reset counter on successful login
- Admin can manually unlock via API

### 4. Rate Limiting

Using `express-rate-limit` (free, open-source):
- Login endpoint: 5 attempts per 15 minutes per IP
- Registration: 3 attempts per hour per IP
- General API: 100 requests per minute per IP
- Password reset: 3 attempts per hour per IP

### 5. JWT Security Upgrade

Current: single access token, 7-day expiry.

New architecture:
- **Access token**: 15-minute expiry, sent in Authorization header
- **Refresh token**: 7-day expiry, stored as HttpOnly cookie + in DB
- **Token rotation**: new refresh token issued on each refresh
- **Invalidation**: all tokens invalidated on password change
- New endpoint: `POST /api/auth/refresh`

Database: new `refresh_tokens` table with token hash, user_id, expires_at, revoked flag.

### 6. Quick Wins

**CORS lockdown:**
- Read allowed origins from `CORS_ORIGINS` env variable
- Default to `http://localhost:5173,http://localhost:5174` in development
- Strict whitelist in production

**.env cleanup:**
- Add `.env` to `.gitignore`
- Remove real API keys from `.env.example`
- Document required env vars with placeholder values

**CSP hardening:**
- Remove `unsafe-eval` from scriptSrc
- Keep `unsafe-inline` only if needed for styled-components/Tailwind

## Files to Modify

- `backend/package.json` - add argon2, express-rate-limit
- `backend/src/controllers/auth.controller.js` - argon2, lockout, refresh tokens
- `backend/src/middleware/auth.middleware.js` - refresh token validation
- `backend/src/middleware/rateLimiter.middleware.js` - NEW
- `backend/src/utils/jwt.utils.js` - access + refresh token generation
- `backend/src/utils/password.utils.js` - NEW (argon2 + bcrypt migration)
- `backend/src/routes/auth.routes.js` - refresh endpoint, stronger validation
- `backend/src/database/schema.sql` - lockout columns, refresh_tokens table
- `backend/src/index.js` - CORS fix, rate limiter, CSP
- `backend/.env.example` - cleanup
- `backend/.gitignore` - add .env

## Dependencies (all free/open-source)

- `argon2` - Argon2id password hashing
- `express-rate-limit` - API rate limiting
- No paid services required
