import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import type { Experience } from '../types/portfolio';
import ExperienceIcon from './ExperienceIcon';
import ResumeModal from './ResumeModal';

const VISIBLE = 3; // rows on screen at once; the middle one is the focused row
const SCROLL_PER_ROW = 60; // vh of scrolling for each experience
const FADE = 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)';

function useRowHeight() {
  const calc = () => Math.max(120, Math.min(190, Math.floor((window.innerHeight - 300) / VISIBLE)));
  const [h, setH] = useState(calc);
  useEffect(() => { const f = () => setH(calc()); window.addEventListener('resize', f); return () => window.removeEventListener('resize', f); }, []);
  return h;
}

function Row({ e, i, pos, height }: { e: Experience; i: number; pos: MotionValue<number>; height: number }) {
  // Focused row is fully clear; the rows above and below dim as they move away.
  const opacity = useTransform(pos, (v) => { const d = Math.abs(i - v); return d <= 1 ? 1 - 0.55 * d : Math.max(0, 0.45 - (d - 1) * 0.9); });
  const scale = useTransform(pos, (v) => 1 - Math.min(Math.abs(i - v), 1.5) * 0.04);
  return (
    <motion.article style={{ height, opacity, scale }} className="grid grid-cols-[auto_1fr] items-center gap-5 overflow-hidden border-t border-white/15 sm:gap-8 md:grid-cols-[auto_1fr_auto]">
      <span className="hero-heading text-3xl font-semibold sm:text-4xl">{String(i + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <h3 className="text-lg font-medium text-white sm:text-2xl">{e.company} — {e.role}</h3>
        <p className="mt-1 text-sm text-zinc-400">{e.location}</p>
        {e.summary && <p className="mt-2 line-clamp-2 text-sm text-zinc-300">{e.summary}</p>}
        {e.highlights.length > 0 && <p className="mt-1 truncate text-sm text-zinc-400">{e.highlights.slice(0, 3).join(' · ')}</p>}
        <span className="mt-3 inline-block rounded-full border border-white/25 px-3 py-1 font-mono text-xs text-zinc-300 md:hidden">{e.period}</span>
      </div>
      <span className="hidden rounded-full border border-white/25 px-3 py-1 font-mono text-xs text-zinc-300 md:inline-block">{e.period}</span>
    </motion.article>
  );
}

const OUTLINE = 'drop-shadow(2px 0 0 #fff) drop-shadow(-2px 0 0 #fff) drop-shadow(0 2px 0 #fff) drop-shadow(0 -2px 0 #fff) drop-shadow(0 8px 12px rgba(0,0,0,0.45))';

// One logo per job, stacked in the same spot; the one for the job in focus fades in as the others fade out.
function RailLogo({ src, index, pos }: { src: string; index: number; pos: MotionValue<number> }) {
  const opacity = useTransform(pos, (v) => Math.max(0, 1 - Math.abs(index - v) * 2.2));
  const scale = useTransform(pos, (v) => 0.85 + 0.15 * Math.max(0, 1 - Math.abs(index - v) * 2.2));
  return (
    <motion.img src={src} alt="" draggable={false} style={{ opacity, scale, filter: OUTLINE }}
      className="absolute right-0 top-1/2 h-12 max-w-[5.5rem] -translate-y-1/2 select-none object-contain object-right sm:h-16 sm:max-w-[8rem]" />
  );
}

export default function ExperienceSection() {
  const { experience, resume } = usePortfolio();
  const [showResume, setShowResume] = useState(false);
  const n = experience.length;
  const reduce = useReducedMotion();
  const rowH = useRowHeight();
  const secRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({ target: secRef, offset: ['start start', 'end end'] });
  const raw = useTransform(scrollYProgress, [0, 1], [0, Math.max(0, n - 1)]); // which experience is in focus (0 … n-1)
  const spring = useSpring(raw, { stiffness: 90, damping: 24, mass: 0.6 });
  const pos = reduce ? raw : spring;

  const rowHMV = useMotionValue(rowH);
  useEffect(() => { rowHMV.set(rowH); }, [rowH, rowHMV]);
  const y = useTransform([pos, rowHMV], (v: number[]) => v[1] * (1 - v[0])); // keeps the focused row in the middle slot
  const dotTop = useTransform(pos, (v) => `${n > 1 ? (v / (n - 1)) * 100 : 0}%`);

  return (
    <section id="experience" ref={secRef} className="relative" style={{ height: `calc(100vh + ${Math.max(0, n - 1) * SCROLL_PER_ROW}vh)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16">
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="hero-heading mb-8 text-4xl font-semibold sm:text-6xl">Work experience</h2>
          <div className="grid items-center gap-6 md:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] md:gap-10">
          <div className="hidden md:block"><ExperienceIcon height={rowH * VISIBLE} focus={pos} still={!!reduce} onOpen={() => setShowResume(true)} /></div>
          <div className="flex gap-5 sm:gap-8">
            {/* slider rail: the company logo of the job in focus travels up and down it as you scroll */}
            <div className="relative w-24 shrink-0 sm:w-36" style={{ height: rowH * VISIBLE }} aria-hidden>
              <div className="absolute inset-y-0 right-0 w-px bg-white/25" />
              {experience.map((_, i) => (
                <span key={i} className="absolute right-0 h-px w-2.5 bg-white/40" style={{ top: `${n > 1 ? (i / (n - 1)) * 100 : 0}%` }} />
              ))}
              <motion.div className="absolute right-3 -translate-y-1/2" style={{ top: dotTop }}>
                {experience.map((e, i) => e.logo && <RailLogo key={e.company} src={e.logo} index={i} pos={pos} />)}
              </motion.div>
            </div>
            {/* three rows visible, fading out at the top and bottom ends */}
            <div className="min-w-0 flex-1 overflow-hidden" style={{ height: rowH * VISIBLE, maskImage: FADE, WebkitMaskImage: FADE }}>
              <motion.div style={{ y }}>
                {experience.map((e, i) => <Row key={`${e.company}-${i}`} e={e} i={i} pos={pos} height={rowH} />)}
              </motion.div>
            </div>
          </div>
          </div>
        </div>
      </div>
      <AnimatePresence>{showResume && <ResumeModal resume={resume} onClose={() => setShowResume(false)} />}</AnimatePresence>
    </section>
  );
}
