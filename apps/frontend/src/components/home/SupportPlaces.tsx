import Link from 'next/link';

export default function SupportPlaces() {
  const lugares = [
    {
      id: 'lp-1',
      tipo: 'REFUGIO',
      nombre: 'Centro de Bienestar Animal La Perla',
      ubicacion: 'San Cristóbal, Medellín',
      descripcion: 'Entidad oficial de protección, atención médica y resguardo de animales.',
      link: '/refugios',
      btnText: 'Ver refugios',
    },
    {
      id: 'lp-2',
      tipo: 'VETERINARIA',
      nombre: 'Red Veterinaria de Apoyo Comunitario',
      ubicacion: 'Valle de Aburrá, Medellín',
      descripcion: 'Establecimientos asociados para verificación médica y lectura de microchip.',
      link: '/veterinarias',
      btnText: 'Ver veterinarias',
    },
  ];

  return (
    <section className="bg-[#EEF2FC]/40 py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
            Encuentra lugares de apoyo
          </h2>
          <p className="text-xs sm:text-sm text-[#53627A]">
            Refugios y veterinarias que hacen parte de nuestra red de asistencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {lugares.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  item.tipo === 'REFUGIO' ? 'bg-[#5E7BC4]/15 text-[#5E7BC4]' : 'bg-[#F3B26C]/25 text-[#d97706]'
                }`}>
                  {item.tipo}
                </span>
                <h3 className="text-lg font-bold text-[#292A2F]">{item.nombre}</h3>
                <p className="text-xs text-[#53627A]">📍 <strong>Ubicación:</strong> {item.ubicacion}</p>
                <p className="text-xs text-[#53627A] leading-relaxed">{item.descripcion}</p>
              </div>

              <div className="pt-2">
                <Link
                  href={item.link}
                  className="inline-block bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-all shadow-2xs"
                >
                  {item.btnText}
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}