'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Imagen {
  id?: string;
  urlCloudinary?: string;
  url_cloudinary?: string;
  url?: string;
}

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
  tamano?: string;
  sexo?: string;
  fotoUrl?: string;
  foto_url?: string;
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
  fotoPrincipal?: string;
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

  // Helper para resolver la URL de imagen de manera 100% segura
  const obtenerUrlImagen = (reporte: Reporte): string | null => {
    if (reporte.fotoPrincipal) return reporte.fotoPrincipal;
    
    const lista = reporte.imagenes || reporte.fotos || [];
    if (lista.length > 0) {
      const primera = lista[0];
      const url = primera.urlCloudinary || primera.url_cloudinary || primera.url;
      if (url && typeof url === 'string' && url.trim() !== '') {
        return url.trim();
      }
    }

    if (reporte.mascota?.fotoUrl) return reporte.mascota.fotoUrl;
    if (reporte.mascota?.foto_url) return reporte.mascota.foto_url;

    return null;
  };

  return (
    <main className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#292A2F] font-sans">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* ENCABEZADO Y ACCIONES */}
        <div className="bg-[#EEF2FC] border border-slate-100 p-6 sm:p-8 rounded-[24px] shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-white text-[#5E7BC4] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-2xs">
              📋 Directorio de Casos
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
              Mascotas Reportadas
            </h1>
            <p className="text-xs sm:text-sm text-[#53627A] mt-1 max-w-xl">
              Explora los reportes de mascotas perdidas y encontradas para facilitar su búsqueda y recuperación.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link
              href="/mapa"
              className="flex-1 md:flex-initial text-center bg-white border border-[#5E7BC4] text-[#5E7BC4] hover:bg-[#EEF2FC] font-semibold px-5 py-2.5 rounded-full text-xs sm:text-sm transition-all"
            >
              🗺️ Ver en Mapa
            </Link>
            <Link
              href="/reportar"
              className="flex-1 md:flex-initial text-center bg-[#F3B26C] hover:bg-[#e29e54] text-white font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Publicar Reporte
            </Link>
          </div>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="bg-white border border-slate-100 p-4 sm:p-5 rounded-[24px] shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            
            {/* Buscador */}
            <div className="sm:col-span-1 lg:col-span-2">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre, sector o raza..."
                className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white transition-colors"
              />
            </div>

            {/* Filtro por Tipo */}
            <div>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full bg-[#EEF2FC] border border-slate-200 text-xs font-semibold text-[#292A2F] rounded-full px-4 py-2.5 focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
              >
                <option value="TODOS">Todos los casos</option>
                <option value="PERDIDO">🔵 Mascotas Perdidas</option>
                <option value="ENCONTRADO">🟢 Mascotas Encontradas</option>
              </select>
            </div>

            {/* Filtro por Especie */}
            <div>
              <select
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value)}
                className="w-full bg-[#EEF2FC] border border-slate-200 text-xs font-semibold text-[#292A2F] rounded-full px-4 py-2.5 focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
              >
                <option value="TODOS">Todas las especies</option>
                <option value="PERRO">Perros</option>
                <option value="GATO">Gatos</option>
                <option value="OTRO">Otros</option>
              </select>
            </div>

          </div>

          <div className="flex justify-between items-center text-xs pt-3 border-t border-slate-100 text-[#53627A]">
            <span>
              Mostrando <strong className="text-[#292A2F] font-bold">{reportesFiltrados.length}</strong> reporte(s)
            </span>
            {(filtroTipo !== 'TODOS' || filtroEspecie !== 'TODOS' || busqueda !== '') && (
              <button
                onClick={() => {
                  setFiltroTipo('TODOS');
                  setFiltroEspecie('TODOS');
                  setBusqueda('');
                }}
                className="text-[#5E7BC4] font-semibold hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* MENSAJES DE ERROR */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-2xl text-center">
            ⚠️ {error}
          </div>
        )}

        {/* SKELETON LOADERS */}
        {cargando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-xs animate-pulse flex flex-col"
              >
                <div className="h-48 bg-[#EEF2FC]" />
                <div className="p-5 space-y-3 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-md w-1/2" />
                  <div className="h-10 bg-[#EEF2FC] rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ESTADO VACÍO */}
        {!cargando && !error && reportesFiltrados.length === 0 && (
          <div className="bg-white border border-slate-100 rounded-[24px] p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
            <span className="text-4xl block">🐾</span>
            <h3 className="text-base font-bold text-[#292A2F]">No se encontraron reportes</h3>
            <p className="text-xs text-[#53627A] leading-relaxed">
              No hay casos que coincidan con los filtros seleccionados actualmente.
            </p>
            <button
              onClick={() => {
                setFiltroTipo('TODOS');
                setFiltroEspecie('TODOS');
                setBusqueda('');
              }}
              className="bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-xs"
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
              const fotoUrl = obtenerUrlImagen(reporte);
              const fecha = reporte.fechaEvento || reporte.fecha_evento;

              return (
                <div
                  key={reporte.id}
                  className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-xs hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* IMAGEN CON BADGE */}
                    <div className="relative h-48 bg-[#EEF2FC] overflow-hidden flex items-center justify-center">
                      {fotoUrl ? (
                        <img
                          src={fotoUrl}
                          alt={reporte.mascota?.nombre || 'Mascota'}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Si la URL falla, muestra el recuadro por defecto
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <span className="text-3xl">🐾</span>
                          <span className="text-[10px]">Sin foto disponible</span>
                        </div>
                      )}

                      <span
                        className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs ${
                          esPerdido
                            ? 'bg-[#5E7BC4]/15 text-[#5E7BC4]'
                            : 'bg-[#16A34A]/15 text-[#16A34A]'
                        }`}
                      >
                        {esPerdido ? '🐾 Mascota Perdida' : '🐾 Mascota Encontrada'}
                      </span>
                    </div>

                    {/* CUERPO DE LA TARJETA */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-medium text-[#5E7BC4] bg-[#EEF2FC] px-2.5 py-0.5 rounded-full truncate max-w-[160px]">
                          📍 {reporte.direccion || 'Medellín'}
                        </span>
                        <span className="text-[10px] text-[#53627A]">
                          {fecha ? new Date(fecha).toLocaleDateString() : 'Reciente'}
                        </span>
                      </div>

                      <h2 className="text-base font-bold text-[#292A2F] truncate">
                        {reporte.mascota?.nombre || (esPerdido ? 'Mascota sin nombre' : 'Mascota rescatada')}
                      </h2>

                      <p className="text-xs text-[#53627A] line-clamp-2 leading-relaxed">
                        {reporte.descripcion || 'Sin descripción detallada.'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 bg-[#EEF2FC]/50 p-3 rounded-[16px] border border-slate-100 text-[11px]">
                        <div>
                          <span className="text-[#53627A] block text-[9px] uppercase font-semibold">Especie</span>
                          <span className="font-semibold text-[#292A2F] truncate block">
                            {reporte.mascota?.especie || 'No especificada'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#53627A] block text-[9px] uppercase font-semibold">Raza</span>
                          <span className="font-semibold text-[#292A2F] truncate block">
                            {reporte.mascota?.raza || 'Mestizo'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#53627A] block text-[9px] uppercase font-semibold">Color</span>
                          <span className="font-semibold text-[#292A2F] truncate block">
                            {reporte.mascota?.color || 'No especificado'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#53627A] block text-[9px] uppercase font-semibold">Tamaño</span>
                          <span className="font-semibold text-[#292A2F] truncate block">
                            {reporte.mascota?.tamano || 'Mediano'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      href={`/reportes/${reporte.id}`}
                      className="w-full bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs font-semibold py-2.5 rounded-full transition-all text-center block shadow-2xs"
                    >
                      Ver detalle del reporte
                    </Link>
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