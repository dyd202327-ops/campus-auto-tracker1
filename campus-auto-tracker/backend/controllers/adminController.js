const Driver = require('../models/Driver');
const Trip = require('../models/Trip');

async function getLiveDrivers(req, res) {
  const drivers = await Driver.find().select('autoNumber name active currentLocation totalDistanceKm');
  res.json({ drivers });
}

async function getUsageStats(req, res) {
  const since = new Date(Date.now() - 1000 * 60 * 60 * 24);
  const trips = await Trip.find({ startTime: { $gte: since } });
  const totalDistance = trips.reduce((s, t) => s + (t.distanceKm || 0), 0);
  res.json({ totalTrips: trips.length, totalDistanceKm: totalDistance });
}

module.exports = { getLiveDrivers, getUsageStats };
