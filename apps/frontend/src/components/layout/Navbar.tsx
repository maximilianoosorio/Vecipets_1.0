'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<{ nombre: string; rol: string } | null>(null);

  useEffect(() => {
    const userStored = localStorage.getItem('usuario');
    if (userStored) {
      setUsuario(JSON.parse(userStored));
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    router.push('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold tracking-wide text-emerald-400">
        🐾 VeciPets
      </Link>

      <div className="flex gap-6 items-center">
        <Link href="/reportes" className="hover:text-emerald-300 transition-colors">
          Reportes
        </Link>
        <Link href="/mapa" className="hover:text-emerald-300 transition-colors">
          Mapa
        </Link>

        {usuario ? (
          <div className="flex items-center gap-4">
            <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-300">
              Hola, <strong className="text-white">{usuario.nombre}</strong>
            </span>
            <button
              onClick={cerrarSesion}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-sm"
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-sm font-medium"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}