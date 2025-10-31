import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // backend URL

function DriverDashboard() {
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Driver position:', latitude, longitude);

          // Send location to backend
          socket.emit('driverLocation', { latitude, longitude });
        },
        (error) => console.error('GPS Error:', error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      console.error('Geolocation not supported.');
    }
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Driver Dashboard</h2>
      <p>Sharing live GPS location...</p>
    </div>
  );
}

export default DriverDashboard;
