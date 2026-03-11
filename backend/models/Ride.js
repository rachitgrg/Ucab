const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', default: null },
  pickupLocation: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  dropLocation: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  cabType: { type: String, enum: ['mini', 'sedan', 'suv', 'luxury'], required: true },
  fare: { type: Number, default: 0 },
  distance: { type: Number, default: 0 }, // in km
  duration: { type: Number, default: 0 }, // in minutes
  status: {
    type: String,
    enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
    default: 'pending',
  },
  otp: { type: String, default: () => Math.floor(1000 + Math.random() * 9000).toString() },
  startTime: { type: Date },
  endTime: { type: Date },
  rating: { type: Number, min: 1, max: 5, default: null },
  review: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Ride', rideSchema);
