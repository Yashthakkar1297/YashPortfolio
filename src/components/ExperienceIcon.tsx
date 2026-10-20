import { motion, type MotionValue } from 'framer-motion';

interface Props { height: number; focus: MotionValue<number>; still: boolean; onOpen?: () => void; }

// The resume folder: a soft glass folder picture whose bottom fades away. Click opens the resume.
export default function ExperienceIcon({ onOpen, still }: Props) {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[19rem] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      role="button" tabIndex={0} aria-label="Open resume"
      onClick={onOpen} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen?.(); } }}
      whileHover={still ? undefined : { y: -8, scale: 1.04 }} transition={{ type: 'spring', stiffness: 220, damping: 20 }}>
      <img src="/resume-folder.png" alt="" draggable={false} className="block h-auto w-full select-none drop-shadow-[0_18px_40px_rgba(60,110,255,0.35)]" />
    </motion.div>
  );
}
