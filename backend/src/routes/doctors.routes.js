const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getAllDoctors,
  getAllDoctorsAdmin,
  getDoctorById,
  getDoctorSchedule,
  getSpecializations,
  getDepartments,
  createDoctor,
  updateDoctor,
  addDoctorSchedule,
  deleteDoctor
} = require('../controllers/doctors.controller');

// Public routes
router.get('/', getAllDoctors);
router.get('/specializations', getSpecializations);
router.get('/departments', getDepartments);

// Admin routes (must be before /:id routes)
router.get('/admin/all', authenticate, authorize('admin'), getAllDoctorsAdmin);
router.post('/', authenticate, authorize('admin'), createDoctor);
router.put('/:id', authenticate, authorize('admin'), updateDoctor);
router.post('/:id/schedule', authenticate, authorize('admin'), addDoctorSchedule);
router.delete('/:id', authenticate, authorize('admin'), deleteDoctor);

// Public routes with :id parameter (must be after specific routes)
router.get('/:id', getDoctorById);
router.get('/:id/schedule', getDoctorSchedule);

module.exports = router;
