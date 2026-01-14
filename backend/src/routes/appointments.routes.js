const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAllAppointments,
  getAppointmentStats
} = require('../controllers/appointments.controller');

// Validation
const createAppointmentValidation = [
  body('doctorId').notEmpty().withMessage('Doctor is required'),
  body('appointmentDate').isDate().withMessage('Valid date is required'),
  body('appointmentTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required'),
  body('reason').optional().trim()
];

// All routes require authentication
router.use(authenticate);

// Patient routes
router.post('/', authorize('patient'), createAppointmentValidation, createAppointment);
router.get('/my', getMyAppointments); // Works for both patient and doctor
router.patch('/:id/cancel', authorize('patient'), cancelAppointment);

// Doctor routes
router.patch('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);

// Admin routes
router.get('/all', authorize('admin'), getAllAppointments);
router.get('/stats', authorize('admin'), getAppointmentStats);

module.exports = router;
