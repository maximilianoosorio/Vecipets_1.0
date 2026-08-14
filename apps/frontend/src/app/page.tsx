'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { fetchAPI } from '@/lib/api-client';

const MapComponent = dynamic(
  () => import('@/components/mapa/MapaGeneralLeaflet').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-[#6B7280] text-sm">
        Cargando mapa de avistamientos...
      </div>
    ),
  }
);

export default function HomePage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [especieFiltro, setEspecieFiltro] = useState('TODOS');

  useEffect(() => {
    fetchAPI<any[]>('/reportes/publicos')
      .then((data) => setReportes(data || []))
      .catch((err) => console.error('Error al cargar reportes:', err));
  }, []);

  const reportesFiltrados = reportes.filter((r) => {
    const coincideTipo =
      tipoFiltro === 'TODOS' || r.tipoReporte === tipoFiltro;
    
    const especie = r.mascota?.especie || r.especie || '';
    const coincideEspecie =
      especieFiltro === 'TODOS' ||
      especie.toUpperCase() === especieFiltro.toUpperCase();

    return coincideTipo && coincideEspecie;
  });

  return (
    <div className="bg-[#F8FAF9] min-h-screen text-[#1F2937]">
      
      {/* 5. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* IZQUIERDA: CONTENIDO */}
        <div className="space-y-6 text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1F2937] leading-tight">
            Encuentra a tu mascota. <br />
            <span className="text-[#2E7D5B]">Ayuda a encontrar la de alguien más.</span>
          </h1>

          <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed">
            VeciPets conecta a la comunidad para reportar, buscar y recuperar mascotas perdidas y encontradas de forma segura y geolocalizada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/reportes/nuevo"
              className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-md text-center text-base"
            >
              Reportar mascota
            </Link>
            <Link
              href="/mapa"
              className="bg-white border-2 border-[#2E7D5B] text-[#2E7D5B] hover:bg-[#2E7D5B]/5 font-semibold px-8 py-4 rounded-xl transition-all text-center text-base"
            >
              Explorar mapa
            </Link>
          </div>
        </div>

        {/* DERECHA: FOTOGRAFÍA + CARDS FLOTANTES */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-full max-w-lg h-[420px] rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000"
              alt="Mascota en la comunidad"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Cards Flotantes (Hero Visuals) */}
          <div className="absolute -top-4 -left-4 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-3">
            <span className="text-xl">🐾</span>
            <div>
              <p className="text-xs font-bold text-[#1F2937]">24 reportes cerca</p>
              <p className="text-[10px] text-[#6B7280]">Medellín, Antioquia</p>
            </div>
          </div>

          <div className="absolute -bottom-4 -right-4 bg-white p-3.5 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2">
            <span className="text-[#16A34A] text-lg">✓</span>
            <span className="text-xs font-semibold text-[#1F2937]">Reporte verificado</span>
          </div>
        </div>
      </section>

      {/* 8. SECCIÓN "¿CÓMO FUNCIONA?" */}
      <section className="bg-white py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#1F2937]">¿Cómo funciona VeciPets?</h2>
          <p className="text-[#6B7280] mt-2 text-base max-w-xl mx-auto">
            Un proceso sencillo para ayudar a reunir mascotas con sus familias.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            
            <div className="bg-[#F8FAF9] p-8 rounded-[16px] shadow-xs border border-slate-100 hover:-translate-y-1 transition-transform text-left">
              <div className="w-12 h-12 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                📋
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Reporta</h3>
              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                Registra una mascota perdida o encontrada con información detallada.
              </p>
            </div>

            <div className="bg-[#F8FAF9] p-8 rounded-[16px] shadow-xs border border-slate-100 hover:-translate-y-1 transition-transform text-left">
              <div className="w-12 h-12 bg-[#3B82F6]/10 text-[#3B82F6] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                📍
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Ubica</h3>
              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                Consulta los reportes mediante nuestro mapa interactivo en tiempo real.
              </p>
            </div>

            <div className="bg-[#F8FAF9] p-8 rounded-[16px] shadow-xs border border-slate-100 hover:-translate-y-1 transition-transform text-left">
              <div className="w-12 h-12 bg-[#2E7D5B]/10 text-[#2E7D5B] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Verifica</h3>
              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                La información es revisada y validada por refugios y actores autorizados.
              </p>
            </div>

            <div className="bg-[#F8FAF9] p-8 rounded-[16px] shadow-xs border border-slate-100 hover:-translate-y-1 transition-transform text-left">
              <div className="w-12 h-12 bg-[#16A34A]/10 text-[#16A34A] rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
                ❤️
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">Recupera</h3>
              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                Facilitamos el proceso para lograr la reunificación segura de la mascota.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 9 & 10. SECCIÓN MAPA Y FILTROS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#1F2937]">Reportes cerca de ti</h2>
          <p className="text-[#6B7280] mt-1 text-sm">Explora las ubicaciones geolocalizadas en Medellín</p>
        </div>

        {/* FILTROS Y LEYENDA */}
        <div className="bg-white p-4 rounded-t-2xl border border-slate-200 border-b-0 flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Filtros */}
          <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
            <select
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              className="bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="TODOS">Tipo: Todos</option>
              <option value="PERDIDO">Perdidas</option>
              <option value="ENCONTRADO">Encontradas</option>
            </select>

            <select
              value={especieFiltro}
              onChange={(e) => setEspecieFiltro(e.target.value)}
              className="bg-[#F8FAF9] border border-slate-200 text-xs font-semibold text-[#1F2937] rounded-lg px-3 py-2 focus:outline-none"
            >
              <option value="TODOS">Especie: Todas</option>
              <option value="PERRO">Perros</option>
              <option value="GATO">Gatos</option>
            </select>
          </div>

          {/* LEYENDA DEL MAPA */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#2E7D5B]" /> Mascota perdida
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#3B82F6]" /> Mascota encontrada
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" /> Refugio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#DC2626]" /> Veterinaria
            </span>
          </div>
        </div>

        {/* CONTENEDOR DE MAPA */}
        <div className="w-full h-[480px] bg-white rounded-b-2xl border border-slate-200 overflow-hidden shadow-sm">
          <MapComponent reportes={reportesFiltrados} />
        </div>

        {/* BOTÓN VER TODOS LOS REPORTES */}
        <div className="text-center mt-8">
          <Link
            href="/reportes"
            className="inline-block bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold px-8 py-3.5 rounded-xl transition-all text-sm shadow-sm"
          >
            Ver todos los reportes
          </Link>
        </div>
      </section>

      {/* 15. ESTADÍSTICAS */}
      <section className="bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1F2937]">VeciPets en acción</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold text-[#2E7D5B]">142</p>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mt-2">Mascotas reportadas</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold text-[#2E7D5B]">89</p>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mt-2">Mascotas encontradas</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold text-[#2E7D5B]">53</p>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mt-2">Reportes activos</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-extrabold text-[#2E7D5B]">12</p>
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mt-2">Refugios aliados</p>
            </div>
          </div>
        </div>
      </section>

      {/* 18. CTA FINAL */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-10 lg:p-16 text-center shadow-sm relative overflow-hidden">
          <h2 className="text-3xl font-bold text-[#1F2937]">¿Has perdido o encontrado una mascota?</h2>
          <p className="text-[#6B7280] mt-3 text-base max-w-lg mx-auto">
            Tu reporte puede marcar la diferencia para lograr reunir una familia en Medellín.
          </p>
          <div className="mt-8">
            <Link
              href="/reportes/nuevo"
              className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white font-semibold px-8 py-4 rounded-xl transition-all text-base inline-block shadow-md"
            >
              Crear reporte
            </Link>
          </div>
        </div>
      </section>

      {/* 19. FOOTER */}
      <footer className="bg-[#1F2937] text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🐾</span>
              <span className="font-bold text-xl text-white">VeciPets</span>
            </div>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Conectamos comunidades y actores autorizados para ayudar a encontrar mascotas perdidas en Medellín.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Navegación</h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/mapa" className="hover:text-white transition-colors">Mapa</Link></li>
              <li><Link href="/reportes/nuevo" className="hover:text-white transition-colors">Reportar mascota</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Aliados</h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li><Link href="/refugios" className="hover:text-white transition-colors">Refugios</Link></li>
              <li><Link href="/veterinarias" className="hover:text-white transition-colors">Veterinarias</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-3">Soporte</h4>
            <ul className="space-y-2 text-xs text-[#6B7280]">
              <li><Link href="/ayuda" className="hover:text-white transition-colors">Centro de ayuda</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition-colors">Términos de servicio</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-800 text-center text-xs text-[#6B7280]">
          © 2026 VeciPets Medellín. Todos los derechos reservados.
        </div>
      </footer>

    </div>
  );
}