'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const MapaSelectorUbicacion = dynamic(
  () => import('@/components/mapa/MapaSelectorUbicacion'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 w-full bg-[#EEF2FC] rounded-2xl animate-pulse flex flex-col items-center justify-center text-[#53627A] text-xs font-semibold">
        <span className="text-3xl mb-1 animate-bounce">📍</span>
        Cargando selector de ubicación en Medellín...
      </div>
    ),
  }
);

export default function ReportarPage() {
  const router = useRouter();
  const [usuarioAutenticado, setUsuarioAutenticado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoArchivo, setFotoArchivo] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    tipoReporte: 'PERDIDO',
    nombre: '',
    especie: 'PERRO',
    raza: '',
    color: '',
    tamano: 'MEDIANO',
    sexo: 'MACHO',
    descripcion: '',
    direccion: '',
    latitud: 6.2442,
    longitud: -75.5812,
    fechaEvento: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      router.push('/login?redirect=/reportar');
    } else {
      setUsuarioAutenticado(true);
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFotoArchivo(file);
      setFotoPreview(URL.createObjectURL(file));
    }
  };

  const handleUbicacionChange = (lat: number, lng: number, dir?: string) => {
    setFormData((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lng,
      direccion: dir || prev.direccion,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEnviando(true);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        throw new Error('Debes iniciar sesión para publicar un reporte.');
      }

      const dataPayload = new FormData();

      // 1. Datos del reporte
      dataPayload.append('tipoReporte', formData.tipoReporte);
      dataPayload.append('descripcion', formData.descripcion);
      dataPayload.append('direccion', formData.direccion || 'Medellín, Antioquia');
      dataPayload.append('latitud', String(formData.latitud));
      dataPayload.append('longitud', String(formData.longitud));
      dataPayload.append('fechaEvento', formData.fechaEvento);

      // 2. Datos de la mascota
      const nombreMascota =
        formData.tipoReporte === 'PERDIDO'
          ? formData.nombre.trim() || 'Sin nombre'
          : formData.nombre.trim() || 'Mascota rescatada';

      dataPayload.append('nombre', nombreMascota);
      dataPayload.append('especie', formData.especie);
      dataPayload.append('raza', formData.raza.trim() || 'Mestizo');
      dataPayload.append('color', formData.color.trim() || 'No especificado');
      dataPayload.append('tamano', formData.tamano);
      dataPayload.append('sexo', formData.sexo);

      // 3. Adjuntar archivo con múltiples claves para compatibilidad total
      if (fotoArchivo) {
        dataPayload.append('imagenes', fotoArchivo);
        dataPayload.append('fotos', fotoArchivo);
      }

      // 4. Envío directo al backend
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

      const res = await fetch(`${baseUrl}/reportes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // Nota: NO colocar Content-Type para que el navegador genere multipart boundary automáticamente
        },
        body: dataPayload,
      });

      const resData = await res.json().catch(() => ({}));

      if (!res.ok) {
        const errorMsg = Array.isArray(resData.message)
          ? resData.message.join(', ')
          : resData.message || 'Error al procesar el reporte en el servidor.';
        throw new Error(errorMsg);
      }

      // Limpiar preview y redirigir
      if (fotoPreview) {
        URL.revokeObjectURL(fotoPreview);
      }

      router.push('/reportes');
    } catch (err: any) {
      console.error('Error al publicar el reporte:', err);
      setError(err.message || 'Error al publicar el reporte.');
    } finally {
      setEnviando(false);
    }
  };

  if (!usuarioAutenticado) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm font-semibold text-[#53627A] animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8 font-sans text-[#292A2F]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ENCABEZADO */}
        <div className="bg-[#EEF2FC] border border-slate-100 p-6 sm:p-8 rounded-[24px] shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-block bg-white text-[#5E7BC4] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-2xs">
              🐾 Formulario Oficial
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
              Publicar Nuevo Reporte
            </h1>
            <p className="text-xs sm:text-sm text-[#53627A] mt-1">
              Ingresa los datos para que la comunidad y los refugios ayuden a localizarla.
            </p>
          </div>

          <Link
            href="/reportes"
            className="text-xs sm:text-sm font-semibold text-[#5E7BC4] hover:text-[#4F6FB8] transition-colors"
          >
            ← Volver a reportes
          </Link>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-4 rounded-2xl text-center">
            ⚠️ {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[24px] shadow-xs space-y-6"
        >
          {/* TIPO DE REPORTE */}
          <div>
            <label className="block text-xs font-bold text-[#292A2F] uppercase tracking-wider mb-2">
              ¿Qué deseas reportar? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, tipoReporte: 'PERDIDO' }))}
                className={`py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.tipoReporte === 'PERDIDO'
                    ? 'bg-[#5E7BC4] text-white shadow-xs'
                    : 'bg-[#EEF2FC] text-[#53627A] hover:bg-slate-200'
                }`}
              >
                <span>🐾</span> Mascota Perdida
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, tipoReporte: 'ENCONTRADO' }))}
                className={`py-3 px-4 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  formData.tipoReporte === 'ENCONTRADO'
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-[#EEF2FC] text-[#53627A] hover:bg-slate-200'
                }`}
              >
                <span>📍</span> Mascota Encontrada
              </button>
            </div>
          </div>

          {/* DATOS DE LA MASCOTA */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-[#292A2F]">Información de la Mascota</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Nombre de la mascota *
                </label>
                <input
                  type="text"
                  name="nombre"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder={
                    formData.tipoReporte === 'PERDIDO'
                      ? 'Ej: Lucas'
                      : 'Ej: Sin nombre / Encontrado'
                  }
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Especie *
                </label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs font-semibold text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                >
                  <option value="PERRO">Perro 🐶</option>
                  <option value="GATO">Gato 🐱</option>
                  <option value="OTRO">Otro animal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Raza
                </label>
                <input
                  type="text"
                  name="raza"
                  value={formData.raza}
                  onChange={handleChange}
                  placeholder="Ej: Criollo, Labrador..."
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Color predominante
                </label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="Ej: Café con manchas blancas"
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Tamaño
                </label>
                <select
                  name="tamano"
                  value={formData.tamano}
                  onChange={handleChange}
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs font-semibold text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                >
                  <option value="PEQUENO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#53627A] mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs font-semibold text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
                >
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                  <option value="DESCONOCIDO">Desconocido</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOTOGRAFÍA */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-[#292A2F] uppercase tracking-wider">
              Fotografía de la Mascota
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-40 h-32 bg-[#EEF2FC] rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden relative">
                {fotoPreview ? (
                  <img
                    src={fotoPreview}
                    alt="Previsualización"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-slate-400">📷</span>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFotoChange}
                  className="text-xs text-[#53627A] file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#5E7BC4] file:text-white hover:file:bg-[#4F6FB8] cursor-pointer"
                />
                <p className="text-[11px] text-[#53627A]">
                  Formatos: JPG, PNG, WEBP (Se sube directo a Cloudinary y se guarda en Supabase).
                </p>
              </div>
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
              <label className="block text-xs font-bold text-[#292A2F] uppercase tracking-wider">
                Lugar de los hechos (Medellín) *
              </label>
              <span className="text-[11px] text-[#5E7BC4]">
                Haz clic en el mapa para marcar el punto exacto
              </span>
            </div>

            <div>
              <input
                type="text"
                name="direccion"
                required
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Barrio o referencia (ej: Laureles, cerca al segundo parque)"
                className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white mb-3"
              />
            </div>

            <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
              <MapaSelectorUbicacion
                latInicial={formData.latitud}
                lngInicial={formData.longitud}
                onSelectLocation={(lat: number, lng: number) =>
                  handleUbicacionChange(lat, lng)
                }
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-[#292A2F] uppercase tracking-wider">
              Descripción y detalles importantes *
            </label>
            <textarea
              name="descripcion"
              required
              rows={3}
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe collar, cicatrices, comportamiento o condiciones de salud..."
              className="w-full bg-[#EEF2FC] border border-slate-200 rounded-2xl p-4 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
            />
          </div>

          {/* BOTÓN ENVIAR */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-[#F3B26C] hover:bg-[#e29e54] text-white font-bold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
            >
              {enviando ? (
                <>
                  <span className="animate-spin">🔄</span> Publicando y subiendo fotos...
                </>
              ) : (
                <>
                  <span>🐾</span> Publicar Reporte Oficial
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}