import React, { useEffect, useState } from 'react';
import socket from '../services/socket';
import MapWithMarkers from '../components/MapWithMarkers';

export default function AdminPage(){
  const [markers, setMarkers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    socket.emit('viewer:join', { role: 'admin' });

    socket.on('map:update', (payload) => {
      setMarkers(prev => {
        const filtered = prev.filter(m => m.driverId !== payload.driverId);
        return [...filtered, { driverId: payload.driverId, autoNumber: payload.autoNumber, name: payload.name, lng: payload.lng, lat: payload.lat, color: payload.insideGeofence ? 'green' : 'red', info: `dist: ${payload.totalDistanceKm?.toFixed(2)} km` }];
      });
    });

    socket.on('driver:alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 20));
    });

    fetch(`${process.env.REACT_APP_API_BASE || 'http://localhost:5000/api'}/admin/usage-stats`)
      .then(r=>r.json()).then(setStats).catch(()=>{});

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

    return () => {
      socket.off('map:update');
      socket.off('driver:alert');
    };
  }, []);

  const mapMarkers = markers.map(m => ({ ...m, key: m.driverId }));

  return (
    <div style={{ padding: 12 }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <MapWithMarkers markers={mapMarkers} />
        </div>
        <div style={{ width: 320 }}>
          <div className="card">
            <h3>Usage Stats</h3>
            <div>Total Trips (24h): {stats.totalTrips ?? '-'}</div>
            <div>Total Distance (24h): {(stats.totalDistanceKm ?? '-').toString()}</div>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            <h3>Alerts</h3>
            {alerts.length === 0 ? <div>No alerts</div> : alerts.map(a => (
              <div key={a.driverId + a.timestamp} style={{ marginBottom: 8, borderBottom: '1px solid #eee' }}>
                <strong>{a.autoNumber}</strong><br />
                {a.msg} at {new Date(a.timestamp).toLocaleString()}<br />
                {a.lng.toFixed(5)}, {a.lat.toFixed(5)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
