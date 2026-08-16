'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api-client';

interface Reporte {
    id: string;
    tipoReporte: 'PERDIDO' | 'ENCONTRADO';
    estado: string;
    descripcion: string;
    createdAt: string;
    mascota?: {
        nombre?: string;
        especie?: string;
    };
    imagenes?: { urlCloudinary: string }[];
}

export default function PerfilPage() {
    const router = useRouter();
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // 1. Verificación segura en cliente
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // 2. Consumo seguro de la API
        fetchAPI<Reporte[]>('/reportes/mis-reportes')
            .then((data) => {
                setReportes(data || []);
            })
            .catch((err) => {
                console.error('Error al cargar perfil:', err);
                setError('No se pudieron cargar tus reportes. Intenta de nuevo.');
            })
            .finally(() => {
                setCargando(false);
            });
    }, [router]);

    return (
        <main className="bg-[#F8FAF9] min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-[#1F2937]">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Encabezado */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <span className="inline-block bg-[#2E7D5B]/10 text-[#2E7D5B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                            Panel Ciudadano
                        </span>
                        <h1 className="text-3xl font-bold text-[#1F2937]">Mi Perfil</h1>
                        <p className="text-sm text-[#6B7280] mt-1">
                            Administra los reportes de mascotas que has publicado en VeciPets.
                        </p>
                    </div>
                    <Link
                        href="/reportes/nuevo"
                        className="bg-[#2E7D5B] hover:bg-[#4CAF78] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-xs"
                    >
                        + Nuevo Reporte
                    </Link>
                </div>

                {/* Estado de Carga / Error */}
                {cargando && (
                    <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center animate-pulse text-slate-500 text-sm">
                        Cargando tus reportes...
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-xl">
                        {error}
                    </div>
                )}

                {/* Lista de Reportes */}
                {!cargando && !error && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[#1F2937]">Mis Publicaciones ({reportes.length})</h2>

                        {reportes.length === 0 ? (
                            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center space-y-3">
                                <span className="text-4xl">🐾</span>
                                <p className="text-[#6B7280] text-sm">Aún no has creado ningún reporte de mascota.</p>
                                <Link
                                    href="/reportes/nuevo"
                                    className="inline-block bg-[#2E7D5B] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-[#4CAF78] transition-all"
                                >
                                    Crear mi primer reporte
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {reportes.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
                                        {item.imagenes?.[0] ? (
                                            <img
                                                src={item.imagenes[0].urlCloudinary}
                                                alt="Foto mascota"
                                                className="w-full h-44 object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-3xl">
                                                🐾
                                            </div>
                                        )}
                                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span
                                                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${item.tipoReporte === 'PERDIDO'
                                                                ? 'bg-amber-100 text-amber-800'
                                                                : 'bg-blue-100 text-blue-800'
                                                            }`}
                                                    >
                                                        {item.tipoReporte}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {new Date(item.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-slate-800 text-base">
                                                    {item.mascota?.nombre || 'Mascota sin nombre'}
                                                </h3>
                                                <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
                                                    {item.descripcion}
                                                </p>
                                            </div>

                                            <Link
                                                href={`/reportes/${item.id}`}
                                                className="w-full text-center bg-[#F8FAF9] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-all"
                                            >
                                                Ver Detalles
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </main>
    );
}