const pool = require('../config/database');

// Get active jobs (public)
const getActiveJobs = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(`
      SELECT id, title, department, job_type, location, description, requirements, created_at
      FROM jobs
      WHERE is_active = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM jobs WHERE is_active = true'
    );

    res.json({
      data: result.rows.map(job => ({
        id: job.id,
        title: job.title,
        department: job.department,
        type: job.job_type,
        location: job.location,
        description: job.description,
        requirements: job.requirements,
        createdAt: job.created_at
      })),
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

// Admin: Get all jobs (including inactive)
const getAllJobs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, u.first_name as creator_first_name, u.last_name as creator_last_name
      FROM jobs j
      LEFT JOIN users u ON j.created_by = u.id
      ORDER BY j.created_at DESC
    `);

    res.json(result.rows.map(job => ({
      id: job.id,
      title: job.title,
      department: job.department,
      type: job.job_type,
      location: job.location,
      description: job.description,
      requirements: job.requirements,
      isActive: job.is_active,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      createdBy: job.creator_first_name ? `${job.creator_first_name} ${job.creator_last_name}` : 'Admin'
    })));
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

// Admin: Create job
const createJob = async (req, res) => {
  try {
    const { title, department, type, location, description, requirements, isActive } = req.body;
    const createdBy = req.user.id;

    const result = await pool.query(`
      INSERT INTO jobs (title, department, job_type, location, description, requirements, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      title,
      department,
      type || 'Full-time',
      location || 'General Santos City',
      description,
      requirements,
      isActive !== undefined ? isActive : true,
      createdBy
    ]);

    res.status(201).json({
      message: 'Job posting created successfully!',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ error: 'Failed to create job posting.' });
  }
};

// Admin: Update job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, type, location, description, requirements, isActive } = req.body;

    const result = await pool.query(`
      UPDATE jobs SET
        title = COALESCE($1, title),
        department = COALESCE($2, department),
        job_type = COALESCE($3, job_type),
        location = COALESCE($4, location),
        description = COALESCE($5, description),
        requirements = COALESCE($6, requirements),
        is_active = COALESCE($7, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, department, type, location, description, requirements, isActive, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job posting not found.' });
    }

    res.json({
      message: 'Job posting updated successfully!',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ error: 'Failed to update job posting.' });
  }
};

// Admin: Delete job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job posting not found.' });
    }

    res.json({ message: 'Job posting deleted successfully.' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ error: 'Failed to delete job posting.' });
  }
};

module.exports = {
  getActiveJobs,
  getAllJobs,
  createJob,
  updateJob,
  deleteJob
};
