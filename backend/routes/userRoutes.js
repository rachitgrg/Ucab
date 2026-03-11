const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserHistory } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/history', protect, getUserHistory);

module.exports = router;
