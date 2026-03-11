const express = require('express');
const router = express.Router();
const {
  getDriverProfile, toggleAvailability, updateLocation,
  getDriverRides, acceptRide, startRide, completeRide, getAvailableRides
} = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, authorize('driver'), getDriverProfile);
router.put('/availability', protect, authorize('driver'), toggleAvailability);
router.put('/location', protect, authorize('driver'), updateLocation);
router.get('/rides', protect, authorize('driver'), getDriverRides);
router.get('/available-rides', protect, authorize('driver'), getAvailableRides);
router.put('/rides/:id/accept', protect, authorize('driver'), acceptRide);
router.put('/rides/:id/start', protect, authorize('driver'), startRide);
router.put('/rides/:id/complete', protect, authorize('driver'), completeRide);

module.exports = router;
