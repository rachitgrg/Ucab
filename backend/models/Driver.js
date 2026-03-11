const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, required: true },
  licenseNo: { type: String, required: true, unique: true },
  vehicleType: { type: String, enum: ['mini', 'sedan', 'suv', 'luxury'], required: true },
  vehicleNumber: { type: String, required: true },
  vehicleModel: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 },
  },
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  totalRides: { type: Number, default: 0 },
  profilePic: { type: String, default: '' },
}, { timestamps: true });

driverSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

driverSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);
