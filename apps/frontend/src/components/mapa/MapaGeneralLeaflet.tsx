'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

interface ReporteMapa {
  id: string;
  tipoReporte?: string;
  tipo_reporte?: string;
  descripcion?: string;
  latitud?: number | string;
  longitud?: number | string;
  direccion?: string;
  mascota?: {
    nombre?: string;
    especie?: string;
    raza?: string;
  };
  imagenes?: { id?: string; urlCloudinary?: string; url?: string }[];
  fotos?: { id?: string; urlCloudinary?: string; url?: string }[];
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}

export default function MapaGeneralLeaflet({ reportes = [] }: { reportes?: ReporteMapa[] }) {
  const [icons, setIcons] = useState<any>(null);
  const centroMedellin: [number, number] = [6.2442, -75.5812];

  useEffect(() => {
    // Importación dinámica de Leaflet para evitar conflictos con SSR en Next.js
    import('leaflet').then((L) => {
      // Marcador Verde (#2E7D5B) para Mascotas Perdidas
      const greenIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #2E7D5B; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            🔴
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
      });

      // Marcador Azul (#3B82F6) para Mascotas Encontradas
      const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #3B82F6; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            🔵
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
      });

      // Marcador Ámbar para Refugios Aliados
      const shelterIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #F59E0B; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px; font-weight: bold;">
            🏠
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
        popupAnchor: [0, -14],
      });

      setIcons({ greenIcon, blueIcon, shelterIcon });
    });
  }, []);

  return (
    <div className="h-full w-full relative z-0 min-h-[380px] sm:min-h-[440px] rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
      <MapContainer
        center={centroMedellin}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {icons &&
          reportes.map((item) => {
            // Extracción segura de coordenadas
            const lat = Number(item.latitud ?? item.ubicacion?.latitud);
            const lng = Number(item.longitud ?? item.ubicacion?.longitud);

            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
              return null;
            }

            const tipo = (item.tipoReporte || item.tipo_reporte || 'PERDIDO').toUpperCase();
            
            let currentIcon = icons.greenIcon;
            if (tipo === 'ENCONTRADO') currentIcon = icons.blueIcon;
            if (tipo === 'REFUGIO') currentIcon = icons.shelterIcon;

            const listaFotos = item.imagenes || item.fotos || [];
            const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';

            return (
              <Marker key={item.id} position={[lat, lng]} icon={currentIcon}>
                <Popup className="custom-popup">
                  <div className="p-1 max-w-[220px] font-sans text-left space-y-2">
                    {fotoUrl ? (
                      <div className="w-full h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={fotoUrl}
                          alt="Foto Mascota"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-20 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">
                        🐾
                      </div>
                    )}

                    <div>
                      <span
                        className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          tipo === 'ENCONTRADO'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tipo === 'ENCONTRADO' ? 'Encontrada' : 'Perdida'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {item.mascota?.nombre || 'Mascota sin nombre'}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {item.descripcion || 'Sin descripción adicional.'}
                      </p>
                    </div>

                    <Link
                      href={`/reportes/${item.id}`}
                      className="block w-full text-center bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-xs"
                    >
                      Ver Expediente Completo
                    </Link>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}