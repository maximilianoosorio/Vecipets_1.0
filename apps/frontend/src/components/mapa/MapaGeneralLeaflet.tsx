'use client';

import { useEffect, useState } from 'react';
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
  direccion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  mascota?: Mascota;
  imagenes?: { id?: string; urlCloudinary?: string; url?: string }[];
}

export default function MapaGeneralLeaflet({ reportes = [] }: { reportes?: ReporteMapa[] }) {
  const [ComponenteMapa, setComponenteMapa] = useState<any>(null);

  useEffect(() => {
    // Importación 100% en cliente para garantizar que window exista
    if (typeof window !== 'undefined') {
      Promise.all([
        import('react-leaflet'),
        import('leaflet'),
      ]).then(([{ MapContainer, TileLayer, Marker, Popup, useMap }, L]) => {
        
        // Iconos
        const blueIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background-color: #5E7BC4; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
              🐾
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });

        const greenIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="background-color: #16A34A; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; color: white; font-size: 14px;">
              📍
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });

        function CentrarMapa({ lista }: { lista: ReporteMapa[] }) {
          const map = useMap();
          useEffect(() => {
            if (!lista || lista.length === 0) return;
            const puntos: [number, number][] = [];
            lista.forEach((r) => {
              const rawLat = r.latitud ?? (r as any).lat;
              const rawLng = r.longitud ?? (r as any).lng;
              if (rawLat != null && rawLng != null) {
                const lat = Number(rawLat);
                const lng = Number(rawLng);
                if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
                  puntos.push([lat, lng]);
                }
              }
            });

            if (puntos.length > 0) {
              const bounds = L.latLngBounds(puntos);
              map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
            }
          }, [lista, map]);
          return null;
        }

        // Definimos el mapa interactivo montado
        const MapaRenderizado = ({ data }: { data: ReporteMapa[] }) => (
          <MapContainer
            center={[6.2442, -75.5812]}
            zoom={12}
            scrollWheelZoom={true}
            className="h-full w-full"
            style={{ minHeight: '500px', height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <CentrarMapa lista={data} />
            {data.map((item) => {
              const rawLat = item.latitud ?? (item as any).lat;
              const rawLng = item.longitud ?? (item as any).lng;
              if (rawLat == null || rawLng == null) return null;

              const lat = Number(rawLat);
              const lng = Number(rawLng);
              if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;

              const tipo = (item.tipoReporte || item.tipo_reporte || item.tipo || 'PERDIDO').toUpperCase();
              const icono = tipo.includes('ENCONTR') ? greenIcon : blueIcon;
              const fotoUrl = item.imagenes?.[0]?.urlCloudinary || item.imagenes?.[0]?.url || '';
              const fecha = item.fechaEvento || item.fecha_evento;

              return (
                <Marker key={item.id} position={[lat, lng]} icon={icono}>
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
                            tipo.includes('ENCONTR')
                              ? 'bg-[#16A34A]/15 text-[#16A34A]'
                              : 'bg-[#5E7BC4]/15 text-[#5E7BC4]'
                          }`}
                        >
                          {tipo.includes('ENCONTR') ? 'Mascota Encontrada' : 'Mascota Perdida'}
                        </span>

                        <h4 className="font-bold text-[#292A2F] text-xs mt-1 truncate">
                          {item.mascota?.nombre || 'Mascota reportada'}
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
        );

        setComponenteMapa(() => MapaRenderizado);
      });
    }
  }, []);

  if (!ComponenteMapa) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#EEF2FC] flex flex-col items-center justify-center text-[#53627A] text-xs font-semibold rounded-[24px]">
        <span className="text-3xl mb-2 animate-bounce">📍</span>
        Cargando mapa interactivo de Medellín...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative z-0 min-h-[500px] rounded-[24px] overflow-hidden">
      <ComponenteMapa data={reportes} />
    </div>
  );
}