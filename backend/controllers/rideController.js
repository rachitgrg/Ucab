const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const Payment = require('../models/Payment');

// Fare rates per km by cab type
const fareRates = { mini: 8, sedan: 12, suv: 18, luxury: 28 };
const baseFares = { mini: 30, sedan: 50, suv: 80, luxury: 150 };

// Calculate distance between two coords (Haversine)
const calcDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// @desc    Get fare estimate
// @route   POST /api/rides/estimate
const getFareEstimate = async (req, res) => {
  try {
    const { pickupLat, pickupLng, dropLat, dropLng } = req.body;
    const distance = calcDistance(pickupLat, pickupLng, dropLat, dropLng);
    const estimates = Object.keys(fareRates).map((type) => ({
      type,
      fare: Math.round(baseFares[type] + distance * fareRates[type]),
      distance: distance.toFixed(2),
      duration: Math.round(distance * 3 + 5), // mins
      eta: Math.round(Math.random() * 5 + 3),
    }));
    res.json({ distance: distance.toFixed(2), estimates });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Book a ride
// @route   POST /api/rides/book
const bookRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, cabType } = req.body;
    const distance = calcDistance(
      pickupLocation.lat, pickupLocation.lng,
      dropLocation.lat, dropLocation.lng
    );
    const fare = Math.round(baseFares[cabType] + distance * fareRates[cabType]);
    const duration = Math.round(distance * 3 + 5);

    // Find nearby available verified driver
    const driver = await Driver.findOne({ vehicleType: cabType, isAvailable: true, isVerified: true });

    const ride = await Ride.create({
      user: req.user._id,
      driver: driver ? driver._id : null,
      pickupLocation,
      dropLocation,
      cabType,
      fare,
      distance: parseFloat(distance.toFixed(2)),
      duration,
      status: driver ? 'accepted' : 'pending',
    });

    if (driver) {
      driver.isAvailable = false;
      await driver.save();
    }

    const populated = await Ride.findById(ride._id)
      .populate('driver', 'name phone vehicleType vehicleNumber rating currentLocation');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get ride by ID
// @route   GET /api/rides/:id
const getRideById = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('user', 'name phone email')
      .populate('driver', 'name phone vehicleType vehicleNumber rating currentLocation profilePic');
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    res.json(ride);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Cancel a ride
// @route   PUT /api/rides/:id/cancel
const cancelRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (['completed', 'cancelled'].includes(ride.status))
      return res.status(400).json({ message: 'Cannot cancel this ride' });

    if (ride.driver) {
      await Driver.findByIdAndUpdate(ride.driver, { isAvailable: true });
    }
    ride.status = 'cancelled';
    await ride.save();
    res.json({ message: 'Ride cancelled', ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Rate a completed ride
// @route   PUT /api/rides/:id/rate
const rateRide = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.status !== 'completed') return res.status(400).json({ message: 'Ride not completed' });

    ride.rating = rating;
    ride.review = review || '';
    await ride.save();

    // Update driver rating
    if (ride.driver) {
      const driver = await Driver.findById(ride.driver);
      const rides = await Ride.find({ driver: ride.driver, rating: { $ne: null } });
      const avg = rides.reduce((s, r) => s + r.rating, 0) / rides.length;
      driver.rating = parseFloat(avg.toFixed(1));
      await driver.save();
    }

    res.json({ message: 'Rating submitted', ride });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getFareEstimate, bookRide, getRideById, cancelRide, rateRide };
