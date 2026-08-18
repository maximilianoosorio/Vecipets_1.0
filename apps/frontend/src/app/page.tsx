'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/home/Hero';
import AlertsSection from '@/components/home/AlertsSection';
import MapSection from '@/components/home/MapSection';
import HowItWorks from '@/components/home/HowItWorks';
import SupportPlaces from '@/components/home/SupportPlaces';
import FinalCTA from '@/components/home/FinalCTA';
import { fetchAPI } from '@/lib/api-client';


export default function HomePage() {
  const [reportes, setReportes] = useState<any[]>([]);

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