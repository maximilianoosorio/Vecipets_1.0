'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
}

interface ReporteMapa {
  id: string;
  tipoReporte?: string;
  tipo_reporte?: string;
  tipo?: string;
  descripcion?: string;
  latitud?: number | string;
  longitud?: number | string;
  lat?: number | string;
  lng?: number | string;
  direccion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  mascota?: Mascota;
  imagenes?: { id?: string; urlCloudinary?: string; url?: string }[];
  fotos?: { id?: string; urlCloudinary?: string; url?: string }[];
  ubicacion?: {
    latitud?: number | string;
    longitud?: number | string;
    lat?: number | string;
    lng?: number | string;
  };
}

// Componente para ajustar la vista a los marcadores
function AjustarVista({ reportes }: { reportes: ReporteMapa[] }) {
  const map = useMap();

  useEffect(() => {
    if (!reportes || reportes.length === 0) return;

    import('leaflet').then((L) => {
      const validPoints: [number, number][] = [];

      reportes.forEach((r) => {
        const rawLat = r.latitud ?? r.ubicacion?.latitud ?? r.lat ?? r.ubicacion?.lat;
        const rawLng = r.longitud ?? r.ubicacion?.longitud ?? r.lng ?? r.ubicacion?.lng;

        if (rawLat && rawLng) {
          const latNum = typeof rawLat === 'string' ? parseFloat(rawLat) : rawLat;
          const lngNum = typeof rawLng === 'string' ? parseFloat(rawLng) : rawLng;

          if (!isNaN(latNum) && !isNaN(lngNum) && (latNum !== 0 || lngNum !== 0)) {
            validPoints.push([latNum, lngNum]);
          }
        }
      });

      if (validPoints.length > 0) {
        const bounds = L.latLngBounds(validPoints);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      }
    });
  }, [reportes, map]);

  return null;
}

export default function MapaGeneralLeaflet({ reportes = [] }: { reportes?: ReporteMapa[] }) {
  const [mounted, setMounted] = useState(false);
  const [icons, setIcons] = useState<any>(null);
  const centroMedellin: [number, number] = [6.2442, -75.5812];

  useEffect(() => {
    setMounted(true);

    import('leaflet').then((L) => {
      // Icono Mascota Perdida (Azul Oficial #5E7BC4)
      const blueIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #5E7BC4; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
            🐾
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      // Icono Mascota Encontrada (Verde Éxito #16A34A)
      const greenIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #16A34A; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      // Icono Refugio / Apoyo (Naranja #F3B26C)
      const orangeIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `
          <div style="background-color: #F3B26C; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
            🏠
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -14],
      });

      setIcons({ blueIcon, greenIcon, orangeIcon });
    });
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full min-h-[380px] bg-[#EEF2FC] flex flex-col items-center justify-center text-[#53627A] text-xs font-semibold rounded-[20px]">
        <span className="text-3xl mb-2 animate-bounce">📍</span>
        Cargando mapa interactivo de Medellín...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 min-h-[380px] sm:min-h-[440px] rounded-[20px] overflow-hidden">
      <MapContainer
        key="mapa-general-medellin"
        center={centroMedellin}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Ajuste automático de encuadre cuando hay reportes */}
        <AjustarVista reportes={reportes} />

        {icons &&
          reportes.map((item) => {
            // Tolerancia robusta a formatos numéricos y strings
            const rawLat = item.latitud ?? item.ubicacion?.latitud ?? item.lat ?? item.ubicacion?.lat;
            const rawLng = item.longitud ?? item.ubicacion?.longitud ?? item.lng ?? item.ubicacion?.lng;

            if (rawLat === undefined || rawLng === undefined || rawLat === null || rawLng === null) {
              return null;
            }

            const lat = typeof rawLat === 'string' ? parseFloat(rawLat) : Number(rawLat);
            const lng = typeof rawLng === 'string' ? parseFloat(rawLng) : Number(rawLng);

            if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
              return null;
            }

            const tipo = (item.tipoReporte || item.tipo_reporte || item.tipo || 'PERDIDO').toUpperCase();
            const currentIcon =
              tipo === 'ENCONTRADO'
                ? icons.greenIcon
                : tipo === 'REFUGIO'
                ? icons.orangeIcon
                : icons.blueIcon;

            const listaFotos = item.imagenes || item.fotos || [];
            const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';
            const fecha = item.fechaEvento || item.fecha_evento;

            return (
              <Marker key={item.id} position={[lat, lng]} icon={currentIcon}>
                <Popup>
                  <div className="p-1 max-w-[210px] font-sans text-left space-y-2 text-[#292A2F]">
                    {fotoUrl ? (
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={fotoUrl}
                          alt={item.mascota?.nombre || 'Mascota'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-16 bg-[#EEF2FC] rounded-lg flex items-center justify-center text-2xl">
                        🐾
                      </div>
                    )}

                    <div>
                      <span
                        className={`inline-block text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          tipo === 'ENCONTRADO'
                            ? 'bg-[#16A34A]/15 text-[#16A34A]'
                            : 'bg-[#5E7BC4]/15 text-[#5E7BC4]'
                        }`}
                      >
                        {tipo === 'ENCONTRADO' ? 'Mascota Encontrada' : 'Mascota Perdida'}
                      </span>

                      <h4 className="font-bold text-[#292A2F] text-xs mt-1 truncate">
                        {item.mascota?.nombre || (tipo === 'ENCONTRADO' ? 'Mascota rescatada' : 'Mascota sin nombre')}
                      </h4>

                      <p className="text-[10px] text-[#53627A] line-clamp-2 mt-0.5 leading-relaxed">
                        {item.descripcion || 'Sin descripción adicional.'}
                      </p>

                      <div className="flex items-center justify-between text-[9px] text-[#53627A] pt-1 mt-1 border-t border-slate-100">
                        <span className="truncate max-w-[110px]">📍 {item.direccion || 'Medellín'}</span>
                        <span>{fecha ? new Date(fecha).toLocaleDateString() : ''}</span>
                      </div>
                    </div>

                    <Link
                      href={`/reportes/${item.id}`}
                      className="block w-full text-center bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-[10px] font-semibold py-1.5 rounded-full transition-colors shadow-2xs"
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