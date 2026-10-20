import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

export const NAV_LINKS = [
  { label: 'HOME', id: 'home' }, { label: 'ABOUT', id: 'about' }, { label: 'PROJECTS', id: 'projects' }, { label: 'CONTACT', id: 'contact' },
];

export default function Navbar() {
  const { shortName } = usePortfolio();
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#home" className="hero-heading text-xl font-semibold">{shortName}</a>
        <ul className="hidden gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} className="text-sm tracking-widest text-zinc-300 transition hover:text-white">{l.label}</a></li>
          ))}
        </ul>
        <button className="text-zinc-200 md:hidden" aria-label="Toggle menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && (
        <ul className="border-t border-white/10 bg-black/80 px-6 py-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <li key={l.id}><a href={`#${l.id}`} onClick={() => setOpen(false)} className="block py-2 text-zinc-200">{l.label}</a></li>
          ))}
        </ul>
      )}
    </header>
  );
}
