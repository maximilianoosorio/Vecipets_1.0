'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

// Carga dinámica del mapa deshabilitando SSR
const MapaGeneralLeaflet = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[550px] w-full bg-[#F8FAF9] rounded-3xl animate-pulse flex flex-col items-center justify-center text-[#6B7280] gap-3 border border-slate-200">
        <span className="text-4xl animate-bounce">🐾</span>
        <p className="text-sm font-semibold">Cargando mapa interactivo de Medellín...</p>
      </div>
    ),
  }
);

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
}

interface Imagen {
  id?: string;
  urlCloudinary?: string;
  url?: string;
}

interface ReporteMapa {
  id: string;
  tipoReporte?: string;
  tipo_reporte?: string;
  descripcion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  estado?: string;
  direccion?: string;
  latitud?: number | string;
  longitud?: number | string;
  mascota?: Mascota;
  imagenes?: Imagen[];
  fotos?: Imagen[];
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
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    let isMounted = true;
    setCargando(true);

    fetchAPI<ReporteMapa[]>('/reportes/publicos')
      .then((data) => {
        if (isMounted) {
          setReportes(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error('Error al cargar datos del mapa:', err))
      .finally(() => {
        if (isMounted) setCargando(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado reactivo optimizado en memoria
  const reportesFiltrados = useMemo(() => {
    return reportes.filter((r) => {
      const tipo = (r.tipoReporte || r.tipo_reporte || '').toUpperCase();
      const especie = (r.mascota?.especie || '').toUpperCase();
      const nombre = (r.mascota?.nombre || '').toLowerCase();
      const raza = (r.mascota?.raza || '').toLowerCase();
      const sector = (r.direccion || '').toLowerCase();
      const query = busqueda.toLowerCase().trim();

      const coincideTipo = filtroTipo === 'TODOS' || tipo === filtroTipo;
      const coincideEspecie = filtroEspecie === 'TODOS' || especie === filtroEspecie;
      const coincideBusqueda =
        !query ||
        nombre.includes(query) ||
        raza.includes(query) ||
        sector.includes(query);

      return coincideTipo && coincideEspecie && coincideBusqueda;
    });
  }, [reportes, filtroTipo, filtroEspecie, busqueda]);

  return (
    <main className="bg-[#F8FAF9] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ENCABEZADO */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              📍 Georreferenciación en Tiempo Real
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">Mapa de Avistamientos</h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Encuentra mascotas perdidas, encontradas y refugios aliados en Medellín.
            </p>
          </div>

          <Link
            href="/reportes/nuevo"
            className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold px-6 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>➕</span> Publicar Reporte
          </Link>
        </div>

        {/* BARRA DE FILTROS Y BÚSQUEDA */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            
            {/* Buscador de Barrio/Nombre */}
            <div className="sm:col-span-1 lg:col-span-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por barrio (ej: Belén, Laureles), nombre o raza..."
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              />
            </div>

            {/* Filtro por Tipo */}
            <div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
              >
                <option value="TODOS">Todos los casos</option>
                <option value="PERDIDO">🔴 Mascotas Perdidas</option>
                <option value="ENCONTRADO">🔵 Mascotas Encontradas</option>
              </select>
            </div>

            {/* Filtro por Especie */}
            <div>
              <select
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
              >
                <option value="TODOS">Todas las especies</option>
                <option value="PERRO">Perros 🐶</option>
                <option value="GATO">Gatos 🐱</option>
                <option value="OTRO">Otros</option>
              </select>
            </div>

          </div>

          {/* Leyenda Visual y Conteo */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4 text-[#6B7280]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D5B]" /> Perdida
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> Encontrada
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-xs" /> Refugio Aliado
              </span>
            </div>

            <span className="text-[#6B7280] font-medium">
              Mostrando <strong className="text-[#1F2937] font-bold">{reportesFiltrados.length}</strong> punto(s) en Medellín
            </span>
          </div>
        </div>

        {/* CONTENEDOR PRINCIPAL DEL MAPA */}
        <div className="w-full h-[550px] sm:h-[620px] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs relative">
          <MapaGeneralLeaflet reportes={reportesFiltrados} />
        </div>

        {/* RESUMEN INFORMATIVO */}
        <div className="bg-white border border-slate-200 p-4 rounded-2xl text-xs text-[#6B7280] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Mostrando reportes activos validados para la comunidad.</span>
          <span className="text-[#2E7D5B] font-semibold">🔒 Información canalizada por refugios aliados</span>
        </div>

      </div>
    </main>
  );
}