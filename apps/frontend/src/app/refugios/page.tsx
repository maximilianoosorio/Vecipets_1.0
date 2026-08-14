'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api-client';

interface Refugio {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  comuna: string;
  verificado: boolean;
}

export default function RefugiosPage() {
  const [refugios, setRefugios] = useState<Refugio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetchAPI<Refugio[]>('/refugios')
      .then((data) => setRefugios(data))
      .catch((err) => console.error('Error al cargar refugios:', err))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-medium">
        Cargando refugios autorizados...
      </div>
    );
  }

  return (
    <main className="bg-slate-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Refugios y Fundaciones Aliadas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Organizaciones oficializadas en Medellín encargadas de la validación de propiedad y resguardo temporal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {refugios.map((refugio) => (
            <div
              key={refugio.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase">
                    {refugio.comuna || 'Medellín'}
                  </span>
                  {refugio.verificado && (
                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ Verificado
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900">{refugio.nombre}</h2>

                <div className="space-y-1 text-xs text-slate-600 pt-2">
                  <p>📍 <strong>Dirección:</strong> {refugio.direccion}</p>
                  <p>📞 <strong>Teléfono:</strong> {refugio.telefono}</p>
                  <p>✉️ <strong>Contacto:</strong> {refugio.email}</p>
                </div>
              </div>

              <a
                href={`mailto:${refugio.email}`}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs text-center transition-colors block"
              >
                Contactar Institución
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}