'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface UsuarioSesion {
  id?: string;
  nombre?: string;
  nombre_completo?: string;
  email?: string;
  correo?: string;
  rol?: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  useEffect(() => {
    const userStored = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
    if (userStored) {
      try {
        setUsuario(JSON.parse(userStored));
      } catch (e) {
        console.error('Error al parsear datos de sesión:', e);
      }
    } else {
      setUsuario(null);
    }
  }, [pathname]);

  const cerrarSesion = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    setUsuario(null);
    setMenuAbierto(false);
    router.push('/login');
  };

  const nombreMostrar =
    usuario?.nombre ||
    usuario?.nombre_completo?.split(' ')[0] ||
    'Usuario';

  const esModeradorOAdmin =
    usuario?.rol === 'MODERADOR' ||
    usuario?.rol === 'ADMINISTRADOR' ||
    usuario?.rol === 'ADMIN';

  const linkActivo = (ruta: string) =>
    pathname === ruta
      ? 'text-[#2E7D5B] font-bold'
      : 'text-[#1F2937] hover:text-[#2E7D5B] font-medium';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* LOGOTIPO INSTITUCIONAL */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">🐾</span>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-[#1F2937] tracking-tight leading-none">
                Veci<span className="text-[#2E7D5B]">Pets</span>
              </span>
              <span className="text-[9px] font-bold text-[#6B7280] tracking-wider uppercase mt-0.5 hidden sm:block">
                Medellín
              </span>
            </div>
          </Link>

          {/* NAVEGACIÓN ESCRITORIO */}
          <nav className="hidden md:flex items-center gap-7 text-sm">
            <Link href="/" className={`${linkActivo('/')} transition-colors`}>
              Inicio
            </Link>
            <Link href="/reportes" className={`${linkActivo('/reportes')} transition-colors`}>
              Reportes
            </Link>
            <Link href="/mapa" className={`${linkActivo('/mapa')} transition-colors`}>
              Mapa
            </Link>
            <Link href="/refugios" className={`${linkActivo('/refugios')} transition-colors`}>
              Refugios
            </Link>

            {esModeradorOAdmin && (
              <Link
                href="/moderacion"
                className="bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors"
              >
                🛡️ Moderación
              </Link>
            )}
          </nav>

          {/* PERFIL / ACCIONES ESCRITORIO */}
          <div className="hidden md:flex items-center gap-3">
            {usuario ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/reportes/nuevo"
                  className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>➕</span> Reportar
                </Link>

                <Link
                  href="/perfil"
                  className="bg-slate-50 border border-slate-200 hover:border-[#2E7D5B] px-3.5 py-2 rounded-xl text-xs text-slate-700 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>👤</span> {nombreMostrar}
                </Link>

                <button
                  onClick={cerrarSesion}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-bold text-[#1F2937] hover:text-[#2E7D5B] px-4 py-2 rounded-xl transition-colors"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                >
                  Registrarme
                </Link>
              </div>
            )}
          </div>

          {/* BOTÓN MÓVIL HAMBURGUESA */}
          <div className="flex md:hidden items-center gap-2">
            {usuario && (
              <Link
                href="/reportes/nuevo"
                className="bg-[#2E7D5B] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
              >
                + Reportar
              </Link>
            )}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#2E7D5B] hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú de navegación"
            >
              {menuAbierto ? (
                <span className="text-xl font-bold leading-none">✕</span>
              ) : (
                <span className="text-xl font-bold leading-none">☰</span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1.5 text-sm">
            <Link
              href="/"
              onClick={() => setMenuAbierto(false)}
              className={`p-2.5 rounded-xl ${pathname === '/' ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] font-bold' : 'text-slate-700'}`}
            >
              🏠 Inicio
            </Link>
            <Link
              href="/reportes"
              onClick={() => setMenuAbierto(false)}
              className={`p-2.5 rounded-xl ${pathname === '/reportes' ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] font-bold' : 'text-slate-700'}`}
            >
              📋 Reportes
            </Link>
            <Link
              href="/mapa"
              onClick={() => setMenuAbierto(false)}
              className={`p-2.5 rounded-xl ${pathname === '/mapa' ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] font-bold' : 'text-slate-700'}`}
            >
              🗺️ Mapa
            </Link>
            <Link
              href="/refugios"
              onClick={() => setMenuAbierto(false)}
              className={`p-2.5 rounded-xl ${pathname === '/refugios' ? 'bg-[#2E7D5B]/10 text-[#2E7D5B] font-bold' : 'text-slate-700'}`}
            >
              🏡 Refugios
            </Link>

            {esModeradorOAdmin && (
              <Link
                href="/moderacion"
                onClick={() => setMenuAbierto(false)}
                className="p-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-200"
              >
                🛡️ Panel de Moderación
              </Link>
            )}
          </nav>

          <div className="border-t border-slate-100 pt-3">
            {usuario ? (
              <div className="space-y-2">
                <Link
                  href="/perfil"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs text-slate-800 font-bold flex items-center justify-between"
                >
                  <span>👤 Mi Perfil ({nombreMostrar})</span>
                  <span className="text-[10px] text-[#2E7D5B] uppercase font-extrabold">{usuario.rol || 'CIUDADANO'}</span>
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="w-full bg-rose-50 text-rose-700 font-bold py-2.5 rounded-xl text-xs hover:bg-rose-100 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full text-center border border-slate-200 font-bold py-2.5 rounded-xl text-xs text-slate-700 hover:bg-slate-50"
                >
                  Ingresar
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="w-full text-center bg-[#2E7D5B] text-white font-bold py-2.5 rounded-xl text-xs hover:bg-[#4CAF78]"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}