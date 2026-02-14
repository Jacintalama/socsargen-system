const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres123@localhost:5432/socsargen_hospital'
});

async function createHRAccount() {
  try {
    // First, update the role constraint to include 'hr'
    await pool.query(`
      ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
      ALTER TABLE users ADD CONSTRAINT users_role_check
        CHECK (role IN ('patient', 'doctor', 'admin', 'hr'));
    `);
    console.log('✓ HR role constraint updated');

    // Check if HR account already exists
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      ['hr@socsargen.com']
    );

    if (existing.rows.length > 0) {
      console.log('HR account already exists!');
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('hr123456', salt);

    // Create HR account
    const result = await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, 'hr', true, true)
      RETURNING id, email, first_name, last_name, role
    `, ['hr@socsargen.com', hashedPassword, 'HR', 'Admin']);

    console.log('✓ HR Account created successfully!');
    console.log('');
    console.log('=================================');
    console.log('  HR LOGIN CREDENTIALS');
    console.log('=================================');
    console.log('  Email:    hr@socsargen.com');
    console.log('  Password: hr123456');
    console.log('=================================');
    console.log('');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

createHRAccount();
