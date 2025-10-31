import React, { useEffect, useState, useRef } from 'react';
import socket from '../services/socket';
import api from '../api/api';

export default function DriverPage() {
  const [autoNumber, setAutoNumber] = useState('AUTO-01');
  const [password, setPassword] = useState('password123');
  const [token, setToken] = useState(null);
  const [driver, setDriver] = useState(null);
  const watchIdRef = useRef(null);

  async function login() {
    try {
      const res = await api.post('/auth/driver/login', { autoNumber, password });
      setToken(res.data.token);
      setDriver(res.data.driver);
      alert('Logged in');
    } catch (e) {
      console.error(e);
      alert('Login failed');
    }
  }

  async function startShift() {
    if (!token) { alert('login first'); return; }
    await api.post('/driver/start', {}, { headers: { Authorization: `Bearer ${token}` } });
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          const payload = { driverId: driver.id, lat: latitude, lng: longitude, speedKph: (pos.coords.speed || 0) * 3.6 };
          socket.emit('driver:location', payload);
        },
        err => console.error('geo err', err),
        { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
      );
      alert('Shift started — sending locations');
    } else {
      alert('Geolocation not supported');
    }
  }

  async function endShift() {
    if (!token) { alert('login first'); return; }
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    await api.post('/driver/end', {}, { headers: { Authorization: `Bearer ${token}` } });
    alert('Shift ended');
  }

  useEffect(() => {
    if (driver && driver.id) {
      socket.emit('driver:join', { driverId: driver.id });
    }
  }, [driver]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Driver Interface</h2>
      <div>
        <label>Auto Number: <input value={autoNumber} onChange={e => setAutoNumber(e.target.value)} /></label><br />
        <label>Password: <input type="password" value={password} onChange={e => setPassword(e.target.value)} /></label><br />
        <button onClick={login}>Login</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={startShift}>Start Shift (Begin Tracking)</button>
        <button onClick={endShift} style={{ marginLeft: 8 }}>End Shift (Stop Tracking)</button>
      </div>

      <p style={{ marginTop: 12 }}>
        Notes: This demo uses your browser's geolocation. In real driver mobile app use native location services and ensure GPS stay ON.
      </p>
    </div>
  );
}
