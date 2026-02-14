const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getActiveJobs,
  getAllJobs,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs.controller');

// Validation
const jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Temporary']),
  body('location').optional().trim(),
  body('requirements').optional().trim(),
  body('isActive').optional().isBoolean()
];

// Public routes
router.get('/', getActiveJobs);

// Admin & HR routes
router.get('/admin/all', authenticate, authorize('admin', 'hr'), getAllJobs);
router.post('/', authenticate, authorize('admin', 'hr'), jobValidation, createJob);
router.put('/:id', authenticate, authorize('admin', 'hr'), updateJob);
router.delete('/:id', authenticate, authorize('admin', 'hr'), deleteJob);

module.exports = router;
