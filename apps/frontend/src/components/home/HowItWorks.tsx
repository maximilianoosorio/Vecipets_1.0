export default function HowItWorks() {
  const pasos = [
    {
      num: '1',
      title: 'Registra',
      desc: 'Registra tu mascota y sus características detalladas.',
      icon: '📝',
    },
    {
      num: '2',
      title: 'Reporta',
      desc: 'Publica una alerta si se pierde o encuentras una mascota.',
      icon: '📢',
    },
    {
      num: '3',
      title: 'Busca',
      desc: 'Consulta las alertas y utiliza el mapa para encontrar coincidencias.',
      icon: '🔍',
    },
    {
      num: '4',
      title: 'Recupera',
      desc: 'Facilita el proceso de reunificación de la mascota con su familia.',
      icon: '❤️',
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
            ¿Cómo funciona VeciPets?
          </h2>
          <p className="text-xs sm:text-sm text-[#53627A]">
            Un proceso paso a paso para reunir a las mascotas con sus hogares.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pasos.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-[24px] border border-slate-100 hover:-translate-y-1 transition-all text-left space-y-3 shadow-2xs"
            >
              <div className="w-12 h-12 rounded-full bg-[#EEF2FC] text-[#5E7BC4] flex items-center justify-center text-xl font-bold">
                {p.icon}
              </div>
              <h3 className="text-base font-bold text-[#292A2F]">{p.num}. {p.title}</h3>
              <p className="text-xs text-[#53627A] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}