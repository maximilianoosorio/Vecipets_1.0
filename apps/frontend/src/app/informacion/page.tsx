import HowItWorks from '@/components/home/HowItWorks';
import SupportPlaces from '@/components/home/SupportPlaces';
import FinalCTA from '@/components/home/FinalCTA';

export const metadata = {
  title: 'Información y Cómo Funciona | VeciPets',
  description: 'Conoce cómo VeciPets ayuda a reunir mascotas con sus familias mediante alertas, mapa y red de apoyo.',
};

export default function InformacionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* SECCIÓN EXPLICATIVA */}
      <HowItWorks />

      {/* RED DE APOYO */}
      <SupportPlaces />

      {/* CTA */}
      <FinalCTA />
    </div>
  );
}