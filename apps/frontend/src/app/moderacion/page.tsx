'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Mascota {
  nombre?: string;
  especie?: string;
  raza?: string;
  color?: string;
  tamano?: string;
  sexo?: string;
  caracteristicasEspeciales?: string;
}

interface UsuarioReporte {
  nombre?: string;
  nombre_completo?: string;
  email?: string;
  correo?: string;
  telefono?: string;
}

interface Imagen {
  id?: string;
  urlCloudinary?: string;
  url?: string;
}

interface ReportePendiente {
  id: string;
  tipoReporte?: 'PERDIDO' | 'ENCONTRADO';
  tipo_reporte?: 'PERDIDO' | 'ENCONTRADO';
  descripcion?: string;
  fechaEvento?: string;
  fecha_evento?: string;
  direccion?: string;
  latitud?: number | string;
  longitud?: number | string;
  estado?: string;
  mascota?: Mascota;
  usuario?: UsuarioReporte;
  imagenes?: Imagen[];
  fotos?: Imagen[];
}

export default function ModeracionPage() {
  const router = useRouter();
  const [reportes, setReportes] = useState<ReportePendiente[]>([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [notificacion, setNotificacion] = useState<{ tipo: 'exito' | 'error'; mensaje: string } | null>(null);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    // 🔒 Validación de Rol en el Cliente
    const userStored = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token || !userStored) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userStored);
      const rol = user?.rol?.toUpperCase();
      if (rol !== 'MODERADOR' && rol !== 'ADMINISTRADOR' && rol !== 'ADMIN') {
        router.push('/');
        return;
      }
      setAutorizado(true);
      cargarPendientes();
    } catch {
      router.push('/login');
    }
  }, [router]);

  const cargarPendientes = async () => {
    try {
      setCargando(true);
      const data = await fetchAPI<ReportePendiente[]>('/reportes/pendientes');
      setReportes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Error al cargar reportes pendientes:', err);
      setNotificacion({
        tipo: 'error',
        mensaje: err.message || 'Error al obtener la lista de moderación.',
      });
    } finally {
      setCargando(false);
    }
  };

  const procesarReporte = async (id: string, nuevoEstado: 'PUBLICADO' | 'RECHAZADO') => {
    setProcesandoId(id);
    setNotificacion(null);

    try {
      await fetchAPI(`/reportes/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: nuevoEstado }),
      });

      setReportes((prev) => prev.filter((r) => r.id !== id));
      setNotificacion({
        tipo: 'exito',
        mensaje: `El reporte ha sido ${nuevoEstado === 'PUBLICADO' ? 'aprobado y publicado' : 'rechazado'} correctamente.`,
      });
    } catch (err: any) {
      setNotificacion({
        tipo: 'error',
        mensaje: err.message || 'Error al actualizar el estado del reporte.',
      });
    } finally {
      setProcesandoId(null);
    }
  };

  if (!autorizado || cargando) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex flex-col items-center justify-center text-[#6B7280] gap-3">
        <span className="text-4xl animate-bounce">🛡️</span>
        <p className="text-sm font-semibold">Cargando panel de moderación autorizado...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* ENCABEZADO */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3.5 py-1 rounded-full font-extrabold uppercase tracking-wider mb-2">
              🛡️ Centro de Control y Validación
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              Panel de Moderación
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-xl">
              Valida las evidencias y detalles antes de publicar los avisos en el mapa comunitario de Medellín.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cargarPendientes}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              🔄 Refrescar
            </button>
            <div className="bg-[#2E7D5B]/10 border border-[#2E7D5B]/20 px-4 py-2.5 rounded-xl text-xs font-bold text-[#2E7D5B]">
              Pendientes: <span className="text-sm font-extrabold">{reportes.length}</span>
            </div>
          </div>
        </div>

        {/* NOTIFICACIÓN FLOTANTE */}
        {notificacion && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-semibold border transition-all ${
              notificacion.tipo === 'exito'
                ? 'bg-emerald-50 text-[#2E7D5B] border-emerald-200'
                : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}
          >
            {notificacion.tipo === 'exito' ? '✅' : '⚠️'} {notificacion.mensaje}
          </div>
        )}

        {/* LISTADO DE REPORTES PENDIENTES */}
        {reportes.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-xs space-y-3">
            <span className="text-5xl block">🎉</span>
            <h2 className="text-lg font-bold text-[#1F2937]">¡Bandeja al día!</h2>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              No hay reportes pendientes de revisión. Los avisos validados ya se encuentran visibles para la comunidad.
            </p>
            <Link
              href="/reportes"
              className="inline-block bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all"
            >
              Ver Reportes Públicos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportes.map((item) => {
              const tipo = (item.tipoReporte || item.tipo_reporte || 'PERDIDO').toUpperCase();
              const esPerdido = tipo === 'PERDIDO';
              const listaFotos = item.imagenes || item.fotos || [];
              const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';
              const fecha = item.fechaEvento || item.fecha_evento;
              const nombreUsuario = item.usuario?.nombre || item.usuario?.nombre_completo || 'Ciudadano';
              const correoUsuario = item.usuario?.email || item.usuario?.correo || 'Sin correo';

              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* IMAGEN Y TIPO */}
                    <div className="h-52 bg-slate-100 rounded-2xl overflow-hidden relative flex items-center justify-center">
                      {fotoUrl ? (
                        <img
                          src={fotoUrl}
                          alt="Mascota"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-slate-400">
                          <span className="text-4xl">🐾</span>
                          <span className="text-[10px]">Sin fotografía adjunta</span>
                        </div>
                      )}

                      <span
                        className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase shadow-xs ${
                          esPerdido
                            ? 'bg-rose-600 text-white'
                            : 'bg-[#3B82F6] text-white'
                        }`}
                      >
                        {esPerdido ? '🔴 Perdida' : '🔵 Encontrada'}
                      </span>
                    </div>

                    {/* DATOS DE LA MASCOTA */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold text-[#2E7D5B] bg-[#2E7D5B]/10 px-2.5 py-0.5 rounded-md">
                          📍 {item.direccion || 'Medellín'}
                        </span>
                        <span className="text-[10px] text-[#6B7280]">
                          {fecha ? new Date(fecha).toLocaleDateString('es-CO') : ''}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-[#1F2937]">
                        {item.mascota?.nombre || (esPerdido ? 'Sin Nombre' : 'Mascota Rescatada')}
                      </h3>

                      <p className="text-xs text-[#6B7280]">
                        {item.mascota?.especie || 'Mascota'} • {item.mascota?.raza || 'Mestizo'} • {item.mascota?.color || 'Color variado'}
                      </p>

                      {item.mascota?.caracteristicasEspeciales && (
                        <p className="text-xs text-amber-800 bg-amber-50/80 p-2 rounded-xl border border-amber-200/60 mt-2 font-medium">
                          🔍 <strong>Señas:</strong> {item.mascota.caracteristicasEspeciales}
                        </p>
                      )}

                      <div className="bg-[#F8FAF9] p-3 rounded-2xl border border-slate-100 text-xs text-slate-700 mt-3 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">Descripción:</span>
                        "{item.descripcion || 'Sin descripción detallada'}"
                      </div>
                    </div>

                    {/* DATOS DEL CIUDADANO EMISOR */}
                    <div className="text-[11px] text-[#6B7280] border-t border-slate-100 pt-3 flex flex-col gap-0.5">
                      <span><strong>Ciudadano:</strong> {nombreUsuario}</span>
                      <span><strong>Contacto:</strong> {correoUsuario} {item.usuario?.telefono ? `• Tel: ${item.usuario.telefono}` : ''}</span>
                    </div>

                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        if (confirm('¿Estás seguro de rechazar este reporte?')) {
                          procesarReporte(item.id, 'RECHAZADO');
                        }
                      }}
                      disabled={procesandoId === item.id}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl text-xs transition-colors border border-rose-200 disabled:opacity-50 cursor-pointer"
                    >
                      {procesandoId === item.id ? 'Procesando...' : '✖ Rechazar'}
                    </button>
                    <button
                      onClick={() => procesarReporte(item.id, 'PUBLICADO')}
                      disabled={procesandoId === item.id}
                      className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 cursor-pointer"
                    >
                      {procesandoId === item.id ? 'Publicando...' : '✓ Aprobar y Publicar'}
                    </button>
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