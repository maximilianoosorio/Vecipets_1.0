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
}

interface Imagen {
  id?: string;
  urlCloudinary?: string;
  url?: string;
}

interface Reporte {
  id: string;
  tipoReporte?: 'PERDIDO' | 'ENCONTRADO';
  tipo_reporte?: 'PERDIDO' | 'ENCONTRADO';
  estado?: string;
  descripcion?: string;
  direccion?: string;
  creadoEn?: string;
  creado_en?: string;
  createdAt?: string;
  fechaEvento?: string;
  mascota?: Mascota;
  imagenes?: Imagen[];
  fotos?: Imagen[];
}

interface UsuarioSesion {
  id?: string;
  nombre?: string;
  nombre_completo?: string;
  email?: string;
  correo?: string;
  rol?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Verificación segura en cliente
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const userStored = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;

    if (!token) {
      router.push('/login');
      return;
    }

    if (userStored) {
      try {
        setUsuario(JSON.parse(userStored));
      } catch (e) {
        console.error('Error parseando usuario:', e);
      }
    }

    // 2. Consumo seguro de la API
    fetchAPI<Reporte[]>('/reportes/mis-reportes')
      .then((data) => {
        setReportes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error al cargar perfil:', err);
        setError('No se pudieron cargar tus reportes. Intenta de nuevo.');
      })
      .finally(() => {
        setCargando(false);
      });
  }, [router]);

  const nombreUsuario =
    usuario?.nombre ||
    usuario?.nombre_completo ||
    'Ciudadano VeciPets';

  const correoUsuario =
    usuario?.email ||
    usuario?.correo ||
    'correo@vecipets.com';

  return (
    <main className="bg-[#F8FAF9] min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* TARJETA RESUMEN DEL USUARIO */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#2E7D5B]/10 border border-[#2E7D5B]/20 flex items-center justify-center text-2xl font-bold text-[#2E7D5B]">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
                  {nombreUsuario}
                </h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#2E7D5B]/10 text-[#2E7D5B] border border-[#2E7D5B]/20">
                  {usuario?.rol || 'CIUDADANO'}
                </span>
              </div>
              <p className="text-xs text-[#6B7280] mt-0.5">{correoUsuario}</p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Link
              href="/reportes/nuevo"
              className="flex-1 md:flex-initial text-center bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <span>➕</span> Nuevo Reporte
            </Link>
          </div>
        </div>

        {/* ESTADOS DE CARGA Y ERROR */}
        {cargando && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs animate-pulse p-4 space-y-3"
              >
                <div className="h-44 bg-slate-200 rounded-2xl" />
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-200 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-2xl text-center">
            ⚠️ {error}
          </div>
        )}

        {/* LISTADO DE MIS REPORTES */}
        {!cargando && !error && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-bold text-[#1F2937]">
                Mis Mascotas Reportadas ({reportes.length})
              </h2>
              <span className="text-xs text-[#6B7280]">Medellín, Antioquia</span>
            </div>

            {reportes.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-lg mx-auto shadow-xs">
                <span className="text-5xl block">🐾</span>
                <h3 className="text-base font-bold text-[#1F2937]">Aún no tienes reportes activos</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  Si perdiste o encontraste una mascota, crea un reporte para que la red comunitaria y los refugios de Medellín puedan ayudarte.
                </p>
                <Link
                  href="/reportes/nuevo"
                  className="inline-block bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
                >
                  Crear mi primer reporte
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportes.map((item) => {
                  const tipo = (item.tipoReporte || item.tipo_reporte || 'PERDIDO').toUpperCase();
                  const esPerdido = tipo === 'PERDIDO';
                  const listaFotos = item.imagenes || item.fotos || [];
                  const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';
                  const fecha = item.creadoEn || item.creado_en || item.createdAt || item.fechaEvento;

                  const estado = item.estado || 'PENDIENTE_APROBACION';
                  const esAprobado = estado === 'PUBLICADO' || estado === 'ACTIVO';

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* FOTOGRAFÍA CON BADGES */}
                        <div className="h-48 bg-slate-100 overflow-hidden relative flex items-center justify-center">
                          {fotoUrl ? (
                            <img
                              src={fotoUrl}
                              alt="Foto mascota"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1 text-slate-400">
                              <span className="text-4xl">🐾</span>
                              <span className="text-[10px]">Sin foto</span>
                            </div>
                          )}

                          {/* BADGE TIPO */}
                          <span
                            className={`absolute top-3 right-3 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase shadow-xs ${
                              esPerdido
                                ? 'bg-rose-600 text-white'
                                : 'bg-[#3B82F6] text-white'
                            }`}
                          >
                            {esPerdido ? '🔴 Perdida' : '🔵 Encontrada'}
                          </span>

                          {/* BADGE ESTADO DE MODERACIÓN */}
                          <span
                            className={`absolute bottom-3 left-3 text-[9px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs ${
                              esAprobado
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}
                          >
                            {esAprobado ? '✓ Publicado en Mapa' : '⏳ En Moderación'}
                          </span>
                        </div>

                        {/* CUERPO DEL REPORTE */}
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center text-[10px] text-[#6B7280]">
                            <span className="truncate max-w-[150px]">
                              📍 {item.direccion || 'Medellín'}
                            </span>
                            <span>{fecha ? new Date(fecha).toLocaleDateString('es-CO') : ''}</span>
                          </div>

                          <h3 className="font-bold text-slate-900 text-base truncate">
                            {item.mascota?.nombre || (esPerdido ? 'Sin Nombre' : 'Mascota Rescatada')}
                          </h3>

                          <p className="text-xs text-[#6B7280]">
                            {item.mascota?.especie || 'Mascota'} • {item.mascota?.raza || 'Mestizo'}
                          </p>

                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-[#F8FAF9] p-3 rounded-2xl border border-slate-100">
                            "{item.descripcion || 'Sin descripción adicional.'}"
                          </p>
                        </div>
                      </div>

                      {/* BOTÓN AL DETALLE */}
                      <div className="p-5 pt-0">
                        <Link
                          href={`/reportes/${item.id}`}
                          className="w-full text-center bg-slate-50 hover:bg-[#2E7D5B] hover:text-white border border-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-all block shadow-2xs"
                        >
                          Ver Expediente Completo →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}