'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

// Carga dinámica del mapa deshabilitando SSR para evitar errores de Leaflet/window
const MapaGeneralLeaflet = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[550px] w-full bg-[#F8FAF9] rounded-2xl animate-pulse flex flex-col items-center justify-center text-[#6B7280] gap-2 border border-slate-200">
        <span className="text-3xl animate-bounce">🐾</span>
        <p className="text-sm font-medium">Cargando mapa interactivo de Medellín...</p>
      </div>
    ),
  }
);

interface ReporteMapa {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO' | 'REFUGIO' | 'VETERINARIA';
  descripcion?: string;
  fechaEvento?: string;
  estado?: string;
  mascota?: {
    nombre?: string;
    especie?: string;
    color?: string;
  };
  imagenes?: { urlCloudinary: string }[];
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
}

export default function MapaPage() {
  const [reportes, setReportes] = useState<ReporteMapa[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroEspecie, setFiltroEspecie] = useState('TODOS');

  useEffect(() => {
    fetchAPI<ReporteMapa[]>('/reportes/publicos')
      .then((data) => setReportes(data || []))
      .catch((err) => console.error('Error al cargar datos del mapa:', err))
      .finally(() => setCargando(false));
  }, []);

  // Filtrado reactivo de reportes
  const reportesFiltrados = reportes.filter((r) => {
    const coincideTipo = filtroTipo === 'TODOS' || r.tipoReporte === filtroTipo;
    const coincideEspecie =
      filtroEspecie === 'TODOS' ||
      r.mascota?.especie?.toUpperCase() === filtroEspecie.toUpperCase();
    return coincideTipo && coincideEspecie;
  });

  return (
    <main className="bg-[#F8FAF9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
              📍 Georreferenciación en Tiempo Real
            </span>
            <h1 className="text-3xl font-bold text-[#1F2937]">Mapa de Avistamientos</h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Encuentra mascotas perdidas, encontradas y centros de atención autorizados en Medellín.
            </p>
          </div>

          <Link
            href="/reportes/nuevo"
            className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-xs whitespace-nowrap"
          >
            + Publicar Reporte
          </Link>
        </div>

        {/* BARRA DE FILTROS Y LEYENDA */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            <span className="text-xs font-bold text-[#1F2937]">Filtrar por:</span>
            
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-xl px-3 py-2 focus:outline-none focus:border-[#2E7D5B]"
            >
              <option value="TODOS">Todos los tipos</option>
              <option value="PERDIDO">Mascotas Perdidas</option>
              <option value="ENCONTRADO">Mascotas Encontradas</option>
            </select>

            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-xl px-3 py-2 focus:outline-none focus:border-[#2E7D5B]"
            >
              <option value="TODOS">Todas las especies</option>
              <option value="PERRO">Perros 🐶</option>
              <option value="GATO">Gatos 🐱</option>
            </select>
          </div>

          {/* Leyenda Visual */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2E7D5B]" /> Perdida
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6]" /> Encontrada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-xs" /> Refugio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#DC2626] rounded-xs" /> Veterinaria
            </span>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL MAPA */}
        <div className="w-full h-[580px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs relative">
          <MapaGeneralLeaflet reportes={reportesFiltrados} />
        </div>

        {/* RESUMEN INFORMATIVO */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs text-[#6B7280] flex justify-between items-center">
          <span>Mostrando <strong>{reportesFiltrados.length}</strong> punto(s) en el mapa</span>
          <span className="text-[#2E7D5B] font-semibold">🔒 Información verificada por refugios aliados</span>
        </div>

      </div>
    </main>
  );
}