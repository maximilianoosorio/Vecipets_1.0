import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import Navbar from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VeciPets — Red Comunitaria de Mascotas',
  description: 'Plataforma oficial para la gestión de mascotas perdidas y encontradas en Medellín.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}