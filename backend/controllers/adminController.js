const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, drivers, rides, payments] = await Promise.all([
      User.countDocuments(),
      Driver.countDocuments(),
      Ride.countDocuments(),
      Payment.find({ status: 'paid' }),
    ]);
    const revenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const completedRides = await Ride.countDocuments({ status: 'completed' });
    const pendingRides = await Ride.countDocuments({ status: 'pending' });
    res.json({ users, drivers, rides, revenue, completedRides, pendingRides });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all drivers
// @route   GET /api/admin/drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find().select('-password').sort({ createdAt: -1 });
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Verify/unverify a driver
// @route   PUT /api/admin/drivers/:id/verify
const verifyDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    driver.isVerified = !driver.isVerified;
    await driver.save();
    res.json({ message: `Driver ${driver.isVerified ? 'verified' : 'unverified'}`, driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all rides
// @route   GET /api/admin/rides
const getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find()
      .populate('user', 'name email phone')
      .populate('driver', 'name phone vehicleNumber')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, getAllDrivers, verifyDriver, getAllRides, deleteUser };
