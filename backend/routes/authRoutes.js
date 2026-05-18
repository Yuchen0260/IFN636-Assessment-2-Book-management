const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile, getUsers, updateUserRole } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/users', protect, isAdmin, getUsers);
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

module.exports = router;
