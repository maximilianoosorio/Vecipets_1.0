import Image from 'next/image';

interface Props {
  reporte: any;
}

export function ReporteCard({ reporte }: Props) {
  // 1. Extraer la URL intentando todos los nombres posibles
  const imagenUrl =
    reporte.fotoPrincipal ||
    reporte.imagenes?.[0]?.urlCloudinary ||
    reporte.imagenes?.[0]?.url ||
    reporte.mascota?.fotoUrl ||
    null;

  // Placeholder por si la mascota no tiene foto
  const placeholderImg = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80";

  const srcFinal = imagenUrl && imagenUrl.startsWith('http') ? imagenUrl : placeholderImg;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
        <Image
          src={srcFinal}
          alt={reporte.mascota?.nombre || 'Mascota reportada'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          unoptimized={srcFinal.includes('cloudinary.com')}
        />
        <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full text-white ${
          reporte.tipoReporte === 'PERDIDO' ? 'bg-rose-500' : 'bg-amber-500'
        }`}>
          {reporte.tipoReporte || 'AVISTADO'}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-slate-800 text-lg">
          {reporte.mascota?.nombre || 'Mascota sin nombre'}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2">
          {reporte.descripcion || 'Sin descripción disponible'}
        </p>
        <div className="text-xs text-slate-400 mt-auto pt-2 flex items-center gap-1 border-t border-slate-50">
          <span>📍</span> {reporte.direccion || 'Medellín, Antioquia'}
        </div>
      </div>
    </div>
  );
}