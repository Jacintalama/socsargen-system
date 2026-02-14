const pool = require('../config/database');
const { validationResult } = require('express-validator');

// Helper function to format service row for API response
const formatService = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  category: row.category,
  icon: row.icon,
  imageUrl: row.image_url,
  isFeatured: row.is_featured,
  displayOrder: row.display_order
});

// Helper function to format error response (includes details in dev mode)
const formatError = (message, error) => {
  const response = { error: message };
  if (process.env.NODE_ENV === 'development' && error) {
    response.details = error.message;
  }
  return response;
};

// Get service categories (public)
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT category FROM services
      WHERE is_active = true AND category IS NOT NULL
      ORDER BY category
    `);

    res.json(result.rows.map(r => r.category));
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json(formatError('Failed to fetch categories.', error));
  }
};

// Get all active services (public)
const getAllServices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true ORDER BY display_order, name'
    );

    res.json(result.rows.map(formatService));
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json(formatError('Failed to fetch services.', error));
  }
};

// Get featured services (public)
const getFeaturedServices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true AND is_featured = true ORDER BY display_order, name'
    );

    res.json(result.rows.map(formatService));
  } catch (error) {
    console.error('Get featured services error:', error);
    res.status(500).json(formatError('Failed to fetch featured services.', error));
  }
};

// Get services by category (public)
const getServicesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const result = await pool.query(
      'SELECT * FROM services WHERE is_active = true AND category = $1 ORDER BY display_order, name',
      [category]
    );

    res.json(result.rows.map(formatService));
  } catch (error) {
    console.error('Get services by category error:', error);
    res.status(500).json(formatError('Failed to fetch services by category.', error));
  }
};

// Admin: Get all services (including inactive)
const getAllServicesAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY display_order, name'
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json(formatError('Failed to fetch services.', error));
  }
};

// Admin: Create service
const createService = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { name, description, category, icon, imageUrl, isFeatured, displayOrder } = req.body;

    const result = await pool.query(
      'INSERT INTO services (name, description, category, icon, image_url, is_featured, display_order) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, description, category || 'General', icon, imageUrl || null, isFeatured || false, displayOrder || 0]
    );

    res.status(201).json({
      message: 'Service created successfully!',
      service: formatService(result.rows[0])
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json(formatError('Failed to create service.', error));
  }
};

// Admin: Update service
const updateService = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;
    const { name, description, category, icon, imageUrl, isFeatured, displayOrder, isActive } = req.body;

    const result = await pool.query(`
      UPDATE services SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        icon = COALESCE($4, icon),
        image_url = COALESCE($5, image_url),
        is_featured = COALESCE($6, is_featured),
        display_order = COALESCE($7, display_order),
        is_active = COALESCE($8, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $9
      RETURNING *
    `, [name, description, category, icon, imageUrl, isFeatured, displayOrder, isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json({
      message: 'Service updated successfully!',
      service: formatService(result.rows[0])
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json(formatError('Failed to update service.', error));
  }
};

// Admin: Delete service
const deleteService = async (req, res) => {
  try {
    // Check for validation errors (UUID validation)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    const { id } = req.params;

    const result = await pool.query('DELETE FROM services WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    res.json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json(formatError('Failed to delete service.', error));
  }
};

module.exports = {
  getCategories,
  getAllServices,
  getFeaturedServices,
  getServicesByCategory,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService
};
