const { Pool } = require('pg');

// Determine SSL config based on environment and connection type
const getSSLConfig = () => {
  if (process.env.NODE_ENV !== 'production') return false;
  // Render internal URLs don't need SSL, external URLs do
  // Support both by using rejectUnauthorized: false
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com')) {
    return { rejectUnauthorized: false };
  }
  // For Render internal URLs (no .render.com in hostname), try without SSL first
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('dpg-')) {
    return false;
  }
  return { rejectUnauthorized: false };
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: getSSLConfig()
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

module.exports = pool;
