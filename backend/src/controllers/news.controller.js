const pool = require('../config/database');

// Get published news (public)
const getPublishedNews = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;

    const result = await pool.query(`
      SELECT n.id, n.title, n.slug, n.excerpt, n.image_url, n.video_url, n.published_at,
             u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.is_published = true
      ORDER BY n.published_at DESC
      LIMIT $1 OFFSET $2
    `, [parseInt(limit), parseInt(offset)]);

    // Get total count
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM news WHERE is_published = true'
    );

    res.json({
      data: result.rows.map(n => ({
        id: n.id,
        title: n.title,
        slug: n.slug,
        excerpt: n.excerpt,
        imageUrl: n.image_url,
        videoUrl: n.video_url,
        publishedAt: n.published_at,
        author: n.author_first_name ? `${n.author_first_name} ${n.author_last_name}` : 'Admin'
      })),
      total: parseInt(countResult.rows[0].count),
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
};

// Get single news by slug (public)
const getNewsBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(`
      SELECT n.*, u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.slug = $1 AND n.is_published = true
    `, [slug]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const n = result.rows[0];
    res.json({
      id: n.id,
      title: n.title,
      slug: n.slug,
      content: n.content,
      excerpt: n.excerpt,
      imageUrl: n.image_url,
      videoUrl: n.video_url,
      publishedAt: n.published_at,
      author: n.author_first_name ? `${n.author_first_name} ${n.author_last_name}` : 'Admin'
    });
  } catch (error) {
    console.error('Get news by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch article.' });
  }
};

// Admin: Get all news (including drafts)
const getAllNews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT n.*, u.first_name as author_first_name, u.last_name as author_last_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      ORDER BY n.created_at DESC
    `);

    res.json(result.rows.map(n => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      imageUrl: n.image_url,
      videoUrl: n.video_url,
      isPublished: n.is_published,
      publishedAt: n.published_at,
      createdAt: n.created_at,
      author: n.author_first_name ? `${n.author_first_name} ${n.author_last_name}` : 'Admin'
    })));
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({ error: 'Failed to fetch news.' });
  }
};

// Admin: Create news
const createNews = async (req, res) => {
  try {
    const { title, content, excerpt, imageUrl, videoUrl, isPublished } = req.body;
    const authorId = req.user.id;

    // Generate slug
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + Date.now();

    const result = await pool.query(`
      INSERT INTO news (title, slug, content, excerpt, image_url, video_url, author_id, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      title,
      slug,
      content,
      excerpt || content.substring(0, 200) + '...',
      imageUrl,
      videoUrl || null,
      authorId,
      isPublished || false,
      isPublished ? new Date() : null
    ]);

    res.status(201).json({
      message: 'Article created successfully!',
      news: result.rows[0]
    });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Failed to create article.' });
  }
};

// Admin: Update news
const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, imageUrl, videoUrl, isPublished } = req.body;

    // Check if publishing for first time
    const existing = await pool.query('SELECT is_published, published_at FROM news WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const wasPublished = existing.rows[0].is_published;
    const publishedAt = isPublished && !wasPublished ? new Date() : existing.rows[0].published_at;

    // video_url uses direct assignment (not COALESCE) so it can be cleared
    const result = await pool.query(`
      UPDATE news SET
        title = COALESCE($1, title),
        content = COALESCE($2, content),
        excerpt = COALESCE($3, excerpt),
        image_url = COALESCE($4, image_url),
        video_url = CASE WHEN $5::text IS NOT NULL THEN NULLIF($5, '') ELSE video_url END,
        is_published = COALESCE($6, is_published),
        published_at = $7,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `, [title, content, excerpt, imageUrl, videoUrl !== undefined ? (videoUrl || '') : null, isPublished, publishedAt, id]);

    res.json({
      message: 'Article updated successfully!',
      news: result.rows[0]
    });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update article.' });
  }
};

// Admin: Delete news
const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM news WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    res.json({ message: 'Article deleted successfully.' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Failed to delete article.' });
  }
};

module.exports = {
  getPublishedNews,
  getNewsBySlug,
  getAllNews,
  createNews,
  updateNews,
  deleteNews
};
