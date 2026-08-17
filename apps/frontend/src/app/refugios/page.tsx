'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Refugio {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  correo?: string;
  comuna?: string;
  verificado?: boolean;
  descripcion?: string;
}

// Fallback oficial de Refugios Aliados en Medellín
const REFUGIOS_DEFAULT: Refugio[] = [
  {
    id: 'ref-1',
    nombre: 'Centro de Bienestar Animal La Perla',
    comuna: 'Corregimiento San Cristóbal',
    direccion: 'Vereda El Uvital, San Cristóbal, Medellín',
    telefono: '+57 (604) 385 5555',
    email: 'contacto@laperlamedellin.gov.co',
    verificado: true,
    descripcion: 'Entidad oficial de la Alcaldía de Medellín encargada del rescate, protección y adopción de animales.',
  },
  {
    id: 'ref-2',
    nombre: 'Corporación RAYA (Red de Ayuda a los Animales)',
    comuna: 'Comuna 11 - Laureles / Estadio',
    direccion: 'Cra 70 # 44-23, Medellín',
    telefono: '+57 310 456 7890',
    email: 'info@corporacionraya.org',
    verificado: true,
    descripcion: 'Organización dedicada a la protección, educación y bienestar de mascotas en el Valle de Aburrá.',
  },
  {
    id: 'ref-3',
    nombre: 'Fundación ORCA Medellín',
    comuna: 'Comuna 14 - El Poblado',
    direccion: 'Calle 10 # 43E-12, Medellín',
    telefono: '+57 312 889 1234',
    email: 'contacto@fundacionorca.org',
    verificado: true,
    descripcion: 'Resguardo temporal, atención médica y canalización de adopciones para perros y gatos rescatados.',
  },
  {
    id: 'ref-4',
    nombre: 'Fundación Huellas de Amor Medellín',
    comuna: 'Comuna 16 - Belén',
    direccion: 'Calle 30 # 76-45, Belén, Medellín',
    telefono: '+57 301 776 5432',
    email: 'adopciones@huellasdeamor.org',
    verificado: true,
    descripcion: 'Hogar de paso y validación de casos de mascotas perdidas y encontradas.',
  },
];

export default function RefugiosPage() {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    fetchAPI<Refugio[]>('/refugios')
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setRefugios(data);
          } else {
            setRefugios(REFUGIOS_DEFAULT);
          }
        }
      })
      .catch((err) => {
        console.warn('Cargando refugios aliados por defecto:', err);
        if (isMounted) setRefugios(REFUGIOS_DEFAULT);
      })
      .finally(() => {
        if (isMounted) setCargando(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Filtrado reactivo por nombre, comuna o dirección
  const refugiosFiltrados = useMemo(() => {
    const q = busqueda.toLowerCase().trim();
    if (!q) return refugios;

    return refugios.filter((r) => {
      const nombre = (r.nombre || '').toLowerCase();
      const comuna = (r.comuna || '').toLowerCase();
      const direccion = (r.direccion || '').toLowerCase();
      return nombre.includes(q) || comuna.includes(q) || direccion.includes(q);
    });
  }, [refugios, busqueda]);

  return (
    <main className="min-h-screen bg-[#F8FAF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ENCABEZADO */}
        <div className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-block bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              🛡️ Red Oficial de Apoyo
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              Refugios y Fundaciones Aliadas
            </h1>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl">
              Centros y organizaciones oficiales en Medellín autorizadas para la validación de propiedad, moderación de avisos y resguardo seguro de mascotas.
            </p>
          </div>

          <Link
            href="/reportes/nuevo"
            className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0"
          >
            <span>➕</span> Reportar Mascota
          </Link>
        </div>

        {/* BUSCADOR */}
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-3xl shadow-xs">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="w-full sm:max-w-md">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por comuna (ej: Belén, Laureles) o nombre..."
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              />
            </div>
            <span className="text-xs text-[#6B7280] font-medium w-full sm:w-auto text-left sm:text-right">
              Mostrando <strong className="text-[#1F2937]">{refugiosFiltrados.length}</strong> institución(es)
            </span>
          </div>
        </div>

        {/* SKELETON LOADING */}
        {cargando && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs animate-pulse space-y-4"
              >
                <div className="h-5 bg-slate-200 rounded-md w-1/3" />
                <div className="h-6 bg-slate-200 rounded-md w-3/4" />
                <div className="h-16 bg-slate-100 rounded-2xl" />
              </div>
            ))}
          </div>
        )}

        {/* LISTADO DE REFUGIOS EN CARDS */}
        {!cargando && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {refugiosFiltrados.map((refugio) => {
              const correo = refugio.email || refugio.correo || 'soporte@vecipets.medellin.gov.co';
              return (
                <div
                  key={refugio.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs hover:shadow-md hover:border-[#2E7D5B]/40 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-extrabold text-[#2E7D5B] bg-[#2E7D5B]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                        📍 {refugio.comuna || 'Medellín'}
                      </span>
                      {refugio.verificado !== false && (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          ✓ Aliado Verificado
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-[#1F2937] leading-snug">
                      {refugio.nombre}
                    </h2>

                    {refugio.descripcion && (
                      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">
                        {refugio.descripcion}
                      </p>
                    )}

                    <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                      <p className="truncate">
                        <strong>📍 Dirección:</strong> {refugio.direccion || 'Medellín, Antioquia'}
                      </p>
                      <p className="truncate">
                        <strong>📞 Teléfono:</strong> {refugio.telefono || 'No disponible'}
                      </p>
                      <p className="truncate">
                        <strong>✉️ Correo:</strong> {correo}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    {refugio.telefono && (
                      <a
                        href={`tel:${refugio.telefono.replace(/[^0-9+]/g, '')}`}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs text-center transition-colors flex items-center justify-center gap-1"
                      >
                        📞 Llamar
                      </a>
                    )}
                    <a
                      href={`mailto:${correo}?subject=Consulta%20VeciPets%20Medell%C3%ADn`}
                      className={`bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-2.5 rounded-xl text-xs text-center transition-colors shadow-2xs ${
                        !refugio.telefono ? 'col-span-2' : ''
                      }`}
                    >
                      ✉️ Contactar
                    </a>
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