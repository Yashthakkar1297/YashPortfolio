import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { NAV_LINKS } from './Navbar';
import SocialLinks from './SocialLinks';

export default function Footer() {
  const { profile } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.social.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard unavailable */ }
  };
  return (
    <footer id="contact" className="border-t border-white/15 px-6 pt-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-3">
        <div>
          <p className="hero-heading text-3xl font-semibold">{profile.name}</p>
          <p className="text-zinc-400">{profile.location}</p>
        </div>
        <div>
          <h4 className="mb-4 text-sm tracking-widest text-zinc-400">NAVIGATE</h4>
          <ul className="space-y-2">{NAV_LINKS.map((l) => <li key={l.id}><a href={`#${l.id}`} className="text-zinc-200 hover:text-white">{l.label}</a></li>)}</ul>
        </div>
        <div>
          <h4 className="mb-4 text-sm tracking-widest text-zinc-400">REACH OUT</h4>
          {profile.social.email && (
            <p className="flex items-center gap-2 text-zinc-200">
              <a href={`mailto:${profile.social.email}`} className="hover:text-white">{profile.social.email}</a>
              <button onClick={copy} aria-label="Copy email" className="rounded p-1 text-zinc-400 hover:text-white">{copied ? <Check size={16} /> : <Copy size={16} />}</button>
            </p>
          )}
          {profile.phone && <p className="mt-2 text-zinc-200">{profile.phone}</p>}
          <SocialLinks className="mt-4" />
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col justify-between gap-2 border-t border-white/15 py-6 text-sm text-zinc-400 sm:flex-row">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span>Cursor: “Boost Ring” by <a href="https://sketchfab.com/3d-models/boost-ring-65791b708f5d45dab22fb6be46255854" target="_blank" rel="noreferrer" className="underline">Jakob Henerey</a> (CC BY 4.0)</span>
      </div>
    </footer>
  );
}
