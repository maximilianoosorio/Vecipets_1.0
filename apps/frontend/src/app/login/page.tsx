'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      const res: any = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          correo: email.trim().toLowerCase(),
          contrasena: password,
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const token = res?.token || res?.access_token;
      const usuario = res?.usuario || res?.user || { email };

      if (!token) {
        throw new Error('No se recibió el token de autenticación del servidor.');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify(usuario));

      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        const rol = (usuario.rol || usuario.role || '').toUpperCase();
        if (rol === 'ADMIN' || rol === 'MODERADOR') {
          router.push('/moderacion');
        } else if (rol === 'REFUGIO') {
          router.push('/refugios');
        } else {
          router.push('/perfil');
        }
      }
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      setError(err.message || 'Correo o contraseña incorrectos. Verifica tus credenciales.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      {/* ENCABEZADO */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#5E7BC4] flex items-center justify-center text-white mx-auto shadow-xs">
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9-4C8 6 7.1 6.9 7.1 8s.9 2 2 2 2-.9 2-2-.9-2-2.1-2zm6 0c-.9 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">Bienvenido de nuevo</h1>
        <p className="text-xs sm:text-sm text-[#53627A]">
          Ingresa a tu cuenta para gestionar reportes y mascotas.
        </p>
      </div>

      {/* ALERTA DE ERROR */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-2xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-100 p-6 sm:p-8 rounded-[24px] shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#53627A] mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#53627A] mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contraseña"
            className="w-full bg-[#EEF2FC] border border-slate-200 rounded-full px-4 py-2.5 text-xs text-[#292A2F] focus:outline-none focus:border-[#5E7BC4] focus:bg-white"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white font-bold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 text-xs sm:text-sm"
          >
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="text-center pt-2 space-y-1">
          <p className="text-xs text-[#53627A]">
            ¿No tienes una cuenta aún?{' '}
            <Link href="/registro" className="text-[#5E7BC4] font-bold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#292A2F] flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center p-8 text-xs font-semibold text-[#53627A] animate-pulse">
          Cargando inicio de sesión...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}