const pool = require('../config/database');
const bcrypt = require('bcryptjs');

// Admin: Get all users (with optional role filter)
const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let query = `
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at
      FROM users
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      params.push(role);
      query += ` AND role = $${params.length}`;
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    res.json(result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
    })));
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
};

// Admin: Create HR account
const createHRAccount = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required.' });
    }

    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create HR user
    const result = await pool.query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role, is_active, email_verified)
      VALUES ($1, $2, $3, $4, $5, 'hr', true, true)
      RETURNING id, email, first_name, last_name, phone, role, is_active, created_at
    `, [email, hashedPassword, firstName, lastName, phone || null]);

    const user = result.rows[0];

    res.status(201).json({
      message: 'HR account created successfully!',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        isActive: user.is_active,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Create HR account error:', error);
    res.status(500).json({ error: 'Failed to create HR account.' });
  }
};

// Admin: Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const result = await pool.query(`
      UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, email, first_name, last_name, role, is_active
    `, [isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully!`,
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status.' });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting self
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }

    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, email',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user.' });
  }
};

// Admin: Get HR accounts only
const getHRAccounts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, email, first_name, last_name, phone, role, is_active, created_at
      FROM users
      WHERE role = 'hr'
      ORDER BY created_at DESC
    `);

    res.json(result.rows.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      isActive: user.is_active,
      createdAt: user.created_at
    })));
  } catch (error) {
    console.error('Get HR accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch HR accounts.' });
  }
};

module.exports = {
  getAllUsers,
  createHRAccount,
  updateUserStatus,
  deleteUser,
  getHRAccounts
};
