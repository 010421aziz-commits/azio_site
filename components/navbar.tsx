'use client';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const links = [['Биз жөнүндө','#about'],['Программалар','#programs'],['Устаздар','#teachers'],['Галерея','#gallery'],['Байланыш','#contact']];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState('');
  useEffect(() => { fetch('/api/site-settings', { cache: 'no-store' }).then((response) => response.ok ? response.json() : null).then((settings) => settings?.logo && setLogo(settings.logo)).catch(() => undefined); }, []);
  return (
    <header className={"fixed z-50 w-full shadow-card"}
      style={{ background: 'rgba(248,245,238,0.92)', backdropFilter: 'blur(18px)' }}>
      <div className="container-x flex h-14 items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <span className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-gold/50 shadow-gold transition group-hover:border-gold">
            {logo ? <img src={logo} alt="Quran Academy" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-xs text-slate-400">Q</span>}
          </span>
          <span>
            <b className="block text-sm tracking-[.18em] text-navy">QURAN ACADEMY</b>
            <small className="text-[10px] text-slate-500 tracking-widest">БИШКЕК · КЫРГЫЗСТАН</small>
          </span>
        </a>
        <nav className="hidden gap-8 lg:flex">
          {links.map(([t,h]) => (
            <a key={h} className="text-sm font-medium text-slate-600 hover:text-navy transition-colors duration-200 relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-gold after:transition-all hover:after:w-full" href={h}>{t}</a>
          ))}
        </nav>
        <a href="#contact" className="hidden lg:flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy/80 transition-all duration-300 shadow-card">
          Катталуу
        </a>
        <button aria-label="Меню" className="lg:hidden text-navy" onClick={() => setOpen(!open)}>
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="border-t border-gold/20 px-5 pb-6 lg:hidden" style={{ background: 'rgba(248,245,238,0.97)', backdropFilter: 'blur(18px)' }}>
          {links.map(([t,h]) => (
            <a key={h} onClick={() => setOpen(false)} className="flex items-center border-b border-slate-100 py-4 text-sm font-medium text-slate-700 hover:text-navy transition-colors" href={h}>{t}</a>
          ))}
          <a href="#contact" className="mt-4 block rounded-xl bg-navy py-3 text-center text-sm font-bold text-white">Катталуу</a>
        </div>
      )}
    </header>
  );
}