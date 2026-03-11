const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, getAllDrivers, verifyDriver, getAllRides, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/drivers', getAllDrivers);
router.put('/drivers/:id/verify', verifyDriver);
router.get('/rides', getAllRides);

module.exports = router;
