import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="bg-[#5E7BC4] text-white py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Juntos podemos ayudar a encontrar más mascotas.
        </h2>
        <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
          Cada reporte puede hacer la diferencia.
        </p>
        <div className="pt-3">
          <Link
            href="/reportar"
            className="inline-block bg-[#F3B26C] hover:bg-[#e29e54] text-white font-semibold text-sm sm:text-base px-8 py-3.5 rounded-full transition-all duration-200 shadow-md"
          >
            Registrar mascota
          </Link>
        </div>
      </div>
    </section>
  );
}