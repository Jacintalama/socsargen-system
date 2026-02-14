const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getAllUsers,
  createHRAccount,
  updateUserStatus,
  deleteUser,
  getHRAccounts
} = require('../controllers/users.controller');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/hr - Get HR accounts only
router.get('/hr', getHRAccounts);

// POST /api/users/hr - Create new HR account
router.post('/hr', createHRAccount);

// PATCH /api/users/:id/status - Update user status
router.patch('/:id/status', updateUserStatus);

// DELETE /api/users/:id - Delete user
router.delete('/:id', deleteUser);

module.exports = router;
