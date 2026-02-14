const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  submitApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
} = require('../controllers/applications.controller');

// Configure multer for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/resumes');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// All routes require authentication
router.use(authenticate);

// User routes
router.post('/', upload.single('resume'), submitApplication);
router.get('/my', getMyApplications);

// Admin & HR routes
router.get('/all', authorize('admin', 'hr'), getAllApplications);
router.get('/stats', authorize('admin', 'hr'), getApplicationStats);
router.put('/:id', authorize('admin', 'hr'), updateApplicationStatus);
router.delete('/:id', authorize('admin', 'hr'), deleteApplication);

module.exports = router;
