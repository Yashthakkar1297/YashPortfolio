import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types/portfolio';
import { folderWidthPct } from '../lib/folderSize';

// A full screen with every project folder. Click one to open it (the project panel opens on top).
export default function AllProjectsScreen({ projects, onOpen, onClose, blocked }: { projects: Project[]; onOpen: (p: Project) => void; onClose: () => void; blocked: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !blocked) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, blocked]);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label="All projects"
      className="fixed inset-0 z-[55] overflow-y-auto bg-[#0a0c0e]/90 pb-12 backdrop-blur-xl"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }}>
      <div className="sticky top-0 z-10 border-b border-white/15 bg-[#0a0c0e]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <h2 className="hero-heading text-3xl font-semibold sm:text-4xl">All projects</h2>
          <button onClick={onClose} className="rounded-full border border-white/35 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20">Close</button>
        </div>
      </div>
      <div className="mx-auto grid max-w-6xl gap-x-8 gap-y-10 px-6 pb-4 pt-12 md:grid-cols-2">
        {projects.map((p) => (
          <button key={p.id} onClick={() => onOpen(p)} aria-label={`Open ${p.title}`} className="group flex flex-col items-center gap-4 text-white focus:outline-none">
            <div className="flex aspect-[1500/1250] w-full items-center justify-center">
              <img src={p.folder} alt={p.title} loading="lazy" draggable={false} style={{ width: folderWidthPct(p.aspect) }}
                className="block h-auto drop-shadow-[0_18px_28px_rgba(0,0,0,0.45)] transition duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03] group-focus-visible:-translate-y-2" />
            </div>
            <span className="text-lg font-medium text-zinc-200">{p.title}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
