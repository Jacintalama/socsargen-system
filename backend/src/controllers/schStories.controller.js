const pool = require('../config/database');

// Get active story (public - for homepage)
const getActiveStory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, patient_name, quote, video_url, thumbnail_url, year
      FROM sch_stories
      WHERE is_active = true
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No active story found.' });
    }

    const story = result.rows[0];
    res.json({
      id: story.id,
      title: story.title,
      patientName: story.patient_name,
      quote: story.quote,
      videoUrl: story.video_url,
      thumbnailUrl: story.thumbnail_url,
      year: story.year
    });
  } catch (error) {
    console.error('Get active story error:', error);
    res.status(500).json({ error: 'Failed to fetch active story.' });
  }
};

// Get all published stories (public - for homepage slider)
const getPublishedStories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, title, patient_name, quote, video_url, thumbnail_url, year
      FROM sch_stories
      ORDER BY year DESC, created_at DESC
    `);

    res.json(result.rows.map(story => ({
      id: story.id,
      title: story.title,
      patientName: story.patient_name,
      quote: story.quote,
      videoUrl: story.video_url,
      thumbnailUrl: story.thumbnail_url,
      year: story.year
    })));
  } catch (error) {
    console.error('Get published stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
};

// Get all stories (admin - includes inactive)
const getAllStories = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, u.first_name as uploader_first_name, u.last_name as uploader_last_name
      FROM sch_stories s
      LEFT JOIN users u ON s.uploaded_by = u.id
      ORDER BY s.year DESC, s.created_at DESC
    `);

    res.json(result.rows.map(s => ({
      id: s.id,
      title: s.title,
      patientName: s.patient_name,
      quote: s.quote,
      videoUrl: s.video_url,
      thumbnailUrl: s.thumbnail_url,
      year: s.year,
      isActive: s.is_active,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
      uploadedBy: s.uploader_first_name ? `${s.uploader_first_name} ${s.uploader_last_name}` : 'Admin'
    })));
  } catch (error) {
    console.error('Get all stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories.' });
  }
};

// Create new story (admin)
const createStory = async (req, res) => {
  try {
    const { title, patientName, quote, videoUrl, thumbnailUrl, year, isActive } = req.body;
    const uploadedBy = req.user.id;

    // If setting as active, deactivate others first
    if (isActive) {
      await pool.query('UPDATE sch_stories SET is_active = false WHERE is_active = true');
    }

    const result = await pool.query(`
      INSERT INTO sch_stories (title, patient_name, quote, video_url, thumbnail_url, year, is_active, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [title, patientName, quote, videoUrl, thumbnailUrl, year, isActive || false, uploadedBy]);

    res.status(201).json({
      message: 'Story created successfully!',
      story: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        patientName: result.rows[0].patient_name,
        quote: result.rows[0].quote,
        videoUrl: result.rows[0].video_url,
        thumbnailUrl: result.rows[0].thumbnail_url,
        year: result.rows[0].year,
        isActive: result.rows[0].is_active
      }
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: 'Failed to create story.' });
  }
};

// Update story (admin)
const updateStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, patientName, quote, videoUrl, thumbnailUrl, year, isActive } = req.body;

    // Check if story exists
    const existing = await pool.query('SELECT * FROM sch_stories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    // If setting as active, deactivate others first
    if (isActive && !existing.rows[0].is_active) {
      await pool.query('UPDATE sch_stories SET is_active = false WHERE is_active = true');
    }

    const result = await pool.query(`
      UPDATE sch_stories SET
        title = COALESCE($1, title),
        patient_name = COALESCE($2, patient_name),
        quote = COALESCE($3, quote),
        video_url = COALESCE($4, video_url),
        thumbnail_url = COALESCE($5, thumbnail_url),
        year = COALESCE($6, year),
        is_active = COALESCE($7, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, patientName, quote, videoUrl, thumbnailUrl, year, isActive, id]);

    res.json({
      message: 'Story updated successfully!',
      story: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        patientName: result.rows[0].patient_name,
        quote: result.rows[0].quote,
        videoUrl: result.rows[0].video_url,
        thumbnailUrl: result.rows[0].thumbnail_url,
        year: result.rows[0].year,
        isActive: result.rows[0].is_active
      }
    });
  } catch (error) {
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Failed to update story.' });
  }
};

// Set story as active (admin)
const setActiveStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if story exists
    const existing = await pool.query('SELECT * FROM sch_stories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    // Deactivate all other stories
    await pool.query('UPDATE sch_stories SET is_active = false WHERE is_active = true');

    // Activate the selected story
    await pool.query('UPDATE sch_stories SET is_active = true, updated_at = CURRENT_TIMESTAMP WHERE id = $1', [id]);

    res.json({ message: 'Story set as active successfully!' });
  } catch (error) {
    console.error('Set active story error:', error);
    res.status(500).json({ error: 'Failed to set active story.' });
  }
};

// Delete story (admin)
const deleteStory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if story exists
    const existing = await pool.query('SELECT * FROM sch_stories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found.' });
    }

    // Delete the story
    await pool.query('DELETE FROM sch_stories WHERE id = $1', [id]);

    res.json({ message: 'Story deleted successfully!' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story.' });
  }
};

module.exports = {
  getActiveStory,
  getPublishedStories,
  getAllStories,
  createStory,
  updateStory,
  setActiveStory,
  deleteStory
};
