'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchAPI } from '@/lib/api-client';

const MapaComponent = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-xs text-[#6B7280]">
        Cargando mapa de ubicación...
      </div>
    ),
  }
);

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
  tamano?: string;
  sexo?: string;
  caracteristicasEspeciales?: string;
}

interface Imagen {
  id: string;
  urlCloudinary: string;
}

interface ReporteDetalle {
  id: string;
  tipoReporte?: 'PERDIDO' | 'ENCONTRADO';
  tipo_reporte?: 'PERDIDO' | 'ENCONTRADO';
  estado?: string;
  descripcion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  direccion?: string;
  latitud?: number | string;
  longitud?: number | string;
  mascota?: Mascota;
  imagenes?: Imagen[];
  fotos?: Imagen[];
}

export default function DetalleReportePage() {
  const params = useParams();
  const router = useRouter();
  const [reporte, setReporte] = useState<ReporteDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string>('');
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const id = params?.id;
    if (id) {
      fetchAPI<ReporteDetalle>(`/reportes/${id}`)
        .then((data) => {
          setReporte(data);
          const imagenesList = data.imagenes || data.fotos || [];
          if (imagenesList.length > 0) {
            setFotoSeleccionada(imagenesList[0].urlCloudinary);
          }
        })
        .catch((err) => console.error('Error al cargar detalle:', err))
        .finally(() => setCargando(false));
    }
  }, [params?.id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center text-[#6B7280] gap-3">
        <span className="text-4xl animate-bounce">🐾</span>
        <p className="text-sm font-semibold">Cargando expediente de la mascota...</p>
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] py-20 px-6 text-center flex flex-col items-center justify-center">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm max-w-md w-full">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-[#1F2937] mt-3">Reporte no encontrado</h2>
          <p className="text-xs text-[#6B7280] mt-1 mb-6">
            El caso que buscas no existe o fue resuelto.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const tipo = reporte.tipoReporte || reporte.tipo_reporte || 'PERDIDO';
  const esPerdido = tipo === 'PERDIDO';
  const imagenes = reporte.imagenes || reporte.fotos || [];
  const fecha = reporte.fechaEvento || reporte.fecha_evento;
  const lat = Number(reporte.latitud) || 6.2442;
  const lng = Number(reporte.longitud) || -75.5812;

  // Objeto estructurado para alimentar el mapa
  const reporteParaMapa = {
    ...reporte,
    latitud: lat,
    longitud: lng,
    tipoReporte: tipo,
  };

  return (
    <main className="bg-[#F8FAF9] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Botón Volver */}
        <button
          onClick={() => router.back()}
          className="text-xs font-bold text-[#2E7D5B] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          ← Volver al listado
        </button>

        {/* Contenedor Principal (Grid Responsivo) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* COLUMNA IZQUIERDA: FOTOGRAFÍAS */}
          <div className="space-y-4">
            <div className="w-full h-80 sm:h-96 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center relative">
              {fotoSeleccionada ? (
                <img
                  src={fotoSeleccionada}
                  alt={reporte.mascota?.nombre || 'Mascota'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <span className="text-6xl">🐾</span>
                  <span className="text-xs">Sin imagen disponible</span>
                </div>
              )}
            </div>

            {/* Mosaico de Miniaturas */}
            {imagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {imagenes.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setFotoSeleccionada(img.urlCloudinary)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      fotoSeleccionada === img.urlCloudinary
                        ? 'border-[#2E7D5B] shadow-md ring-2 ring-[#2E7D5B]/20'
                        : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.urlCloudinary}
                      alt="Miniatura"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: FICHA DEL REPORTE */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                    esPerdido
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}
                >
                  {esPerdido ? '🔴 Mascota Perdida' : '🔵 Mascota Encontrada'}
                </span>
                <span className="text-xs text-[#6B7280] font-medium">
                  {fecha ? new Date(fecha).toLocaleDateString('es-CO') : 'Reciente'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                {reporte.mascota?.nombre || (esPerdido ? 'Sin Nombre Registrado' : 'Mascota Rescatada')}
              </h1>

              {/* Ficha Técnica */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F8FAF9] p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Especie</span>
                  <strong className="text-slate-800">{reporte.mascota?.especie || 'No especificada'}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Raza</span>
                  <strong className="text-slate-800">{reporte.mascota?.raza || 'Mestizo'}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Color</span>
                  <strong className="text-slate-800">{reporte.mascota?.color || 'No especificado'}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Tamaño</span>
                  <strong className="text-slate-800">{reporte.mascota?.tamano || 'Mediano'}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Sexo</span>
                  <strong className="text-slate-800">{reporte.mascota?.sexo || 'Desconocido'}</strong>
                </div>
                <div>
                  <span className="text-[#6B7280] block text-[10px] uppercase font-bold">Sector</span>
                  <strong className="text-slate-800 truncate block">{reporte.direccion || 'Medellín'}</strong>
                </div>
              </div>

              {/* Señas Particulares */}
              {reporte.mascota?.caracteristicasEspeciales && (
                <div className="bg-amber-50/70 border border-amber-200/70 p-3.5 rounded-2xl">
                  <h3 className="text-xs font-bold text-amber-900 mb-0.5">🔍 Señas Particulares:</h3>
                  <p className="text-xs text-amber-800">{reporte.mascota.caracteristicasEspeciales}</p>
                </div>
              )}

              {/* Descripción */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Descripción del suceso:
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {reporte.descripcion || 'Sin descripción detallada.'}
                </p>
              </div>
            </div>

            {/* CTA SEGURO DE CONTACTO (Regla VeciPets) */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <div className="bg-[#2E7D5B]/10 border border-[#2E7D5B]/20 p-3.5 rounded-2xl text-xs text-[#2E7D5B]">
                🛡️ <strong>Canalización Segura:</strong> Las reclamaciones se procesan a través de refugios y moderadores autorizados de Medellín para proteger a los animales y evitar fraudes.
              </div>
              <button
                onClick={() => setModalAbierto(true)}
                className="w-full bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-center text-sm cursor-pointer"
              >
                📢 Iniciar Validación de Propiedad / Contactar Refugio
              </button>
            </div>

          </div>

        </div>

        {/* MAPA DEL PUNTO GEOLOCALIZADO */}
        <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#1F2937]">📍 Punto de Avistamiento Registrado</h3>
              <p className="text-xs text-[#6B7280]">Ubicación geolocalizada en Medellín</p>
            </div>
            <span className="text-xs font-semibold text-[#2E7D5B] bg-[#2E7D5B]/10 px-3 py-1 rounded-full">
              {reporte.direccion || 'Medellín, Antioquia'}
            </span>
          </div>
          <div className="w-full h-72 rounded-2xl overflow-hidden border border-slate-100">
            <MapaComponent reportes={[reporteParaMapa]} />
          </div>
        </div>

      </div>

      {/* MODAL DE CONTACTO / MODERACIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-4 text-center">
            <span className="text-4xl">🐾</span>
            <h3 className="text-lg font-bold text-[#1F2937]">Validación de Propiedad</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Para reclamar esta mascota o aportar información clave, comunícate con el equipo de moderación indicando el identificador del caso:
            </p>
            <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-slate-200 text-left space-y-1.5 text-xs text-slate-700">
              <p><strong>ID Expediente:</strong> <span className="font-mono text-slate-500">{reporte.id}</span></p>
              <p><strong>Mascota:</strong> {reporte.mascota?.nombre || 'No registrado'}</p>
              <p><strong>Correo Oficial:</strong> soporte@vecipets.medellin.gov.co</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalAbierto(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>
              <Link
                href="/refugios"
                className="flex-1 bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center"
              >
                Ver Refugios Aliados
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}