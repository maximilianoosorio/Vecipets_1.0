'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const MapaGeneralLeaflet = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-[#EEF2FC] flex flex-col items-center justify-center text-[#53627A] text-xs font-semibold">
        <span className="text-3xl mb-2 animate-bounce">📍</span>
        Cargando mapa de alertas en Medellín...
      </div>
    ),
  }
);

interface MapSectionProps {
  reportes: any[];
}

export default function MapSection({ reportes }: MapSectionProps) {
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroEspecie, setFiltroEspecie] = useState<string>('TODOS');

  const reportesFiltrados = reportes.filter((r) => {
    const tipo = (r.tipoReporte || r.tipo_reporte || '').toUpperCase();
    const especie = (r.mascota?.especie || '').toUpperCase();

    const matchTipo = filtroTipo === 'TODOS' || tipo === filtroTipo;
    const matchEspecie = filtroEspecie === 'TODOS' || especie === filtroEspecie;

    return matchTipo && matchEspecie;
  });

  return (
    <section className="bg-[#EEF2FC]/50 py-16 border-y border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
            Encuentra alertas cerca de ti
          </h2>
          <p className="text-xs sm:text-sm text-[#53627A]">
            Explora reportes de mascotas perdidas y encontradas en Medellín.
          </p>
        </div>

        {/* CONTROLES DE FILTRO */}
        <div className="bg-white p-4 rounded-t-[24px] border border-slate-100 border-b-0 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-2xs">
          <div className="flex flex-wrap gap-2.5 items-center w-full sm:w-auto">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="bg-[#EEF2FC] border border-slate-200 text-xs font-semibold text-[#292A2F] rounded-full px-4 py-2 focus:outline-none focus:border-[#5E7BC4]"
            >
              <option value="TODOS">Todas las alertas</option>
              <option value="PERDIDO">Perdidas</option>
              <option value="ENCONTRADO">Encontradas</option>
            </select>

            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="bg-[#EEF2FC] border border-slate-200 text-xs font-semibold text-[#292A2F] rounded-full px-4 py-2 focus:outline-none focus:border-[#5E7BC4]"
            >
              <option value="TODOS">Especie: Todas</option>
              <option value="PERRO">Perros</option>
              <option value="GATO">Gatos</option>
            </select>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-medium text-[#53627A]">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#5E7BC4]" /> Perdida</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" /> Encontrada</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#F3B26C]" /> Refugio</span>
          </div>
        </div>

        {/* MAPA LEAFLET */}
        <div className="w-full h-[480px] bg-white rounded-b-[24px] border border-slate-100 overflow-hidden shadow-xs relative z-0">
          <MapaGeneralLeaflet reportes={reportesFiltrados} />
        </div>

      </div>
    </section>
  );
}