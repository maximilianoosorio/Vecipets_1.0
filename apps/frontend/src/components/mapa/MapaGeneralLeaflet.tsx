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
  const [mounted, setMounted] = useState(false);
  const [icons, setIcons] = useState<any>(null);
  const centroMedellin: [number, number] = [6.2442, -75.5812];

  useEffect(() => {
    // 1. Garantizar que estamos en el cliente
    setMounted(true);

    // 2. Importar Leaflet dinámicamente para instanciar iconos
    import('leaflet').then((L) => {
      const greenIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #2E7D5B; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">
            🐾
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #3B82F6; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 11px;">
            📍
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12],
      });

      setIcons({ greenIcon, blueIcon });
    });
  }, []);

  // Si no está montado, mostramos un placeholder estático para evitar colisiones en SSR
  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[380px] bg-[#F8FAF9] flex items-center justify-center text-[#6B7280] text-xs font-semibold rounded-[16px] border border-slate-200">
        Cargando mapa de Medellín...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 min-h-[380px] sm:min-h-[440px] rounded-[16px] overflow-hidden border border-slate-200 shadow-xs">
      <MapContainer
        key="mapa-general-medellin"
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
            const lat = Number(item.latitud ?? item.ubicacion?.latitud);
            const lng = Number(item.longitud ?? item.ubicacion?.longitud);

            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
              return null;
            }

            const tipo = (item.tipoReporte || item.tipo_reporte || 'PERDIDO').toUpperCase();
            const currentIcon = tipo === 'ENCONTRADO' ? icons.blueIcon : icons.greenIcon;
            const listaFotos = item.imagenes || item.fotos || [];
            const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';

            return (
              <Marker key={item.id} position={[lat, lng]} icon={currentIcon}>
                <Popup>
                  <div className="p-1 max-w-[200px] font-sans text-left space-y-2">
                    {fotoUrl ? (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={fotoUrl}
                          alt="Foto Mascota"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                        🐾
                      </div>
                    )}

                    <div>
                      <span
                        className={`inline-block text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          tipo === 'ENCONTRADO'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tipo === 'ENCONTRADO' ? 'Encontrada' : 'Perdida'}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs mt-1">
                        {item.mascota?.nombre || 'Mascota sin nombre'}
                      </h4>
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                        {item.descripcion || 'Sin descripción adicional.'}
                      </p>
                    </div>

                    <Link
                      href={`/reportes/${item.id}`}
                      className="block w-full text-center bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-[10px] font-bold py-1.5 rounded-md transition-colors"
                    >
                      Ver detalle
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