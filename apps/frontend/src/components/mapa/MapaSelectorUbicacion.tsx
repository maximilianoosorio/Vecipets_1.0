'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Configuración de iconos de Leaflet para Next.js
const iconoUbicacion = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  latInicial?: number;
  lngInicial?: number;
  onSeleccionarCoordenadas: (lat: number, lng: number) => void;
}

// Subcomponente que gestiona el clic y recentra el mapa suavemente
function ControladorMapa({
  posicion,
  onSelect,
}: {
  posicion: [number, number];
  onSelect: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom(), { duration: 0.8 });
    },
  });

  useEffect(() => {
    map.flyTo(posicion, map.getZoom(), { duration: 0.8 });
  }, [posicion, map]);

  return null;
}

export default function MapaSelectorUbicacion({
  latInicial = 6.2442, // Medellín Centro
  lngInicial = -75.5812,
  onSeleccionarCoordenadas,
}: Props) {
  const [posicion, setPosicion] = useState<[number, number]>([latInicial, lngInicial]);

  useEffect(() => {
    setPosicion([latInicial, lngInicial]);
  }, [latInicial, lngInicial]);

  const handleSelect = (lat: number, lng: number) => {
    setPosicion([lat, lng]);
    onSeleccionarCoordenadas(lat, lng);
  };

  return (
    <div className="w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <MapContainer
        center={posicion}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={posicion} icon={iconoUbicacion} />
        <ControladorMapa posicion={posicion} onSelect={handleSelect} />
      </MapContainer>
    </div>
  );
}