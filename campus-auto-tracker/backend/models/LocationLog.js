const mongoose = require('mongoose');

const LocationLogSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
  coords: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  speedKph: Number,
  timestamp: { type: Date, default: Date.now },
  insideGeofence: { type: Boolean, default: true }
});

LocationLogSchema.index({ coords: '2dsphere' });

module.exports = mongoose.model('LocationLog', LocationLogSchema);
