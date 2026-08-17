'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  latInicial?: number;
  lngInicial?: number;
  onSelectLocation: (lat: number, lng: number) => void;
}

function MarcadorInteractivo({
  posicion,
  onSelect,
  icon,
}: {
  posicion: [number, number];
  onSelect: (lat: number, lng: number) => void;
  icon: any;
}) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return icon ? <Marker position={posicion} icon={icon} /> : null;
}

export default function MapaSelectorUbicacion({
  latInicial = 6.2442,
  lngInicial = -75.5812,
  onSelectLocation,
}: Props) {
  const [posicion, setPosicion] = useState<[number, number]>([latInicial, lngInicial]);
  const [icon, setIcon] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((L) => {
      const customIcon = L.divIcon({
        className: 'custom-selector-marker',
        html: `
          <div style="background-color: #5E7BC4; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 15px;">
            📍
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      setIcon(customIcon);
    });
  }, []);

  const handleSelect = (lat: number, lng: number) => {
    setPosicion([lat, lng]);
    onSelectLocation(lat, lng);
  };

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#EEF2FC] flex items-center justify-center text-[#53627A] text-xs font-semibold">
        Cargando selector de ubicación...
      </div>
    );
  }

  return (
    <MapContainer
      center={[latInicial, lngInicial]}
      zoom={13}
      scrollWheelZoom={false}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MarcadorInteractivo posicion={posicion} onSelect={handleSelect} icon={icon} />
    </MapContainer>
  );
}