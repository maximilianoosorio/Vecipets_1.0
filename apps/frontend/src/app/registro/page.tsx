'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    if (form.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setCargando(true);

    try {
      const emailNormalizado = form.correo.trim().toLowerCase();
      const nombreCompleto = `${form.nombre.trim()} ${form.apellido.trim()}`.trim();

      await fetchAPI('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          nombreCompleto,
          nombre_completo: nombreCompleto,
          correo: emailNormalizado,
          email: emailNormalizado,
          telefono: form.telefono.trim() || undefined,
          contrasena: form.contrasena,
          password: form.contrasena,
          rol: 'CIUDADANO',
        }),
      });

      setExito(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar tu cuenta. El correo ya podría estar en uso.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-4 sm:p-6 lg:p-8 text-[#1F2937]">
      <div className="w-full max-w-md space-y-6">
        
        {/* ENCABEZADO CON LOGO */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-1">
            <span className="text-3xl group-hover:scale-110 transition-transform">🐾</span>
            <span className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Veci<span className="text-[#2E7D5B]">Pets</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1F2937]">Registro de Ciudadano</h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Únete a la red comunitaria para ayudar a reunir mascotas en Medellín
          </p>
        </div>

        {/* FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4"
        >
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          {exito && (
            <div className="bg-emerald-50 border border-emerald-200 text-[#2E7D5B] text-xs sm:text-sm p-3.5 rounded-2xl text-center font-bold">
              🎉 ¡Registro exitoso! Redirigiendo al inicio de sesión...
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
                placeholder="Ej: Juan"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Apellido *
              </label>
              <input
                type="text"
                required
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
                placeholder="Ej: Pérez"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              placeholder="tu.correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Teléfono / Celular (Opcional)
            </label>
            <input
              type="tel"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              placeholder="Ej: 300 123 4567"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contraseña *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.contrasena}
                onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirmar *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={form.confirmarContrasena}
                onChange={(e) => setForm({ ...form, confirmarContrasena: e.target.value })}
                className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cargando ? 'Creando Cuenta...' : 'Crear Cuenta'}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-[#6B7280]">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="font-bold text-[#2E7D5B] hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </form>

        {/* VOLVER AL INICIO */}
        <div className="text-center">
          <Link href="/" className="text-xs font-medium text-[#6B7280] hover:text-[#2E7D5B] transition-colors">
            ← Volver a la página principal
          </Link>
        </div>

      </div>
    </main>
  );
}