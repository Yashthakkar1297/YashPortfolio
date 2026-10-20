import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import type { Resume } from '../types/portfolio';

export default function ResumeModal({ resume, onClose }: { resume: Resume; onClose: () => void }) {
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
      <motion.div role="dialog" aria-modal="true" aria-label={resume.title}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between gap-3 border-b border-black/10 px-5 py-3 sm:px-6">
          <h3 className="text-xl font-semibold text-zinc-900">{resume.title}</h3>
          <div className="flex items-center gap-2">
            <a href={resume.pdf} download={resume.downloadName} className="btn-accent inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm">
              <Download size={16} /> Download PDF
            </a>
            <button onClick={onClose} aria-label="Close" className="rounded-full bg-black/60 p-2 text-white hover:bg-black"><X size={18} /></button>
          </div>
        </div>
        <div className="space-y-4 overflow-y-auto bg-zinc-100 p-3 sm:p-5">
          {resume.pages.map((src, i) => (
            <img key={src} src={src} alt={`${resume.title}, page ${i + 1}`} className="block w-full rounded-md bg-white shadow" draggable={false} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
