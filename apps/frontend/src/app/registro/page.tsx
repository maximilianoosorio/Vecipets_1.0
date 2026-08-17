'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

export default function RegistroPage() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    contrasena: '',
    confirmContrasena: '',
    rol: 'CIUDADANO' as 'CIUDADANO' | 'REFUGIO',
    nombreOrganizacion: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.contrasena !== formData.confirmContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      // Payload adaptado exactamente al DTO del backend en español
      const payload: Record<string, any> = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        correo: formData.correo.trim().toLowerCase(),
        contrasena: formData.contrasena,
      };

      // Si el usuario seleccionó Refugio y completó el nombre de la organización
      if (formData.rol === 'REFUGIO') {
        payload.rol = 'REFUGIO';
        payload.nombreOrganizacion = formData.nombreOrganizacion.trim() || `${formData.nombre} ${formData.apellido}`;
      }

      // Si el DTO acepta teléfono opcional
      if (formData.telefono.trim()) {
        payload.telefono = formData.telefono.trim();
      }

      const res: any = await fetchAPI('/auth/registro', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Si devuelve token directo tras el registro
      const token = res?.token || res?.access_token;
      const usuario = res?.usuario || res?.user || {
        nombre: `${formData.nombre} ${formData.apellido}`,
        correo: formData.correo,
        rol: formData.rol,
      };

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        if (usuario.rol === 'ADMIN' || usuario.rol === 'MODERADOR') {
          router.push('/moderacion');
        } else if (usuario.rol === 'REFUGIO') {
          router.push('/refugios');
        } else {
          router.push('/perfil');
        }
      } else {
        setExito(true);
        setTimeout(() => {
          router.push('/login');
        }, 1800);
      }
    } catch (err: any) {
      console.error('Error al registrar usuario:', err);
      // Extrae mensajes si viene como array del ValidationPipe
      let mensajeError = err.message || 'Error al procesar el registro.';
      if (Array.isArray(err.message)) {
        mensajeError = err.message.join(', ');
      }
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#292A2F] flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        
        {/* ENCABEZADO */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#5E7BC4] flex items-center justify-center text-white mx-auto shadow-xs">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9-4C8 6 7.1 6.9 7.1 8s.9 2 2 2 2-.9 2-2-.9-2-2.1-2zm6 0c-.9 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">Crea tu cuenta</h1>
          <p className="text-xs sm:text-sm text-[#53627A]">
            Únete a la comunidad de VeciPets en Medellín.
          </p>
        </div>

        {/* SELECTOR DE ROL */}
        <div className="bg-[#EEF2FC] p-1.5 rounded-full flex gap-1 border border-slate-100">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rol: 'CIUDADANO' }))}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
              formData.rol === 'CIUDADANO'
                ? 'bg-[#5E7BC4] text-white shadow-2xs'
                : 'text-[#53627A] hover:text-[#292A2F]'
            }`}
          >
            👤 Soy Ciudadano
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, rol: 'REFUGIO' }))}
            className={`flex-1 py-2 rounded-full text-xs font-bold transition-all ${
              formData.rol === 'REFUGIO'
                ? 'bg-[#5E7BC4] text-white shadow-2xs'
                : 'text-[#53627A] hover:text-[#292A2F]'
            }`}
          >
            🏠 Soy Refugio / Albergue
          </button>
        </div>

        {/* MENSAJES */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl text-center leading-relaxed">
            ⚠️ {error}
          </div>
        )}

        {exito && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs p-3.5 rounded-2xl text-center">
            ✅ ¡Cuenta creada exitosamente! Redirigiendo...
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[24px] shadow-xs space-y-4">
          
          {/* NOMBRE Y APELLIDO SEPARADOS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#53627A] mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Laura"
                className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#53627A] mb-1">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                required
                value={formData.apellido}
                onChange={handleChange}
                placeholder="Ej: Zapata"
                className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
              />
            </div>
          </div>

          {formData.rol === 'REFUGIO' && (
            <div>
              <label className="block text-xs font-semibold text-[#53627A] mb-1">
                Nombre del Refugio o Fundación *
              </label>
              <input
                type="text"
                name="nombreOrganizacion"
                required
                value={formData.nombreOrganizacion}
                onChange={handleChange}
                placeholder="Ej: Fundación Huellitas Medellín"
                className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
              />
            </div>
          )}

          {/* CORREO */}
          <div>
            <label className="block text-xs font-semibold text-[#53627A] mb-1">
              Correo Electrónico *
            </label>
            <input
              type="email"
              name="correo"
              required
              value={formData.correo}
              onChange={handleChange}
              placeholder="tucorreo@ejemplo.com"
              className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
            />
          </div>

          {/* TELÉFONO */}
          <div>
            <label className="block text-xs font-semibold text-[#53627A] mb-1">
              Teléfono (Opcional)
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 3001234567"
              className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
            />
          </div>

          {/* CONTRASEÑA */}
          <div>
            <label className="block text-xs font-semibold text-[#53627A] mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              name="contrasena"
              required
              value={formData.contrasena}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
            />
          </div>

          {/* CONFIRMAR CONTRASEÑA */}
          <div>
            <label className="block text-xs font-semibold text-[#53627A] mb-1">
              Confirmar Contraseña *
            </label>
            <input
              type="password"
              name="confirmContrasena"
              required
              value={formData.confirmContrasena}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white font-bold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
            >
              {cargando ? 'Creando cuenta...' : 'Registrarme'}
            </button>
          </div>

          <p className="text-center text-xs text-[#53627A] pt-2">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="text-[#5E7BC4] font-bold hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </form>

      </div>
    </main>
  );
}