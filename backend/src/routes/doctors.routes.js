const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getAllDoctors,
  getDoctorById,
  getDoctorSchedule,
  getSpecializations,
  getDepartments,
  createDoctor,
  updateDoctor,
  addDoctorSchedule
} = require('../controllers/doctors.controller');

// Public routes
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/departments', getDepartments);
router.get('/:id', getDoctorById);
router.get('/:id/schedule', getDoctorSchedule);

// Admin routes
router.post('/', authenticate, authorize('admin'), createDoctor);
router.put('/:id', authenticate, authorize('admin'), updateDoctor);
router.post('/:id/schedule', authenticate, authorize('admin'), addDoctorSchedule);

module.exports = router;
