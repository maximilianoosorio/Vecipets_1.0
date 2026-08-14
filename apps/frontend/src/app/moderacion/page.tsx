'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api-client';

interface ReportePendiente {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO';
  descripcion: string;
  fechaEvento: string;
  mascota: {
    nombre: string;
    especie: string;
    raza?: string;
    color: string;
  };
  usuario: {
    nombre: string;
    email: string;
  };
  imagenes: { urlCloudinary: string }[];
}

export default function ModeracionPage() {
  const [reportes, setReportes] = useState<ReportePendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    try {
      const data = await fetchAPI<ReportePendiente[]>('/reportes/pendientes');
      setReportes(data);
    } catch (err) {
      console.error('Error al cargar reportes pendientes:', err);
    } finally {
      setCargando(false);
    }
  };

  const procesarReporte = async (id: string, nuevoEstado: 'PUBLICADO' | 'RECHAZADO') => {
    setProcesandoId(id);
    try {
      await fetchAPI(`/reportes/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      // Filtramos el reporte aprobado/rechazado de la lista en pantalla
      setReportes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      alert('Error al actualizar el estado del reporte.');
      console.error(err);
    } finally {
      setProcesandoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Cargando panel de moderación...
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full font-bold mb-2">
              🛡️ Zona Privada de Administración
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Panel de Moderación</h1>
            <p className="text-sm text-slate-500 mt-1">
              Revisa y valida los avisos antes de hacerlos visibles en el mapa de Medellín.
            </p>
          </div>

          <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700">
            Pendientes por revisar: <span className="text-indigo-600 text-sm">{reportes.length}</span>
          </div>
        </div>

        {/* LISTADO DE PENDIENTES */}
        {reportes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-sm space-y-2">
            <span className="text-4xl block">🎉</span>
            <p className="font-bold text-slate-800">¡Todo al día!</p>
            <p className="text-xs text-slate-500">No hay reportes pendientes de aprobación en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportes.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Imagen y Tipo */}
                  <div className="h-48 bg-slate-100 rounded-xl overflow-hidden relative">
                    {item.imagenes?.[0] ? (
                      <img
                        src={item.imagenes[0].urlCloudinary}
                        alt="Mascota"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🐾</div>
                    )}

                    <span
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-sm ${
                        item.tipoReporte === 'PERDIDO'
                          ? 'bg-rose-500 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {item.tipoReporte}
                    </span>
                  </div>

                  {/* Detalle Mascota y Usuario */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.mascota?.nombre || 'Sin nombre'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {item.mascota?.especie} • {item.mascota?.color}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{item.descripcion}"
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                    <span>Reportado por: <strong>{item.usuario?.nombre}</strong> ({item.usuario?.email})</span>
                  </div>
                </div>

                {/* BOTONES DE ACCIÓN */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => procesarReporte(item.id, 'RECHAZADO')}
                    disabled={procesandoId === item.id}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-2.5 rounded-xl text-xs transition-colors border border-rose-200 disabled:opacity-50"
                  >
                    ✖ Rechazar
                  </button>
                  <button
                    onClick={() => procesarReporte(item.id, 'PUBLICADO')}
                    disabled={procesandoId === item.id}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
                  >
                    ✓ Aprobar y Publicar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}