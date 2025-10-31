import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (color = 'blue') => {
  const svg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <path fill="${color}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5" fill="white"/>
    </svg>
  `);
  return new L.DivIcon({
    className: '',
    html: `<img src="data:image/svg+xml;charset=UTF-8,${svg}" />`,
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });
};

export default function MapWithMarkers({ center = [32.728, 74.860], zoom = 15, markers = [], polygon = null }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '70vh', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {polygon && <Polygon positions={polygon.map(([lng, lat]) => [lat, lng])} />}
      {markers.map(m => (
        <Marker key={m.key || m.driverId || `${m.lng}-${m.lat}`} position={[m.lat, m.lng]} icon={createIcon(m.color || 'blue')}>
          <Popup>
            <div>
              <strong>{m.autoNumber || m.title}</strong><br />
              {m.name && <div>{m.name}</div>}
              {m.info && <div>{m.info}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
