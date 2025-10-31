import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import MapWithMarkers from '../components/MapWithMarkers';

function haversineKm([lng1, lat1], [lng2, lat2]) {
  const R = 6371;
  const toRad = deg => (deg * Math.PI)/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lng2-lng1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export default function StudentPage(){
  const [markers, setMarkers] = useState([]);
  const [userPos, setUserPos] = useState(null);
  const [nearest, setNearest] = useState(null);

  useEffect(() => {
    socket.emit('viewer:join', { role: 'student' });

    socket.on('map:update', (payload) => {
      setMarkers(prev => {
        const filtered = prev.filter(m => m.driverId !== payload.driverId);
        return [...filtered, { driverId: payload.driverId, autoNumber: payload.autoNumber, name: payload.name, lng: payload.lng, lat: payload.lat, color: payload.insideGeofence ? 'green' : 'red', info: `dist: ${payload.totalDistanceKm?.toFixed(2)} km` }];
      });
    });

    fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'}/admin/live-drivers`)
      .then(r=>r.json()).then(data => {
        if (data.drivers) {
          setMarkers(data.drivers.map(d => ({
            driverId: d._id,
            autoNumber: d.autoNumber,
            name: d.name,
            lng: d.currentLocation?.coordinates?.[0] || 0,
            lat: d.currentLocation?.coordinates?.[1] || 0,
            color: d.active ? 'green' : 'gray'
          })));
        }
      }).catch(()=>{});

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(p => setUserPos([p.coords.longitude, p.coords.latitude]));

    return () => {
      socket.off('map:update');
    };
  }, []);

  useEffect(() => {
    if (!userPos || markers.length===0) return;
    let best = null; let bestD = Infinity;
    markers.forEach(m => {
      if (!m.lng || !m.lat) return;
      const d = haversineKm(userPos, [m.lng, m.lat]);
      if (d < bestD) { bestD = d; best = {...m, distanceKm: d}; }
    });
    setNearest(best);
  }, [userPos, markers]);

  const mapMarkers = markers.map(m => ({ ...m, key: m.driverId }));

  return (
    <div style={{ padding: 12 }}>
      <h2>Student: Live Autos</h2>
      <div style={{ marginBottom: 8 }}>
        {userPos ? <div>Your location: {userPos[1].toFixed(5)}, {userPos[0].toFixed(5)}</div> : <div>Could not get your location</div>}
        {nearest ? <div>Nearest auto: {nearest.autoNumber} — ETA ~ {Math.round(nearest.distanceKm*3)} min (approx)</div> : <div>No autos yet</div>}
      </div>
      <MapWithMarkers markers={mapMarkers} center={userPos ? [userPos[1], userPos[0]] : undefined} />
    </div>
  );
}
