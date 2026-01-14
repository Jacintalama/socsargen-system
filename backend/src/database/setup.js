/**
 * Database Setup Script
 * Run with: npm run db:setup
 */

require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:@localhost:5432/socsargen_hospital'
});

async function setupDatabase() {
  console.log('===========================================');
  console.log('  SOCSARGEN HOSPITAL - DATABASE SETUP');
  console.log('===========================================');
  console.log('');

  try {
    // Test connection
    console.log('[1/3] Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('      ✓ Connected to database');
    console.log('');

    // Run schema
    console.log('[2/3] Creating database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await pool.query(schema);
    console.log('      ✓ Schema created successfully');
    console.log('');

    // Run seed data
    console.log('[3/3] Inserting seed data...');
    const seedPath = path.join(__dirname, 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    await pool.query(seed);
    console.log('      ✓ Seed data inserted successfully');
    console.log('');

    console.log('===========================================');
    console.log('  DATABASE SETUP COMPLETE!');
    console.log('===========================================');
    console.log('');
    console.log('  Default Admin Login:');
    console.log('  Email: admin@socsargen-hospital.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('  Sample Doctor Logins:');
    console.log('  Email: dr.santos@socsargen-hospital.com');
    console.log('  Password: doctor123');
    console.log('');
    console.log('===========================================');

  } catch (error) {
    console.error('');
    console.error('  ✗ Database setup failed!');
    console.error('  Error:', error.message);
    console.error('');

    if (error.message.includes('does not exist')) {
      console.error('  Make sure the database "socsargen_hospital" exists.');
      console.error('  Create it with: CREATE DATABASE socsargen_hospital;');
    }

    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
