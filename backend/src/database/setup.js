/**
 * Database Setup Script
 * Run with: npm run db:setup
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');

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
    console.log('  Test Accounts:');
    console.log('');
    console.log('  Admin:   admin@socsargen-hospital.com          / admin123');
    console.log('  HR:      hr@socsargen-hospital.com             / hr123');
    console.log('  Patient: patient@socsargen-hospital.com        / patient123');
    console.log('');
    console.log('  Doctors (all password: doctor123):');
    console.log('  doctor.santos@socsargen-hospital.com     - Internal Medicine');
    console.log('  doctor.reyes@socsargen-hospital.com      - Pediatrics');
    console.log('  doctor.cruz@socsargen-hospital.com       - OB-GYN');
    console.log('  doctor.garcia@socsargen-hospital.com     - Cardiology');
    console.log('  doctor.mendoza@socsargen-hospital.com    - Orthopedics');
    console.log('  doctor.villanueva@socsargen-hospital.com - Surgery');
    console.log('  doctor.torres@socsargen-hospital.com     - Neurology');
    console.log('  doctor.bautista@socsargen-hospital.com   - Dermatology');
    console.log('  doctor.fernandez@socsargen-hospital.com  - Ophthalmology');
    console.log('  doctor.ramos@socsargen-hospital.com      - Dental Medicine');
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
