const express = require('express');
const router = express.Router();
const {
  getFareEstimate, bookRide, getRideById, cancelRide, rateRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

router.post('/estimate', protect, getFareEstimate);
router.post('/book', protect, bookRide);
router.get('/:id', protect, getRideById);
router.put('/:id/cancel', protect, cancelRide);
router.put('/:id/rate', protect, rateRide);

module.exports = router;
