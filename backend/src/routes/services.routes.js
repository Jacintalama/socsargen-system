const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getCategories,
  getAllServices,
  getFeaturedServices,
  getServicesByCategory,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService
} = require('../controllers/services.controller');

// Validation
const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').optional().trim(),
  body('icon').optional().trim(),
  body('displayOrder').optional().isInt()
];

// UUID validation for :id parameter
const uuidValidation = [
  param('id').isUUID().withMessage('Invalid service ID format')
];

// Public routes
router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedServices);
router.get('/category/:category', getServicesByCategory);

// Admin routes
router.get('/admin/all', authenticate, authorize('admin'), getAllServicesAdmin);
router.post('/', authenticate, authorize('admin'), serviceValidation, createService);
router.put('/:id', authenticate, authorize('admin'), uuidValidation, serviceValidation, updateService);
router.delete('/:id', authenticate, authorize('admin'), uuidValidation, deleteService);

module.exports = router;
