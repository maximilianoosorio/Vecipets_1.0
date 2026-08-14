'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para los íconos por defecto de Leaflet en Next.js
const customIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  onUbicacionSeleccionada: (lat: number, lng: number) => void;
}

function MarcadorInteractivo({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const [posicion, setPosicion] = useState<L.LatLng | null>(null);

  useMapEvents({
    click(e) {
      setPosicion(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return posicion ? <Marker position={posicion} icon={customIcon} /> : null;
}

export default function SelectorUbicacion({ onUbicacionSeleccionada }: Props) {
  // Coordenadas por defecto: Medellín
  const posicionInicial = { lat: 6.2442, lng: -75.5812 };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-slate-700">
      <MapContainer
        center={[posicionInicial.lat, posicionInicial.lng]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarcadorInteractivo onSelect={onUbicacionSeleccionada} />
      </MapContainer>
    </div>
  );
}