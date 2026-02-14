const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getActiveStory,
  getPublishedStories,
  getAllStories,
  createStory,
  updateStory,
  setActiveStory,
  deleteStory
} = require('../controllers/schStories.controller');

// Public routes
router.get('/active', getActiveStory);
router.get('/published', getPublishedStories);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllStories);
router.post('/', authenticate, authorize('admin'), createStory);
router.put('/:id', authenticate, authorize('admin'), updateStory);
router.patch('/:id/activate', authenticate, authorize('admin'), setActiveStory);
router.delete('/:id', authenticate, authorize('admin'), deleteStory);

module.exports = router;
