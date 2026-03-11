const Driver = require('../models/Driver');
const Ride = require('../models/Ride');

// @desc    Get driver profile
// @route   GET /api/drivers/profile
const getDriverProfile = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id).select('-password');
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update driver availability
// @route   PUT /api/drivers/availability
const toggleAvailability = async (req, res) => {
  try {
    const driver = await Driver.findById(req.user._id);
    driver.isAvailable = !driver.isAvailable;
    await driver.save();
    res.json({ isAvailable: driver.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update driver location
// @route   PUT /api/drivers/location
const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await Driver.findByIdAndUpdate(req.user._id, { currentLocation: { lat, lng } });
    res.json({ message: 'Location updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get driver's assigned rides
// @route   GET /api/drivers/rides
const getDriverRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('user', 'name phone email')
      .sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Accept a ride (driver)
// @route   PUT /api/drivers/rides/:id/accept
const acceptRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = 'accepted';
    ride.driver = req.user._id;
    await ride.save();
    await Driver.findByIdAndUpdate(req.user._id, { isAvailable: false });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Start ride (OTP verified)
// @route   PUT /api/drivers/rides/:id/start
const startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (req.body.otp !== ride.otp) return res.status(400).json({ message: 'Invalid OTP' });
    ride.status = 'ongoing';
    ride.startTime = new Date();
    await ride.save();
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Complete ride
// @route   PUT /api/drivers/rides/:id/complete
const completeRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    ride.status = 'completed';
    ride.endTime = new Date();
    await ride.save();
    await Driver.findByIdAndUpdate(req.user._id, { isAvailable: true, $inc: { totalRides: 1 } });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get all available (unassigned) rides
// @route   GET /api/drivers/available-rides
const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: 'pending', cabType: req.user.vehicleType })
      .populate('user', 'name phone');
    res.json(rides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDriverProfile, toggleAvailability, updateLocation,
  getDriverRides, acceptRide, startRide, completeRide, getAvailableRides
};
