const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  startTime: Date,
  endTime: Date,
  distanceKm: { type: Number, default: 0 },
  logs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'LocationLog' }]
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);
