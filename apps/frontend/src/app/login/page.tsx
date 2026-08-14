'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api-client';

interface LoginResponse {
  access_token: string;
  usuario: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    rol: string;
  };
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
        body: JSON.stringify({ correo, contrasena }),
      });

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-white text-center">Iniciar Sesión en VeciPets</h2>

        {error && (
          <div className="bg-rose-950/50 border border-rose-500 text-rose-300 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-emerald-500"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Contraseña</label>
          <input
            type="password"
            required
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:border-emerald-500"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {cargando ? 'Ingresando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </main>
  );
}