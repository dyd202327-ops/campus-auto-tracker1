const Driver = require('../models/Driver');
const LocationLog = require('../models/LocationLog');
const Trip = require('../models/Trip');
const haversine = require('../utils/haversine');
const { isInside } = require('../utils/geofence');

async function startShift(req, res) {
  const driverId = req.driverId;
  const driver = await Driver.findById(driverId);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  driver.active = true;
  driver.lastShiftStart = new Date();
  await driver.save();
  const trip = new Trip({ driver: driver._id, startTime: new Date() });
  await trip.save();
  res.json({ ok: true, tripId: trip._id });
}

async function endShift(req, res) {
  const driverId = req.driverId;
  const driver = await Driver.findById(driverId);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });
  driver.active = false;
  await driver.save();
  const trip = await Trip.findOne({ driver: driver._id }).sort({ startTime: -1 });
  if (trip && !trip.endTime) {
    trip.endTime = new Date();
    const logs = await LocationLog.find({ driver: driver._id }).sort({ timestamp: 1 });
    let distance = 0;
    for (let i = 1; i < logs.length; i++) {
      distance += haversine(logs[i-1].coords.coordinates, logs[i].coords.coordinates);
    }
    trip.distanceKm = distance;
    await trip.save();
  }
  res.json({ ok: true });
}

async function postLocation(req, res) {
  const driverId = req.driverId;
  const { lng, lat, speedKph } = req.body;
  if (lng === undefined || lat === undefined) return res.status(400).json({ error: 'Missing coordinates' });

  const inside = isInside([lng, lat]);
  const driver = await Driver.findById(driverId);
  if (!driver) return res.status(404).json({ error: 'Driver not found' });

  let distanceAdded = 0;
  if (driver.currentLocation && driver.currentLocation.coordinates[0] !== 0) {
    distanceAdded = haversine(driver.currentLocation.coordinates, [lng, lat]);
    driver.totalDistanceKm = (driver.totalDistanceKm || 0) + distanceAdded;
  }
  driver.currentLocation = { type: 'Point', coordinates: [lng, lat] };
  await driver.save();

  const log = await LocationLog.create({
    driver: driver._id,
    coords: { type: 'Point', coordinates: [lng, lat] },
    speedKph,
    insideGeofence: inside
  });

  const trip = await Trip.findOne({ driver: driver._id }).sort({ startTime: -1 });
  if (trip) {
    trip.logs.push(log._id);
    trip.distanceKm = (trip.distanceKm || 0) + distanceAdded;
    await trip.save();
  }

  res.json({ ok: true, inside, distanceAdded });
}

module.exports = { startShift, endShift, postLocation };
