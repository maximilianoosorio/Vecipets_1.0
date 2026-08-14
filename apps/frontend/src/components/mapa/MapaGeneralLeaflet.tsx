'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface ReporteMapa {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO' | 'REFUGIO' | 'VETERINARIA';
  descripcion?: string;
  mascota?: {
    nombre?: string;
    especie?: string;
  };
  imagenes?: { urlCloudinary: string }[];
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}

export default function MapaGeneralLeaflet({ reportes = [] }: { reportes?: ReporteMapa[] }) {
  const [icons, setIcons] = useState<any>(null);
  const centroMedellin: [number, number] = [6.2442, -75.5812];

  useEffect(() => {
    // Importamos Leaflet de forma dinámica en el cliente para crear los íconos
    import('leaflet').then((L) => {
      // Marcador Verde (#2E7D5B) para Mascotas Perdidas
      const greenIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #2E7D5B; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Marcador Azul (#3B82F6) para Mascotas Encontradas
      const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      setIcons({ greenIcon, blueIcon });
    });
  }, []);

  return (
    <div className="h-full w-full relative z-0 min-h-[400px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
      <MapContainer center={centroMedellin} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {icons &&
          reportes.map((item) => {
            if (!item.ubicacion?.latitud || !item.ubicacion?.longitud) return null;

            const currentIcon =
              item.tipoReporte === 'ENCONTRADO' ? icons.blueIcon : icons.greenIcon;

            return (
              <Marker
                key={item.id}
                position={[item.ubicacion.latitud, item.ubicacion.longitud]}
                icon={currentIcon}
              >
                <Popup>
                  <div className="p-1 max-w-[200px] font-sans">
                    {item.imagenes?.[0] && (
                      <img
                        src={item.imagenes[0].urlCloudinary}
                        alt="Foto Mascota"
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                    )}
                    <h4 className="font-bold text-slate-800 text-sm">
                      {item.mascota?.nombre || 'Mascota sin nombre'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {item.descripcion}
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}