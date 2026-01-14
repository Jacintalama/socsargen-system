const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getPublishedNews,
  getNewsBySlug,
  getAllNews,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/news.controller');

// Validation
const newsValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('excerpt').optional().trim(),
  body('imageUrl').optional().trim(),
  body('isPublished').optional().isBoolean()
];

// Public routes
router.get('/', getPublishedNews);
router.get('/:slug', getNewsBySlug);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllNews);
router.post('/', authenticate, authorize('admin'), newsValidation, createNews);
router.put('/:id', authenticate, authorize('admin'), updateNews);
router.delete('/:id', authenticate, authorize('admin'), deleteNews);

module.exports = router;
