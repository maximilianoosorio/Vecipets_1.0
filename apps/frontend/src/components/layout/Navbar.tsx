'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface UsuarioSesion {
  id?: string;
  nombre?: string;
  nombre_completo?: string;
  email?: string;
  correo?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [usuario, setUsuario] = useState<UsuarioSesion | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);

  useEffect(() => {
    const userStored = typeof window !== 'undefined' ? localStorage.getItem('usuario') : null;
    if (userStored) {
      try {
        setUsuario(JSON.parse(userStored));
      } catch (e) {
        console.error('Error al leer sesión:', e);
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

  const esActivo = (ruta: string) => {
    if (ruta === '/') return pathname === '/';
    return pathname === ruta || pathname.startsWith(`${ruta}/`);
  };

  const nombreMostrar = usuario?.nombre || usuario?.nombre_completo?.split(' ')[0] || 'Usuario';

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-xs h-[80px]">
      <div className="max-w-[1240px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LOGO OFICIAL VECIPETS */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src="/logo.svg"
              alt="Logo VeciPets"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#5E7BC4]">
            VeciPets
          </span>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-7">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
              esActivo('/') ? 'text-[#5E7BC4] border-[#5E7BC4]' : 'text-[#53627A] border-transparent hover:text-[#292A2F]'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/reportes"
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
              esActivo('/reportes') ? 'text-[#5E7BC4] border-[#5E7BC4]' : 'text-[#53627A] border-transparent hover:text-[#292A2F]'
            }`}
          >
            Reportes
          </Link>
          <Link
            href="/mapa"
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
              esActivo('/mapa') ? 'text-[#5E7BC4] border-[#5E7BC4]' : 'text-[#53627A] border-transparent hover:text-[#292A2F]'
            }`}
          >
            Mapa
          </Link>
          <Link
            href="/refugios"
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
              esActivo('/refugios') ? 'text-[#5E7BC4] border-[#5E7BC4]' : 'text-[#53627A] border-transparent hover:text-[#292A2F]'
            }`}
          >
            Refugios
          </Link>
          <Link
            href="/informacion"
            className={`text-sm font-semibold transition-colors pb-1 border-b-2 ${
              esActivo('/informacion') ? 'text-[#5E7BC4] border-[#5E7BC4]' : 'text-[#53627A] border-transparent hover:text-[#292A2F]'
            }`}
          >
            Información
          </Link>
        </nav>

        {/* ACCIONES DE USUARIO */}
        <div className="hidden md:flex items-center gap-4">
          {usuario ? (
            <div className="flex items-center gap-3">
              <Link
                href="/perfil"
                className="bg-[#EEF2FC] text-[#5E7BC4] text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-[#5E7BC4] hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>👤</span> {nombreMostrar}
              </Link>
              <button
                onClick={cerrarSesion}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-2 transition-colors cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-[#5E7BC4] hover:text-[#4F6FB8] text-sm font-semibold px-3 py-2 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/registro"
                className="bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* BOTÓN MÓVIL */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2 text-[#5E7BC4] hover:text-[#4F6FB8] focus:outline-none"
            aria-label="Abrir menú"
          >
            {menuAbierto ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2.5 shadow-lg">
          <Link
            href="/"
            onClick={() => setMenuAbierto(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              esActivo('/') ? 'bg-[#EEF2FC] text-[#5E7BC4]' : 'text-[#292A2F]'
            }`}
          >
            Inicio
          </Link>
          <Link
            href="/reportes"
            onClick={() => setMenuAbierto(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              esActivo('/reportes') ? 'bg-[#EEF2FC] text-[#5E7BC4]' : 'text-[#292A2F]'
            }`}
          >
            Reportes
          </Link>
          <Link
            href="/mapa"
            onClick={() => setMenuAbierto(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              esActivo('/mapa') ? 'bg-[#EEF2FC] text-[#5E7BC4]' : 'text-[#292A2F]'
            }`}
          >
            Mapa
          </Link>
          <Link
            href="/refugios"
            onClick={() => setMenuAbierto(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              esActivo('/refugios') ? 'bg-[#EEF2FC] text-[#5E7BC4]' : 'text-[#292A2F]'
            }`}
          >
            Refugios
          </Link>
          <Link
            href="/informacion"
            onClick={() => setMenuAbierto(false)}
            className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
              esActivo('/informacion') ? 'bg-[#EEF2FC] text-[#5E7BC4]' : 'text-[#292A2F]'
            }`}
          >
            Información
          </Link>
          
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {usuario ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setMenuAbierto(false)}
                  className="block w-full bg-[#EEF2FC] text-[#5E7BC4] text-center font-semibold py-2.5 rounded-full text-sm"
                >
                  👤 Mi Perfil ({nombreMostrar})
                </Link>
                <button
                  onClick={cerrarSesion}
                  className="block w-full bg-rose-50 text-rose-700 text-center font-semibold py-2.5 rounded-full text-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMenuAbierto(false)}
                  className="block w-full text-center border border-[#5E7BC4] text-[#5E7BC4] font-semibold py-2 rounded-full text-sm"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setMenuAbierto(false)}
                  className="block w-full text-center bg-[#5E7BC4] text-white font-semibold py-2 rounded-full text-sm"
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