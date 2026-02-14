const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, refreshAccessToken, logout, getProfile, updateProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter.middleware');

// Password complexity validation
const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/[0-9]/).withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must contain at least one special character');

// Validation rules
const registerValidation = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  passwordValidation,
  body('firstName')
    .trim().notEmpty().withMessage('First name is required'),
  body('lastName')
    .trim().notEmpty().withMessage('Last name is required'),
  body('phone')
    .optional().trim()
];

const loginValidation = [
  body('email')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Public routes (with rate limiting)
router.post('/register', registerLimiter, registerValidation, register);
router.post('/login', loginLimiter, loginValidation, login);
router.post('/refresh', refreshAccessToken);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

module.exports = router;
