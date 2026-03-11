const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
};

const seed = async () => {
  await connectDB();
  const User = require('./models/User');
  const Driver = require('./models/Driver');

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@ucab.com' });
  if (!adminExists) {
    await User.create({
      name: 'Ucab Admin',
      email: 'admin@ucab.com',
      password: 'admin123',
      phone: '+91 98765 00000',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@ucab.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Create a sample verified driver
  const driverExists = await Driver.findOne({ email: 'driver@ucab.com' });
  if (!driverExists) {
    await Driver.create({
      name: 'Raj Kumar',
      email: 'driver@ucab.com',
      password: 'driver123',
      phone: '+91 98765 11111',
      licenseNo: 'DL2020123456',
      vehicleType: 'sedan',
      vehicleNumber: 'DL 01 AB 1234',
      vehicleModel: 'Maruti Swift Dzire',
      isVerified: true,
      isAvailable: true,
      currentLocation: { lat: 28.6139, lng: 77.2090 },
    });
    console.log('✅ Sample driver created: driver@ucab.com / driver123');
  } else {
    console.log('ℹ️  Sample driver already exists');
  }

  // Create sample test user
  const userExists = await User.findOne({ email: 'user@ucab.com' });
  if (!userExists) {
    await User.create({
      name: 'Sarah Johnson',
      email: 'user@ucab.com',
      password: 'user1234',
      phone: '+91 98765 22222',
      role: 'user',
    });
    console.log('✅ Sample user created: user@ucab.com / user1234');
  } else {
    console.log('ℹ️  Sample user already exists');
  }

  console.log('\n🚕 Ucab seed complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
