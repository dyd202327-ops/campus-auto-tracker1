const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const geofenceFile = process.env.GEOFENCE_FILE || path.join(__dirname, '..', 'config', 'geofence.json');
let polygon = null;

function loadGeofence() {
  try {
    const data = JSON.parse(fs.readFileSync(geofenceFile));
    const coords = data.polygon.map(([lng, lat]) => [lng, lat]);
    polygon = turf.polygon([coords]);
  } catch (e) {
    console.warn('Failed to load geofence:', e.message);
  }
}

function isInside([lng, lat]) {
  if (!polygon) loadGeofence();
  if (!polygon) return true; // fallback permissive
  const pt = turf.point([lng, lat]);
  return turf.booleanPointInPolygon(pt, polygon);
}

module.exports = { isInside, loadGeofence };
