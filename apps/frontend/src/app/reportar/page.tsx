'use client';

import Link from 'next/link';

export default function ReportesPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] py-8">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO CON BOTÓN PARA CREAR REPORTE */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              Reportes de Mascotas
            </h1>
            <p className="text-sm text-[#6B7280] mt-1">
              Explora las publicaciones activas de mascotas perdidas o encontradas.
            </p>
          </div>

          {/* Botón para crear un nuevo reporte */}
          <Link
            href="/reportes/crear"
            className="inline-flex items-center justify-center bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-sm font-semibold px-5 py-2.5 rounded-[10px] shadow-xs transition-colors"
          >
            + Publicar Reporte
          </Link>
        </div>

        {/* CONTENIDO DE LA LISTA / FILTROS DE REPORTES */}
        <div className="bg-white border border-slate-200 rounded-[14px] p-6">
          {/* Aquí va tu lista, filtros o cuadrícula de reportes */}
          <p className="text-slate-500 text-sm">Listado de reportes activos...</p>
        </div>

      </div>
    </main>
  );
}