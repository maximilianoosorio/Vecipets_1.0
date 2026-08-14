'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api-client';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await fetchAPI('/auth/registro', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      setExito(true);
      setTimeout(() => router.push('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-white text-center">Registro de Ciudadano</h2>

        {error && (
          <div className="bg-rose-950/50 border border-rose-500 text-rose-300 text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {exito && (
          <div className="bg-emerald-950/50 border border-emerald-500 text-emerald-300 text-sm p-3 rounded-lg text-center">
            ¡Registro exitoso! Redirigiendo al login...
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-300">Nombre</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300">Apellido</label>
            <input
              type="text"
              required
              value={form.apellido}
              onChange={(e) => setForm({ ...form, apellido: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Correo Electrónico</label>
          <input
            type="email"
            required
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300">Contraseña</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.contrasena}
            onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-2.5 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
        >
          {cargando ? 'Registrando...' : 'Crear Cuenta'}
        </button>
      </form>
    </main>
  );
}