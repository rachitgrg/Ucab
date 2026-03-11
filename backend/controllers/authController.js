const User = require('../models/User');
const Driver = require('../models/Driver');
const { generateToken } = require('../middleware/auth');

// @desc    Register user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: 'Please fill in all fields' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email,
      phone: user.phone, role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id, name: user.name, email: user.email,
        phone: user.phone, role: user.role, wallet: user.wallet,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Register driver
// @route   POST /api/auth/driver/register
const registerDriver = async (req, res) => {
  try {
    const { name, email, password, phone, licenseNo, vehicleType, vehicleNumber, vehicleModel } = req.body;
    if (!name || !email || !password || !phone || !licenseNo || !vehicleType || !vehicleNumber)
      return res.status(400).json({ message: 'Please fill in all fields' });

    const exists = await Driver.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Driver already exists' });

    const driver = await Driver.create({ name, email, password, phone, licenseNo, vehicleType, vehicleNumber, vehicleModel });
    res.status(201).json({
      _id: driver._id, name: driver.name, email: driver.email,
      phone: driver.phone, role: 'driver', isVerified: driver.isVerified,
      token: generateToken(driver._id, 'driver'),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Login driver
// @route   POST /api/auth/driver/login
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email });
    if (driver && (await driver.matchPassword(password))) {
      res.json({
        _id: driver._id, name: driver.name, email: driver.email,
        phone: driver.phone, role: 'driver', isVerified: driver.isVerified,
        vehicleType: driver.vehicleType, vehicleNumber: driver.vehicleNumber,
        isAvailable: driver.isAvailable, rating: driver.rating,
        token: generateToken(driver._id, 'driver'),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, registerDriver, loginDriver };
