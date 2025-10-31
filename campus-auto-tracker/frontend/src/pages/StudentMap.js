import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const socket = io('http://localhost:5000');

function StudentMap() {
  const [driverPos, setDriverPos] = useState(null);

  useEffect(() => {
    socket.on('locationUpdate', (data) => {
      console.log('Driver location update:', data);
      setDriverPos([data.latitude, data.longitude]);
    });

    return () => socket.disconnect();
  }, []);

  const icon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
  });

  return (
    <div>
      <MapContainer center={[32.7266, 74.8570]} zoom={15} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {driverPos && (
          <Marker position={driverPos} icon={icon}>
            <Popup>Driver is here 🚗</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}

export default StudentMap;
