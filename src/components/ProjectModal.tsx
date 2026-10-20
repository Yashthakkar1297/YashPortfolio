import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '../types/portfolio';

export default function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal="true" aria-label={project.title}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-black/10 bg-white shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black">
          <X size={18} />
        </button>
        <div className="aspect-[16/9] bg-gradient-to-br from-[#f7f7f8] to-[#e4e4e7]">
          {project.image ? (
            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-4"><img src={project.folder} alt={project.title} className="max-h-full max-w-full object-contain" /></div>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <h3 className="text-3xl font-semibold text-zinc-900">{project.title}</h3>
          <p className="mt-1 text-zinc-500">{[project.subtitle, project.role, project.year].filter(Boolean).join(' · ')}</p>
          {project.description && <p className="mt-5 text-zinc-700">{project.description}</p>}
          {project.stack.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((s) => <li key={s} className="rounded-full border border-black/15 px-3 py-1 text-xs text-zinc-600">{s}</li>)}
          </ul>}
          {project.pages && project.pages.length > 0 && (
            <div className="mt-6 space-y-4 rounded-xl bg-zinc-100 p-3 sm:p-4">
              {project.pages.map((src, i) => (
                <img key={src} src={src} alt={`${project.title}, page ${i + 1}`} loading="lazy" className="block w-full rounded-md bg-white shadow" draggable={false} />
              ))}
            </div>
          )}
          {project.link.trim() !== '' && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-accent mt-6 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm">
              LIVE PROJECT <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
