'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';

// Configurar íconos de Leaflet por defecto en Next.js
const iconoPerdido = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconoEncontrado = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function CentrarMapa({ reportes }: { reportes: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (reportes.length > 0) {
      const coordenadasValidas = reportes
        .filter((r) => !isNaN(Number(r.latitud ?? r.lat)) && !isNaN(Number(r.longitud ?? r.lng)))
        .map((r) => [Number(r.latitud ?? r.lat), Number(r.longitud ?? r.lng)] as [number, number]);

      if (coordenadasValidas.length > 0) {
        const bounds = L.latLngBounds(coordenadasValidas);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [reportes, map]);
  return null;
}

interface MapaReportesProps {
  reportes: any[];
}

export default function MapaReportes({ reportes }: MapaReportesProps) {
  const centroPorDefecto: [number, number] = [6.2442, -75.5812]; // Medellín por defecto

  const reportesConCoordenadas = reportes.filter((r) => {
    const lat = Number(r.latitud ?? r.lat);
    const lng = Number(r.longitud ?? r.lng);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  });

  return (
    <div className="w-full h-full min-h-[500px] rounded-3xl overflow-hidden shadow-inner border border-slate-200 z-0">
      <MapContainer
        center={centroPorDefecto}
        zoom={12}
        scrollWheelZoom={true}
        className="w-full h-full min-h-[500px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <CentrarMapa reportes={reportesConCoordenadas} />

        {reportesConCoordenadas.map((r) => {
          const lat = Number(r.latitud ?? r.lat);
          const lng = Number(r.longitud ?? r.lng);
          const esPerdido = (r.tipoReporte || r.tipo_reporte || '').toUpperCase().includes('PERD');
          const icono = esPerdido ? iconoPerdido : iconoEncontrado;
          const imagenUrl = r.mascota?.fotoUrl || r.mascota?.foto_url || r.fotoUrl || r.foto_url;

          return (
            <Marker key={r.id} position={[lat, lng]} icon={icono}>
              <Popup>
                <div className="p-1 max-w-[200px] text-left font-sans">
                  {imagenUrl && (
                    <img
                      src={imagenUrl}
                      alt={r.mascota?.nombre || 'Mascota'}
                      className="w-full h-24 object-cover rounded-xl mb-2"
                    />
                  )}
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mb-1 ${
                      esPerdido
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {esPerdido ? 'Perdido' : 'Encontrado'}
                  </span>
                  <h4 className="font-bold text-sm text-[#292A2F] leading-tight">
                    {r.mascota?.nombre || r.titulo || 'Mascota reportada'}
                  </h4>
                  <p className="text-xs text-[#53627A] mt-1 line-clamp-2">
                    {r.descripcion || r.ubicacion || 'Sin descripción adicional'}
                  </p>
                  <Link
                    href={`/reportes/${r.id}`}
                    className="block mt-2 text-center bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs font-bold py-1.5 px-3 rounded-full transition-colors"
                  >
                    Ver detalles
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