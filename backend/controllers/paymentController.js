const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

// @desc    Process payment
// @route   POST /api/payments
const processPayment = async (req, res) => {
  try {
    const { rideId, method } = req.body;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'completed') return res.status(400).json({ message: 'Ride not completed yet' });

    const existing = await Payment.findOne({ ride: rideId });
    if (existing && existing.status === 'paid')
      return res.status(400).json({ message: 'Payment already processed' });

    const payment = await Payment.create({
      ride: rideId,
      user: req.user._id,
      amount: ride.fare,
      method: method || 'cash',
      status: 'paid',
      receipt: `RCPT-${Date.now()}`,
    });

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get payment for a ride
// @route   GET /api/payments/ride/:rideId
const getPaymentByRide = async (req, res) => {
  try {
    const payment = await Payment.findOne({ ride: req.params.rideId })
      .populate('ride')
      .populate('user', 'name email');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/history
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('ride')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { processPayment, getPaymentByRide, getPaymentHistory };
