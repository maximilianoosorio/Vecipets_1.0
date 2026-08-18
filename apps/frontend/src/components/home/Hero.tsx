import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-[#EEF2FC] py-14 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA */}
          <div className="space-y-6 text-left">
            
            {/* BADGE CÁPSULA */}
            <div className="inline-flex items-center gap-2 bg-white text-[#5E7BC4] text-xs font-semibold px-4 py-2 rounded-full shadow-2xs">
              <svg className="w-4 h-4 text-[#5E7BC4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Red Segura y Verificada</span>
            </div>

            {/* TÍTULO */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#292A2F] leading-[1.1] tracking-tight">
              Reúne a las <br />
              mascotas con sus <br />
              familias.
            </h1>

            {/* DESCRIPCIÓN */}
            <p className="text-[#53627A] text-sm sm:text-base leading-relaxed max-w-[560px]">
              VeciPets es una plataforma comunitaria diseñada para reportar de forma eficiente mascotas perdidas y encontradas, conectando a la comunidad y facilitando su recuperación.
            </p>

            {/* BOTONES AZUL (#5E7BC4) Y NARANJA (#F3B26C) */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/reportes"
                className="bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9-4C8 6 7.1 6.9 7.1 8s.9 2 2 2 2-.9 2-2-.9-2-2.1-2zm6 0c-.9 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                Ver reportes
              </Link>
              <Link
                href="/reportar"
                className="bg-[#F3B26C] hover:bg-[#e29e54] text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all duration-200 shadow-sm text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar mascota
              </Link>
            </div>

          </div>

          {/* COLUMNA DERECHA */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-[500px] h-[360px] sm:h-[430px] rounded-[28px] overflow-hidden shadow-md border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=80"
                alt="Perro y gatos juntos en un hogar seguro"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}