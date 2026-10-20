import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import type { Project } from '../types/portfolio';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ProjectViewer from './ProjectViewer';
import AllProjectsScreen from './AllProjectsScreen';

const GAP = 24;
const FADE = 'linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%)';

// Card size and how far the row has to travel, based on the screen width.
function useLayout(count: number) {
  const [l, setL] = useState({ cardW: 360, pad: 24, shift: 0 });
  useEffect(() => {
    const calc = () => {
      const vw = window.innerWidth;
      const cardW = vw < 640 ? Math.round(vw * 0.86) : Math.min(820, Math.max(340, Math.round(vw * 0.4)));
      const pad = vw < 640 ? 24 : Math.max(24, Math.round((vw - (3 * cardW + 2 * GAP)) / 2)); // centres 3 folders
      const total = pad * 2 + count * cardW + (count - 1) * GAP;
      setL({ cardW, pad, shift: Math.max(0, total - vw) });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [count]);
  return l;
}

export default function ProjectsSection() {
  const { sortedProjects } = usePortfolio();
  const reduce = useReducedMotion();
  const { cardW, pad, shift } = useLayout(sortedProjects.length);
  const [active, setActive] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [viewer, setViewer] = useState<Project | null>(null);
  const openProject = (p: Project) => (p.layout === 'screen' ? setViewer(p) : setActive(p));
  const [grabbing, setGrabbing] = useState(false);
  const secRef = useRef<HTMLElement>(null);
  const dragged = useRef(false);
  const drag = useRef<{ x: number; y: number; lo: number; hi: number; on: boolean } | null>(null);

  // Scrolling down moves the row sideways: page progress -> horizontal position.
  const { scrollYProgress } = useScroll({ target: secRef, offset: ['start start', 'end end'] });
  const shiftMV = useMotionValue(0);
  useEffect(() => { shiftMV.set(shift); }, [shift, shiftMV]);
  const raw = useTransform([scrollYProgress, shiftMV], (v: number[]) => -v[0] * v[1]);
  const spring = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.6 });
  const x = reduce ? raw : spring;

  const secTop = () => (secRef.current ? secRef.current.getBoundingClientRect().top + window.scrollY : 0);

  // Press and hold, then drag sideways: it scrolls the page by the same distance.
  const onDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const top = secTop();
    drag.current = { x: e.clientX, y: window.scrollY, lo: Math.min(top, window.scrollY), hi: Math.max(top + shift, window.scrollY), on: false };
  };
  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.on && Math.abs(dx) > 6) { d.on = true; dragged.current = true; setGrabbing(true); e.currentTarget.setPointerCapture(e.pointerId); }
    if (d.on) window.scrollTo({ top: Math.max(d.lo, Math.min(d.hi, d.y - dx)), behavior: 'instant' });
  };
  const onUp = () => { drag.current = null; setGrabbing(false); setTimeout(() => { dragged.current = false; }, 60); };

  const step = cardW + GAP;
  const nudge = (dir: 1 | -1) => {
    const current = scrollYProgress.get() * shift;
    const target = Math.max(0, Math.min(shift, (Math.round(current / step) + dir) * step));
    window.scrollTo({ top: secTop() + target, behavior: 'smooth' });
  };

  return (
    <section id="projects" ref={secRef} className="relative" style={{ height: `calc(100vh + ${shift}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-start overflow-hidden pt-24">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-6">
          <h2 className="hero-heading text-4xl font-semibold sm:text-6xl">Projects</h2>
          <div className="flex items-center gap-3">
            <button onClick={() => nudge(-1)} aria-label="Previous projects" className="rounded-full border border-black/20 bg-white/70 p-3 text-zinc-900 transition hover:bg-white"><ChevronLeft size={20} /></button>
            <button onClick={() => nudge(1)} aria-label="Next projects" className="rounded-full border border-black/20 bg-white/70 p-3 text-zinc-900 transition hover:bg-white"><ChevronRight size={20} /></button>
          </div>
        </div>

        {/* Full screen width; folders fade out toward both ends of the screen. */}
        <div
          className="mt-8 select-none"
          style={{ touchAction: 'pan-y', cursor: grabbing ? 'grabbing' : 'grab', maskImage: FADE, WebkitMaskImage: FADE }}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        >
          <motion.div className="flex items-center pb-8 pt-12" style={{ x, gap: GAP, paddingLeft: pad, paddingRight: pad }}>
            {sortedProjects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} width={cardW} onOpen={(proj) => { if (!dragged.current) openProject(proj); }} />
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center pt-2">
          <button onClick={() => setShowAll(true)} className="border-b border-white/60 px-4 py-2 text-lg font-medium tracking-wide text-white transition hover:border-white hover:opacity-85">See all projects</button>
        </div>
      </div>
      <AnimatePresence>{showAll && <AllProjectsScreen projects={sortedProjects} blocked={!!active || !!viewer} onOpen={openProject} onClose={() => setShowAll(false)} />}</AnimatePresence>
      <AnimatePresence>{viewer && <ProjectViewer project={viewer} onClose={() => setViewer(null)} />}</AnimatePresence>
      <AnimatePresence>{active && <ProjectModal project={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
