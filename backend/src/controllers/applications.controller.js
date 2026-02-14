const pool = require('../config/database');

// Submit job application (authenticated users)
const submitApplication = async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    const userId = req.user.id;
    const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : null;

    // Check if job exists and is active
    const jobCheck = await pool.query(
      'SELECT id, title FROM jobs WHERE id = $1 AND is_active = true',
      [jobId]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job posting not found or no longer active.' });
    }

    // Check if user already applied
    const existingApp = await pool.query(
      'SELECT id FROM job_applications WHERE job_id = $1 AND user_id = $2',
      [jobId, userId]
    );

    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this position.' });
    }

    // Create application
    const result = await pool.query(`
      INSERT INTO job_applications (job_id, user_id, cover_letter, resume_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [jobId, userId, coverLetter, resumeUrl]);

    res.status(201).json({
      message: 'Application submitted successfully!',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
};

// Get my applications (authenticated users)
const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT
        ja.*,
        j.title as job_title,
        j.department,
        j.job_type,
        j.location
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.user_id = $1
      ORDER BY ja.created_at DESC
    `, [userId]);

    res.json(result.rows.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      department: app.department,
      jobType: app.job_type,
      location: app.location,
      coverLetter: app.cover_letter,
      resumeUrl: app.resume_url,
      status: app.status,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    })));
  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

// Admin: Get all applications
const getAllApplications = async (req, res) => {
  try {
    const { status, jobId } = req.query;

    let query = `
      SELECT
        ja.*,
        j.title as job_title,
        j.department,
        j.job_type,
        u.first_name,
        u.last_name,
        u.email,
        u.phone
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN users u ON ja.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND ja.status = $${params.length}`;
    }

    if (jobId) {
      params.push(jobId);
      query += ` AND ja.job_id = $${params.length}`;
    }

    query += ' ORDER BY ja.created_at DESC';

    const result = await pool.query(query, params);

    res.json(result.rows.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      department: app.department,
      jobType: app.job_type,
      applicant: {
        id: app.user_id,
        firstName: app.first_name,
        lastName: app.last_name,
        email: app.email,
        phone: app.phone
      },
      coverLetter: app.cover_letter,
      resumeUrl: app.resume_url,
      status: app.status,
      adminNotes: app.admin_notes,
      createdAt: app.created_at,
      updatedAt: app.updated_at
    })));
  } catch (error) {
    console.error('Get all applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

// Admin: Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const result = await pool.query(`
      UPDATE job_applications SET
        status = COALESCE($1, status),
        admin_notes = COALESCE($2, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, adminNotes, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({
      message: 'Application updated successfully!',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application.' });
  }
};

// Admin: Delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM job_applications WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    res.json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application.' });
  }
};

// Admin: Get application stats
const getApplicationStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'reviewing') as reviewing,
        COUNT(*) FILTER (WHERE status = 'interviewed') as interviewed,
        COUNT(*) FILTER (WHERE status = 'accepted') as accepted,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected
      FROM job_applications
    `);

    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats.' });
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
};
