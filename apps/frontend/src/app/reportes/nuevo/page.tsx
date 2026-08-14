'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Cargar el componente del mapa solo en el cliente
const SelectorUbicacion = dynamic(
  () => import('@/components/mapa/SelectorUbicacion'),
  { ssr: false, loading: () => <div className="h-64 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Cargando mapa...</div> }
);

export default function NuevoReportePage() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const [form, setForm] = useState({
    nombreMascota: '',
    especie: 'Perro',
    raza: '',
    color: '',
    tamano: 'Mediano',
    sexo: 'Macho',
    caracteristicasEspeciales: '',
    tipoReporte: 'PERDIDO',
    fechaEvento: new Date().toISOString().split('T')[0],
    descripcion: '',
    latitud: '',
    longitud: '',
  });

  const [imagenes, setImagenes] = useState<FileList | null>(null);

  const handleUbicacion = (lat: number, lng: number) => {
    setForm((prev) => ({
      ...prev,
      latitud: lat.toString(),
      longitud: lng.toString(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para crear un reporte');
      }

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (imagenes) {
        Array.from(imagenes).forEach((file) => {
          formData.append('imagenes', file);
        });
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'}/reportes`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error al guardar el reporte');
      }

      setExito(true);
      setTimeout(() => router.push('/reportes'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-2">Crear Reporte de Mascota</h1>
        <p className="text-slate-400 text-sm mb-6">
          Completa los datos de la mascota e indica el lugar exacto en el mapa.
        </p>

        {error && (
          <div className="bg-rose-950/50 border border-rose-500 text-rose-300 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-emerald-950/50 border border-emerald-500 text-emerald-300 p-3 rounded-lg text-sm text-center mb-6">
            ¡Reporte creado exitosamente! Fue enviado a moderación.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Reporte */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm({ ...form, tipoReporte: 'PERDIDO' })}
              className={`py-3 rounded-xl font-bold border transition-all ${
                form.tipoReporte === 'PERDIDO'
                  ? 'bg-rose-600 border-rose-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Mascota Perdida 🔍
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, tipoReporte: 'ENCONTRADO' })}
              className={`py-3 rounded-xl font-bold border transition-all ${
                form.tipoReporte === 'ENCONTRADO'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              Mascota Encontrada 🏠
            </button>
          </div>

          {/* Ubicación en el Mapa */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Haz clic en el mapa para marcar el lugar del evento:
            </label>
            <SelectorUbicacion onUbicacionSeleccionada={handleUbicacion} />
            {form.latitud && (
              <p className="text-xs text-emerald-400 mt-2">
                📍 Ubicación seleccionada: {form.latitud.slice(0, 7)}, {form.longitud.slice(0, 7)}
              </p>
            )}
          </div>

          {/* Datos de la Mascota */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Nombre de la Mascota</label>
              <input
                type="text"
                value={form.nombreMascota}
                onChange={(e) => setForm({ ...form, nombreMascota: e.target.value })}
                placeholder="Ej. Lucas (Opcional si es encontrada)"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Especie</label>
              <select
                value={form.especie}
                onChange={(e) => setForm({ ...form, especie: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-300">Color Principal</label>
              <input
                type="text"
                required
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
                placeholder="Ej. Café con blanco"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Tamaño</label>
              <select
                value={form.tamano}
                onChange={(e) => setForm({ ...form, tamano: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-300">Sexo</label>
              <select
                value={form.sexo}
                onChange={(e) => setForm({ ...form, sexo: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
                <option value="Desconocido">Desconocido</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Fecha del Evento</label>
            <input
              type="date"
              required
              value={form.fechaEvento}
              onChange={(e) => setForm({ ...form, fechaEvento: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Descripción detallada</label>
            <textarea
              required
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              placeholder="Describe el lugar, collar, comportamiento u observaciones..."
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 mt-1 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300">Fotos de la Mascota (Hasta 5 fotos)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImagenes(e.target.files)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-300 rounded-lg p-2.5 mt-1 file:bg-slate-700 file:border-0 file:text-white file:px-3 file:py-1 file:rounded-md file:mr-3 hover:file:bg-slate-600 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50"
          >
            {cargando ? 'Publicando...' : 'Enviar Reporte a Revisión'}
          </button>
        </form>
      </div>
    </main>
  );
}