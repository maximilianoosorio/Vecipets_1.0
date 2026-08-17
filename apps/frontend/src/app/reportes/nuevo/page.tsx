'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Carga perezosa del mapa (evita errores de SSR en Next.js)
const MapaSelector = dynamic(
  () => import('@/components/mapa/MapaSelectorUbicacion'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] bg-slate-100 animate-pulse flex items-center justify-center text-slate-500 text-sm rounded-xl">
        Cargando mapa de Medellín...
      </div>
    ),
  }
);

export default function NuevoReportePage() {
  const router = useRouter();

  // Estados del Formulario
  const [tipoReporte, setTipoReporte] = useState<'PERDIDO' | 'ENCONTRADO'>('PERDIDO');
  const [nombreMascota, setNombreMascota] = useState('');
  const [especie, setEspecie] = useState('PERRO');
  const [raza, setRaza] = useState('');
  const [color, setColor] = useState('');
  const [tamano, setTamano] = useState('MEDIANO');
  const [sexo, setSexo] = useState('MACHO');
  const [caracteristicasEspeciales, setCaracteristicasEspeciales] = useState('');
  const [fechaEvento, setFechaEvento] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('Medellín, Antioquia');

  // Coordenadas
  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number }>({
    lat: 6.2442,
    lng: -75.5812,
  });

  // Archivos de Imagen (Cloudinary)
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [previsualizaciones, setPrevisualizaciones] = useState<string[]>([]);

  // Estados UI
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  // Manejador de selección de imágenes
  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const archivos = Array.from(e.target.files).slice(0, 3); // Máximo 3 imágenes
      setImagenes(archivos);

      const urls = archivos.map((file) => URL.createObjectURL(file));
      setPrevisualizaciones(urls);
    }
  };

  // Envío del Formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setError('Debes iniciar sesión para crear un reporte.');
      setCargando(false);
      setTimeout(() => router.push('/login'), 1500);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('tipoReporte', tipoReporte);
      formData.append('nombreMascota', nombreMascota || (tipoReporte === 'ENCONTRADO' ? 'Sin Nombre' : 'Desconocido'));
      formData.append('especie', especie);
      formData.append('raza', raza || 'Mestizo');
      formData.append('color', color);
      formData.append('tamano', tamano);
      formData.append('sexo', sexo);
      formData.append('caracteristicasEspeciales', caracteristicasEspeciales);
      formData.append('fechaEvento', fechaEvento);
      formData.append('descripcion', descripcion);
      formData.append('direccion', direccion);
      formData.append('latitud', String(coordenadas.lat));
      formData.append('longitud', String(coordenadas.lng));

      // Adjuntar archivos binarios para Multer + Cloudinary
      imagenes.forEach((file) => {
        formData.append('imagenes', file);
      });

      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1').replace(/\/+$/, '');
      const response = await fetch(`${baseUrl}/reportes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el reporte.');
      }

      setExito(true);
      setTimeout(() => router.push('/'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error de conexión al registrar el reporte.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
      <div className="max-w-3xl mx-auto">
        
        {/* Cabecera */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2E7D5B] hover:text-[#4CAF78] mb-3">
            ← Volver al inicio
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
            Registrar Mascota
          </h1>
          <p className="text-sm text-[#6B7280] mt-1 max-w-md mx-auto">
            Completa la información para que la comunidad y los refugios aliados puedan colaborar en la búsqueda.
          </p>
        </div>

        {/* Mensajes de Alerta */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl shadow-xs">
            ⚠️ {error}
          </div>
        )}

        {exito && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm p-4 rounded-xl shadow-xs text-center font-medium">
            🎉 ¡Reporte creado exitosamente! Redirigiendo...
          </div>
        )}

        {/* Formulario Reactivo Responsivo */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Selector de Tipo de Reporte */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Tipo de Caso *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipoReporte('PERDIDO')}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                  tipoReporte === 'PERDIDO'
                    ? 'bg-[#2E7D5B] text-white border-[#2E7D5B] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔴 Mascota Perdida
              </button>
              <button
                type="button"
                onClick={() => setTipoReporte('ENCONTRADO')}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all border ${
                  tipoReporte === 'ENCONTRADO'
                    ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔵 Mascota Encontrada
              </button>
            </div>
          </div>

          {/* Sección 1: Datos de la Mascota */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>🐾</span> Información de la Mascota
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nombre de la Mascota {tipoReporte === 'PERDIDO' ? '*' : '(Opcional)'}
                </label>
                <input
                  type="text"
                  required={tipoReporte === 'PERDIDO'}
                  value={nombreMascota}
                  onChange={(e) => setNombreMascota(e.target.value)}
                  placeholder="Ej: Firulais, Lucas"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Especie *
                </label>
                <select
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                >
                  <option value="PERRO">Perro</option>
                  <option value="GATO">Gato</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Raza
                </label>
                <input
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej: Criollo, Labrador"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Color Principal *
                </label>
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ej: Blanco con manchas café"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tamaño *
                </label>
                <select
                  value={tamano}
                  onChange={(e) => setTamano(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                >
                  <option value="PEQUENO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Sexo *
                </label>
                <select
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                >
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                  <option value="DESCONOCIDO">Desconocido</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Señas o Características Especiales
              </label>
              <input
                type="text"
                value={caracteristicasEspeciales}
                onChange={(e) => setCaracteristicasEspeciales(e.target.value)}
                placeholder="Ej: Collar rojo, cicatriz en oreja izquierda"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
              />
            </div>
          </div>

          {/* Sección 2: Ubicación y Fecha */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>📍</span> Ubicación y Fecha del Suceso
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Fecha del Suceso *
                </label>
                <input
                  type="date"
                  required
                  value={fechaEvento}
                  onChange={(e) => setFechaEvento(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Barrio o Sector (Medellín) *
                </label>
                <input
                  type="text"
                  required
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Ej: Laureles, El Poblado, Belén"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white"
                />
              </div>
            </div>

            {/* Mapa Interactivo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-600">
                Selecciona la ubicación exacta en el mapa (Haz clic sobre el mapa):
              </label>
              <MapaSelector
                latInicial={coordenadas.lat}
                lngInicial={coordenadas.lng}
                onSeleccionarCoordenadas={(lat, lng) => setCoordenadas({ lat, lng })}
              />
              <p className="text-[11px] text-slate-400">
                Coordenadas seleccionadas: {coordenadas.lat.toFixed(4)}, {coordenadas.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Sección 3: Fotografías (Cloudinary) */}
          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>📷</span> Fotografías de la Mascota
            </h2>

            <div className="border-2 border-dashed border-slate-200 hover:border-[#2E7D5B] rounded-2xl p-6 text-center transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagenesChange}
                className="hidden"
                id="input-imagenes"
              />
              <label
                htmlFor="input-imagenes"
                className="cursor-pointer flex flex-col items-center justify-center gap-2"
              >
                <span className="text-3xl">🖼️</span>
                <span className="text-sm font-semibold text-[#2E7D5B]">
                  Haz clic para subir hasta 3 fotografías
                </span>
                <span className="text-xs text-slate-400">Formatos soportados: JPG, PNG o WEBP</span>
              </label>
            </div>

            {/* Previsualización de imágenes */}
            {previsualizaciones.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {previsualizaciones.map((url, idx) => (
                  <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img src={url} alt="Previsualización" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección 4: Descripción Adicional */}
          <div className="border-t border-slate-100 pt-6">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Descripción Adicional *
            </label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Cuéntanos más detalles del lugar o circunstancias..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#2E7D5B] focus:bg-white resize-none"
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-4 rounded-xl shadow-md transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cargando ? 'Publicando Reporte...' : 'Publicar Reporte'}
          </button>
        </form>
      </div>
    </div>
  );
}