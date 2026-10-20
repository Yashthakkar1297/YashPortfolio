import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../types/portfolio';

// A full screen showing a project's landscape slides one after another.
export default function ProjectViewer({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <motion.div role="dialog" aria-modal="true" aria-label={project.title}
      className="fixed inset-0 z-[58] overflow-y-auto bg-[#0a0c0e]/95 pb-12 backdrop-blur-xl"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: 0.3 }}>
      <div className="sticky top-0 z-10 border-b border-white/15 bg-[#0a0c0e]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <h2 className="hero-heading text-3xl font-semibold sm:text-4xl">{project.title}</h2>
          <button onClick={onClose} className="rounded-full border border-white/35 bg-white/10 px-5 py-2 text-sm font-medium text-white transition hover:bg-white/20">Close</button>
        </div>
      </div>
      <div className="mx-auto grid max-w-[84rem] gap-6 px-6 pb-4 pt-8">
        {(project.pages ?? []).map((src, i) => (
          <img key={src} src={src} alt={`${project.title}, slide ${i + 1}`} loading="lazy" draggable={false}
            className="block aspect-video h-auto w-full rounded-xl bg-white object-contain shadow-2xl shadow-black/50" />
        ))}
      </div>
    </motion.div>
  );
}
