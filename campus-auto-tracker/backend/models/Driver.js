const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  autoNumber: { type: String, required: true, unique: true }, // used as login id
  name: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  active: { type: Boolean, default: false },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0,0] } // [lng, lat]
  },
  totalDistanceKm: { type: Number, default: 0 },
  totalRunningHours: { type: Number, default: 0 },
  lastShiftStart: { type: Date },
}, { timestamps: true });

DriverSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Driver', DriverSchema);
