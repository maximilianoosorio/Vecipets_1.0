'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';
const token = localStorage.getItem('token');

const res = await fetch('http://localhost:3001/reportes/mis-reportes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
interface ReporteUsuario {
  id: string;
  tipoReporte: 'PERDIDO' | 'ENCONTRADO';
  estado: 'PENDIENTE' | 'PUBLICADO' | 'RESUELTO' | 'RECHAZADO';
  fechaEvento: string;
  descripcion: string;
  mascota: {
    nombre: string;
    especie: string;
    raza: string;
  };
  imagenes: { urlCloudinary: string }[];
}

interface PerfilUsuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  rol: string;
}

export default function PerfilPage() {
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);
  const [reportes, setReportes] = useState<ReporteUsuario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<string | null>(null);

  useEffect(() => {
    // Carga paralela de datos de usuario y sus reportes
    Promise.all([
      fetchAPI<PerfilUsuario>('/auth/me'),
      fetchAPI<ReporteUsuario[]>('/reportes/mis-reportes'),
    ])
      .then(([datosUsuario, misReportes]) => {
        setUsuario(datosUsuario);
        setReportes(misReportes);
      })
      .catch((err) => console.error('Error al cargar perfil:', err))
      .finally(() => setCargando(false));
  }, []);

  const marcarComoResuelto = async (reporteId: string) => {
    if (!confirm('¿Confirmas que la mascota fue recuperada o el caso fue resuelto?')) return;

    setActualizandoId(reporteId);
    try {
      await fetchAPI(`/reportes/${reporteId}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: 'RESUELTO' }),
      });

      // Actualización reactiva en pantalla
      setReportes((prev) =>
        prev.map((rep) => (rep.id === reporteId ? { ...rep, estado: 'RESUELTO' } : rep))
      );
    } catch (err) {
      alert('Error al actualizar el estado del reporte.');
      console.error(err);
    } finally {
      setActualizandoId(null);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Cargando perfil de usuario...
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* CABECERA DE PERFIL */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl font-extrabold shadow-md shadow-indigo-100">
              {usuario?.nombre?.charAt(0) || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {usuario?.nombre} {usuario?.apellido}
              </h1>
              <p className="text-sm text-slate-500">{usuario?.email}</p>
              <span className="inline-block mt-1 text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold uppercase">
                Rol: {usuario?.rol}
              </span>
            </div>
          </div>

          <Link
            href="/reportar"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm"
          >
            + Crear Nuevo Reporte
          </Link>
        </div>

        {/* LISTADO DE MIS REPORTES */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Mis Reportes Creados</h2>

          {reportes.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center space-y-3">
              <span className="text-4xl">🐾</span>
              <p className="text-slate-600 font-medium">Aún no has creado reportes de mascotas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reportes.map((rep) => (
                <div
                  key={rep.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Imagen principal o Placeholder */}
                    <div className="h-44 bg-slate-100 rounded-xl overflow-hidden relative">
                      {rep.imagenes?.[0] ? (
                        <img
                          src={rep.imagenes[0].urlCloudinary}
                          alt={rep.mascota?.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🐶</div>
                      )}
                      
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold uppercase shadow-sm ${
                          rep.tipoReporte === 'PERDIDO'
                            ? 'bg-rose-500 text-white'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        {rep.tipoReporte}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-lg">
                        {rep.mascota?.nombre || 'Sin Nombre'}
                      </h3>
                      
                      {/* Badge de Estado del Caso */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase ${
                          rep.estado === 'PUBLICADO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : rep.estado === 'RESUELTO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {rep.estado}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2">{rep.descripcion}</p>
                  </div>

                  {/* Acciones del Reporte */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      href={`/reportes/${rep.id}`}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Ver Detalle
                    </Link>

                    {rep.estado !== 'RESUELTO' && (
                      <button
                        onClick={() => marcarComoResuelto(rep.id)}
                        disabled={actualizandoId === rep.id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actualizandoId === rep.id ? 'Cerrando...' : '¡Mascota Recuperada! 🏠'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}