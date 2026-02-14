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
