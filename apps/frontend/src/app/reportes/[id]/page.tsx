'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchAPI } from '@/lib/api-client';

const MapaComponent = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet'),
  { ssr: false }
);

interface ReporteDetalle {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO';
  estado: string;
  descripcion: string;
  fechaEvento: string;
  mascota: {
    nombre: string;
    especie: string;
    raza: string;
    color: string;
    tamano: string;
    sexo: string;
  };
  imagenes: { id: string; urlCloudinary: string }[];
  ubicacion?: {
    latitud: number;
    longitud: number;
  };
  usuario: {
    nombre: string;
    apellido: string;
  };
}

export default function DetalleReportePage() {
  const params = useParams();
  const router = useRouter();
  const [reporte, setReporte] = useState<ReporteDetalle | null>(null);
  const [cargando, setCargando] = useState(true);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string>('');

  useEffect(() => {
    if (params?.id) {
      fetchAPI<ReporteDetalle>(`/reportes/${params.id}`)
        .then((data) => {
          setReporte(data);
          if (data.imagenes?.[0]) {
            setFotoSeleccionada(data.imagenes[0].urlCloudinary);
          }
        })
        .catch((err) => console.error('Error al cargar detalle:', err))
        .finally(() => setCargando(false));
    }
  }, [params?.id]);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Cargando expediente de la mascota...
      </div>
    );
  }

  if (!reporte) {
    return (
      <div className="min-h-screen bg-slate-50 py-20 px-6 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Reporte no encontrado</h2>
        <Link href="/" className="mt-4 inline-block text-indigo-600 font-bold hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Botón Volver */}
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          ← Volver al listado
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* GALERÍA DE FOTOS */}
          <div className="space-y-4">
            <div className="h-80 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
              {fotoSeleccionada ? (
                <img
                  src={fotoSeleccionada}
                  alt={reporte.mascota?.nombre || 'Mascota'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl">🐾</span>
              )}
            </div>

            {/* Mosaico de Miniaturas */}
            {reporte.imagenes && reporte.imagenes.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {reporte.imagenes.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setFotoSeleccionada(img.urlCloudinary)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${fotoSeleccionada === img.urlCloudinary
                        ? 'border-indigo-600 shadow-md scale-95'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                  >
                    <img src={img.urlCloudinary} alt="Miniatura" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMACIÓN DEL CASO */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${reporte.tipoReporte === 'PERDIDO'
                      ? 'bg-rose-100 text-rose-700 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                >
                  {reporte.tipoReporte}
                </span>
                <span className="text-xs text-slate-400">
                  Fecha: {new Date(reporte.fechaEvento).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl font-extrabold text-slate-900 mt-3">
                {reporte.mascota?.nombre || 'Sin Nombre Asignado'}
              </h1>

              {/* Ficha Técnica */}
              <div className="grid grid-cols-2 gap-4 mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Especie</span>
                  <strong className="text-slate-700">{reporte.mascota?.especie}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Color</span>
                  <strong className="text-slate-700">{reporte.mascota?.color}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Tamaño</span>
                  <strong className="text-slate-700">{reporte.mascota?.tamano || 'No especificado'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-xs block">Sexo</span>
                  <strong className="text-slate-700">{reporte.mascota?.sexo || 'No especificado'}</strong>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-800 mb-1">Descripción del suceso:</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{reporte.descripcion}</p>
              </div>
            </div>

            {/* CTA SEGURO DE CONTACTO */}
            <div className="pt-6 border-t border-slate-100">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 mb-4">
                🔒 <strong>Atención Segura:</strong> Las reclamaciones se procesan mediante moderadores y refugios autorizados para prevenir fraude.
              </div>
              <button
                onClick={() => alert('Solicitud de validación enviada al centro de atención autorizado.')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 text-center text-sm"
              >
                Iniciar Validación de Propiedad / Contacto Refugio
              </button>
            </div>

          </div>

        </div>

        {/* MAPA DEL PUNTO ESPECÍFICO */}
        {reporte.ubicacion && (
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2">📍 Punto de Avistamiento Registrado</h3>
            <p className="text-xs text-slate-500 mb-4">Coordenadas del evento en Medellín</p>
            <MapaComponent reportes={[reporte]} />
          </div>
        )}

      </div>
    </main>
  );
}