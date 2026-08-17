'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Imagen {
  id?: string;
  urlCloudinary?: string;
  url?: string;
}

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
  tamano?: string;
  sexo?: string;
}

interface Reporte {
  id: string;
  tipoReporte?: 'PERDIDO' | 'ENCONTRADO';
  tipo_reporte?: 'PERDIDO' | 'ENCONTRADO';
  descripcion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  direccion?: string;
  estado?: string;
  mascota?: Mascota;
  imagenes?: Imagen[];
  fotos?: Imagen[];
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Filtros reactivos
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');
  const [filtroEspecie, setFiltroEspecie] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setCargando(true);

    fetchAPI<Reporte[]>('/reportes/publicos')
      .then((data) => {
        if (isMounted) {
          setReportes(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error al conectar con el servidor de reportes.');
        }
      })
      .finally(() => {
        if (isMounted) setCargando(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado reactivo en memoria
  const reportesFiltrados = useMemo(() => {
    return reportes.filter((r) => {
      const tipo = (r.tipoReporte || r.tipo_reporte || '').toUpperCase();
      const especie = (r.mascota?.especie || '').toUpperCase();
      const nombre = (r.mascota?.nombre || '').toLowerCase();
      const raza = (r.mascota?.raza || '').toLowerCase();
      const sector = (r.direccion || '').toLowerCase();
      const query = busqueda.toLowerCase().trim();

      const matchTipo = filtroTipo === 'TODOS' || tipo === filtroTipo;
      const matchEspecie = filtroEspecie === 'TODOS' || especie === filtroEspecie;
      const matchBusqueda =
        !query ||
        nombre.includes(query) ||
        raza.includes(query) ||
        sector.includes(query);

      return matchTipo && matchEspecie && matchBusqueda;
    });
  }, [reportes, filtroTipo, filtroEspecie, busqueda]);

  return (
    <main className="min-h-screen bg-[#F8FAF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* ENCABEZADO Y BOTÓN CREAR */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[16px] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              📋 Directorio de Casos
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Mascotas Reportadas
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-xl">
              Explora los reportes de mascotas perdidas y encontradas para facilitar su búsqueda y recuperación.
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link
              href="/mapa"
              className="flex-1 md:flex-initial text-center bg-white border border-[#2E7D5B] text-[#2E7D5B] hover:bg-[#2E7D5B]/5 font-semibold px-5 py-2.5 rounded-[10px] text-xs sm:text-sm transition-all"
            >
              🗺️ Ver en Mapa
            </Link>
            <Link
              href="/reportes/nuevo"
              className="flex-1 md:flex-initial text-center bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold px-6 py-2.5 rounded-[10px] text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Publicar Reporte
            </Link>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-[16px] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            
            {/* Buscador */}
            <div className="sm:col-span-1 lg:col-span-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, sector o raza..."
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-[10px] px-3.5 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              />
            </div>

            {/* Filtro por Tipo */}
            <div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-[10px] px-3.5 py-2.5 focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
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
                className="w-full bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-[10px] px-3.5 py-2.5 focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
              >
                <option value="TODOS">Todas las especies</option>
                <option value="PERRO">Perros</option>
                <option value="GATO">Gatos</option>
                <option value="OTRO">Otros</option>
              </select>
            </div>

          </div>

          <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100 text-[#6B7280]">
            <span>
              Mostrando <strong className="text-[#1F2937]">{reportesFiltrados.length}</strong> reporte(s)
            </span>
            {(filtroTipo !== 'TODOS' || filtroEspecie !== 'TODOS' || busqueda !== '') && (
              <button
                onClick={() => {
                  setFiltroTipo('TODOS');
                  setFiltroEspecie('TODOS');
                  setBusqueda('');
                }}
                className="text-[#2E7D5B] font-semibold hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-[12px] text-center">
            ⚠️ {error}
          </div>
        )}

        {/* SKELETON LOADERS */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-xs animate-pulse flex flex-col"
              >
                <div className="h-48 bg-slate-200" />
                <div className="p-5 space-y-3 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  <div className="h-10 bg-slate-100 rounded-[10px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ESTADO VACÍO */}
        {!cargando && !error && reportesFiltrados.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-[16px] p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <span className="text-4xl block">🐾</span>
            <h3 className="text-base font-bold text-[#1F2937]">No se encontraron reportes</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No hay casos que coincidan con los filtros seleccionados actualmente.
            </p>
            <button
              onClick={() => {
                setFiltroTipo('TODOS');
                setFiltroEspecie('TODOS');
                setBusqueda('');
              }}
              className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-semibold px-6 py-2.5 rounded-[10px] transition-all"
            >
              Restablecer Filtros
            </button>
          </div>
        )}

        {/* GRILLA DE REPORTES */}
        {!cargando && !error && reportesFiltrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportesFiltrados.map((reporte) => {
              const tipo = (reporte.tipoReporte || reporte.tipo_reporte || 'PERDIDO').toUpperCase();
              const esPerdido = tipo === 'PERDIDO';
              const listaFotos = reporte.imagenes || reporte.fotos || [];
              const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';
              const fecha = reporte.fechaEvento || reporte.fecha_evento;

              return (
                <div
                  key={reporte.id}
                  className="bg-white border border-slate-200 rounded-[16px] overflow-hidden shadow-xs hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  {/* IMAGEN CON BADGE */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden flex items-center justify-center">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={reporte.mascota?.nombre || 'Mascota'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-slate-400">
                        <span className="text-3xl">🐾</span>
                        <span className="text-[10px]">Sin foto disponible</span>
                      </div>
                    )}

                    <span
                      className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        esPerdido
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-[#3B82F6] text-white'
                      }`}
                    >
                      {esPerdido ? 'Perdida' : 'Encontrada'}
                    </span>
                  </div>

                  {/* CUERPO DE LA TARJETA */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-medium text-[#2E7D5B] bg-[#2E7D5B]/10 px-2.5 py-0.5 rounded-md truncate max-w-[160px]">
                          📍 {reporte.direccion || 'Ubicación registrada'}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {fecha ? new Date(fecha).toLocaleDateString() : ''}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-[#1F2937] truncate mt-1">
                        {reporte.mascota?.nombre || (esPerdido ? 'Mascota sin nombre' : 'Mascota encontrada')}
                      </h2>

                      <p className="text-xs text-[#6B7280] line-clamp-2 mt-1 leading-relaxed">
                        {reporte.descripcion || 'Sin descripción detallada.'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 mt-3 bg-[#F8FAF9] p-3 rounded-[10px] border border-slate-100 text-[11px]">
                        <div>
                          <span className="text-[#6B7280] block text-[9px] uppercase font-semibold">Especie</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {reporte.mascota?.especie || 'No especificada'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6B7280] block text-[9px] uppercase font-semibold">Raza</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {reporte.mascota?.raza || 'Mestizo'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6B7280] block text-[9px] uppercase font-semibold">Color</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {reporte.mascota?.color || 'No especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#6B7280] block text-[9px] uppercase font-semibold">Tamaño</span>
                          <span className="font-medium text-slate-800 truncate block">
                            {reporte.mascota?.tamano || 'Mediano'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <Link
                        href={`/reportes/${reporte.id}`}
                        className="w-full bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-semibold py-2.5 rounded-[10px] transition-all text-center block"
                      >
                        Ver detalle del reporte
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}