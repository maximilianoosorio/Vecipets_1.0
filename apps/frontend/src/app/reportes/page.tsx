'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Imagen {
  id: string;
  urlCloudinary: string;
}

interface Mascota {
  nombre: string;
  especie: string;
  raza?: string;
  color: string;
  tamano: string;
}

interface Reporte {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO';
  descripcion: string;
  fechaEvento: string;
  mascota: Mascota;
  imagenes: Imagen[];
}

export default function ReportesPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAPI<Reporte[]>('/reportes/publicos')
      .then((data) => setReportes(data))
      .catch((err) => setError(err.message || 'Error al cargar los reportes'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mascotas Reportadas</h1>
          <p className="text-slate-400 mt-1">
            Revisa las mascotas perdidas y encontradas en la comunidad.
          </p>
        </div>
        <Link
          href="/reportes/nuevo"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-950"
        >
          + Crear Reporte
        </Link>
      </div>

      {cargando && (
        <div className="text-center py-12 text-slate-400">Cargando reportes...</div>
      )}

      {error && (
        <div className="bg-rose-950/50 border border-rose-500 text-rose-300 p-4 rounded-xl text-center">
          {error}
        </div>
      )}

      {!cargando && !error && reportes.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No hay reportes públicos registrados actualmente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportes.map((reporte) => (
          <div
            key={reporte.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all flex flex-col"
          >
            <div className="relative h-48 bg-slate-950 flex items-center justify-center">
              {reporte.imagenes && reporte.imagenes.length > 0 ? (
                <img
                  src={reporte.imagenes[0].urlCloudinary}
                  alt={reporte.mascota.nombre || 'Mascota'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl">🐾</span>
              )}
              <span
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold ${
                  reporte.tipoReporte === 'PERDIDO'
                    ? 'bg-rose-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {reporte.tipoReporte}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {reporte.mascota.nombre || 'Sin nombre'}
                </h3>
                <p className="text-slate-300 text-sm line-clamp-2 mb-4">
                  {reporte.descripcion}
                </p>
                <div className="text-xs text-slate-400 space-y-1">
                  <p>
                    <strong>Especie:</strong> {reporte.mascota.especie} |{' '}
                    <strong>Color:</strong> {reporte.mascota.color}
                  </p>
                  <p>
                    <strong>Tamaño:</strong> {reporte.mascota.tamano}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                <span>Fecha: {new Date(reporte.fechaEvento).toLocaleDateString()}</span>
                <Link
                  href={`/reportes/${reporte.id}`}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                  Ver Detalle →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}