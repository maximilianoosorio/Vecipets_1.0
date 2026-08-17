'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface LoginResponse {
  access_token?: string;
  token?: string;
  usuario?: {
    id: string;
    nombre?: string;
    nombre_completo?: string;
    apellido?: string;
    correo?: string;
    email?: string;
    rol?: string;
  };
  user?: any;
}

export default function LoginPage() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const data = await fetchAPI<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          correo: correo.trim().toLowerCase(),
          email: correo.trim().toLowerCase(),
          contrasena,
          password: contrasena,
        }),
      });

      const token = data.access_token || data.token;
      const user = data.usuario || data.user;

      if (!token) {
        throw new Error('No se recibió un token de acceso válido.');
      }

      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('usuario', JSON.stringify(user));
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Credenciales inválidas. Por favor verifica tus datos.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8FAF9] p-4 sm:p-6 lg:p-8 text-[#1F2937]">
      <div className="w-full max-w-md space-y-6">
        
        {/* ENCABEZADO CON LOGO */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <span className="text-3xl group-hover:scale-110 transition-transform">🐾</span>
            <span className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Veci<span className="text-[#2E7D5B]">Pets</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-[#1F2937]">Iniciar Sesión</h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Ingresa a la red comunitaria de mascotas de Medellín
          </p>
        </div>

        {/* TARJETA DEL FORMULARIO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5"
        >
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm p-3.5 rounded-2xl">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              placeholder="tu.correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full bg-[#F8FAF9] border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-[#1F2937] focus:outline-none focus:border-[#2E7D5B] focus:bg-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-[#6B7280]">
              ¿No tienes una cuenta?{' '}
              <Link href="/registro" className="font-bold text-[#2E7D5B] hover:underline">
                Regístrate aquí
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