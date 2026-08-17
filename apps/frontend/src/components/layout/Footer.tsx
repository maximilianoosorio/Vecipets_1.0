import Link from 'next/link';

export default function Footer() {
  const socialLinks = {
    instagram: '#',
    facebook: '#',
    tiktok: '#',
    youtube: '#',
    twitter: '#',
  };

  return (
    <footer className="bg-[#292A2F] text-white py-14 font-sans">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* COLUMNA 1: MARCA */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#5E7BC4] flex items-center justify-center text-white">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c-1.66 0-3 1.34-3 3 0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm-6-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-9-4C8 6 7.1 6.9 7.1 8s.9 2 2 2 2-.9 2-2-.9-2-2.1-2zm6 0c-.9 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">VeciPets</span>
            </div>
            <p className="text-xs text-[#D1D5DB] leading-relaxed">
              Una plataforma comunitaria para ayudar a encontrar mascotas perdidas y encontradas.
            </p>
            
            {/* REDES SOCIALES */}
            <div className="flex items-center gap-3 pt-2">
              <a href={socialLinks.instagram} aria-label="Instagram" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:text-[#5E7BC4] hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href={socialLinks.facebook} aria-label="Facebook" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:text-[#5E7BC4] hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 16 5h2V0h-3.8C10.5 0 9 1.5 9 4.667V8z"/></svg>
              </a>
              <a href={socialLinks.tiktok} aria-label="TikTok" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:text-[#5E7BC4] hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.74 1.35-.07 2.56-.91 2.98-2.19.16-.48.2-1 .19-1.51.03-4.5.01-9-.01-13.5z"/></svg>
              </a>
              <a href={socialLinks.twitter} aria-label="X / Twitter" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white hover:text-[#5E7BC4] hover:bg-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* COLUMNA 2: EXPLORA */}
          <div>
            <h4 className="text-xs font-bold text-[#5E7BC4] uppercase tracking-wider mb-3.5">
              Explora
            </h4>
            <ul className="space-y-2 text-xs text-[#D1D5DB]">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/reportes" className="hover:text-white transition-colors">Reportes</Link></li>
              <li><Link href="/mapa" className="hover:text-white transition-colors">Mapa</Link></li>
              <li><Link href="/refugios" className="hover:text-white transition-colors">Refugios</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: AYUDA */}
          <div>
            <h4 className="text-xs font-bold text-[#5E7BC4] uppercase tracking-wider mb-3.5">
              Ayuda
            </h4>
            <ul className="space-y-2 text-xs text-[#D1D5DB]">
              <li><Link href="/informacion" className="hover:text-white transition-colors">¿Cómo funciona?</Link></li>
              <li><Link href="/informacion" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/informacion" className="hover:text-white transition-colors">Soporte y contacto</Link></li>
            </ul>
          </div>

          {/* COLUMNA 4: LEGAL */}
          <div>
            <h4 className="text-xs font-bold text-[#5E7BC4] uppercase tracking-wider mb-3.5">
              Información
            </h4>
            <ul className="space-y-2 text-xs text-[#D1D5DB]">
              <li><Link href="/informacion" className="hover:text-white transition-colors">Términos y condiciones</Link></li>
              <li><Link href="/informacion" className="hover:text-white transition-colors">Política de privacidad</Link></li>
              <li><Link href="/informacion" className="hover:text-white transition-colors">Política de uso</Link></li>
            </ul>
          </div>

        </div>

        {/* COPYRIGHT INFERIOR */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <p>© 2026 VeciPets. Todos los derechos reservados. — Medellín, Colombia</p>
          <p className="flex items-center gap-1 text-[11px]">
            Hecho con <span className="text-rose-500">❤️</span> para ayudar a nuestras mascotas.
          </p>
        </div>
      </div>
    </footer>
  );
}