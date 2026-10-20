import { motion, useReducedMotion } from 'framer-motion';
import type { Project } from '../types/portfolio';
import { folderWidthPct } from '../lib/folderSize';

interface Props { project: Project; index: number; width: number; onOpen: (p: Project) => void; }

// Each project is shown as its own folder artwork (a transparent image).
export default function ProjectCard({ project, width, onOpen }: Props) {
  const reduce = useReducedMotion();
  return (
    <div className="flex shrink-0 items-center" style={{ width }}>
      <motion.button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Open ${project.title}`}
        initial={false}
        animate={{ rotate: 0, y: 0 }}
        whileHover={reduce ? undefined : { y: -10, scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
        className="flex aspect-[1500/1250] w-full items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <img
          src={project.folder}
          alt={project.title}
          style={{ width: folderWidthPct(project.aspect) }}
          className="block h-auto select-none drop-shadow-[0_18px_28px_rgba(0,0,0,0.35)]"
          loading="lazy"
          draggable={false}
        />
      </motion.button>
    </div>
  );
}
