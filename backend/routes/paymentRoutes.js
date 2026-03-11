const express = require('express');
const router = express.Router();
const { processPayment, getPaymentByRide, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/', protect, processPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/ride/:rideId', protect, getPaymentByRide);

module.exports = router;
