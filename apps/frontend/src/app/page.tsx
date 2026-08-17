'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import AlertsSection from '@/components/home/AlertsSection';
import MapSection from '@/components/home/MapSection';
import HowItWorks from '@/components/home/HowItWorks';
import SupportPlaces from '@/components/home/SupportPlaces';
import FinalCTA from '@/components/home/FinalCTA';
import { fetchAPI } from '@/lib/api-client';

const REPORTES_FALLBACK = [
  {
    id: 'rec-1',
    tipoReporte: 'PERDIDO',
    descripcion: 'Poblado, sector Provenza. Llevaba collar rojo.',
    latitud: 6.2085,
    longitud: -75.5675,
    direccion: 'El Poblado, Medellín',
    fechaEvento: '2026-08-14',
    mascota: { nombre: 'Max', especie: 'PERRO', raza: 'Criollo' },
    imagenes: [{ urlCloudinary: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600' }],
  },
  {
    id: 'rec-2',
    tipoReporte: 'ENCONTRADO',
    descripcion: 'Visto en el primer parque de Laureles.',
    latitud: 6.2425,
    longitud: -75.5925,
    direccion: 'Laureles, Medellín',
    fechaEvento: '2026-08-15',
    mascota: { nombre: 'Mimi', especie: 'GATO', raza: 'Siamés' },
    imagenes: [{ urlCloudinary: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600' }],
  },
  {
    id: 'rec-3',
    tipoReporte: 'PERDIDO',
    descripcion: 'Belén cerca a la estación del Metroplús.',
    latitud: 6.2312,
    longitud: -75.5998,
    direccion: 'Belén, Medellín',
    fechaEvento: '2026-08-16',
    mascota: { nombre: 'Toby', especie: 'PERRO', raza: 'Golden Retriever' },
    imagenes: [{ urlCloudinary: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600' }],
  },
];

export default function HomePage() {
  const [reportes, setReportes] = useState<any[]>(REPORTES_FALLBACK);

  useEffect(() => {
    let isMounted = true;

    fetchAPI('/reportes/publicos')
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setReportes(data);
        }
      })
      .catch((err) => {
        console.warn('API de reportes no conectada en local. Usando fallback:', err.message);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#292A2F] font-sans">
      {/* 1. NAVBAR: Renderizado global en app/layout.tsx */}

      {/* 2. HERO */}
      <Hero />

      {/* 3. ÚLTIMAS ALERTAS */}
      <AlertsSection reportes={reportes} />

      {/* 4. MAPA */}
      <MapSection reportes={reportes} />

      {/* 5. ¿CÓMO FUNCIONA? */}
      <HowItWorks />

      {/* 6. LUGARES DE APOYO */}
      <SupportPlaces />

      {/* 7. CTA FINAL */}
      <FinalCTA />

      {/* 8. FOOTER: Renderizado global en app/layout.tsx */}
      <footer/>
    </div>
  );
}