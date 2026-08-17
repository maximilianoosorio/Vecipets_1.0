import Link from 'next/link';

interface AlertsSectionProps {
  reportes: any[];
}

export default function AlertsSection({ reportes }: AlertsSectionProps) {
  const reportesMostrar = reportes.slice(0, 3);

  const getBadgeStyle = (tipo: string) => {
    const t = tipo.toUpperCase();
    if (t === 'PERDIDO') return 'bg-[#5E7BC4]/15 text-[#5E7BC4]';
    if (t === 'ENCONTRADO') return 'bg-[#16A34A]/15 text-[#16A34A]';
    if (t === 'PENDIENTE') return 'bg-[#F3B26C]/25 text-[#d97706]';
    return 'bg-[#DC2626]/15 text-[#DC2626]';
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#292A2F]">
              Últimos reportes
            </h2>
            <p className="text-xs sm:text-sm text-[#53627A] mt-1">
              Consulta las mascotas perdidas y encontradas publicadas por la comunidad.
            </p>
          </div>
          <Link
            href="/reportes"
            className="text-xs sm:text-sm font-semibold text-[#5E7BC4] hover:text-[#4F6FB8] transition-colors"
          >
            Ver todos los reportes →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportesMostrar.map((item) => {
            const tipo = (item.tipoReporte || item.tipo_reporte || 'PERDIDO').toUpperCase();
            const listaFotos = item.imagenes || item.fotos || [];
            const fotoUrl = listaFotos[0]?.urlCloudinary || listaFotos[0]?.url || '';
            const fecha = item.fechaEvento || item.fecha_evento;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-[24px] overflow-hidden shadow-xs hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-[#EEF2FC] overflow-hidden flex items-center justify-center">
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={item.mascota?.nombre || 'Mascota'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-slate-400">🐾</span>
                    )}

                    <span className={`absolute top-3.5 right-3.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs ${getBadgeStyle(tipo)}`}>
                      {tipo === 'PERDIDO' ? '🐾 Mascota perdida' : '🐾 Mascota encontrada'}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base font-bold text-[#292A2F] truncate">
                      {item.mascota?.nombre || (tipo === 'PERDIDO' ? 'Sin nombre registrado' : 'Mascota rescatada')}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-[#53627A]">
                      <span className="truncate max-w-[150px]">📍 {item.direccion || 'Medellín'}</span>
                      <span>{fecha ? new Date(fecha).toLocaleDateString() : 'Reciente'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/reportes/${item.id}`}
                    className="w-full bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs font-semibold py-2.5 rounded-full transition-all text-center block shadow-2xs"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/reportes"
            className="inline-block bg-[#5E7BC4] hover:bg-[#4F6FB8] text-white text-xs sm:text-sm font-semibold px-8 py-3.5 rounded-full transition-all shadow-sm"
          >
            Ver todos los reportes
          </Link>
        </div>

      </div>
    </section>
  );
}