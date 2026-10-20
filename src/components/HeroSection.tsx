import { motion, useReducedMotion } from 'framer-motion';
import { usePortfolio } from '../hooks/usePortfolio';
import SocialLinks from './SocialLinks';
import Avatar3D from './Avatar3D';

export default function HeroSection() {
  const { profile, shortName } = usePortfolio();
  const reduce = useReducedMotion();
  return (
    <section id="home" className="flex min-h-screen flex-col items-center justify-center px-6 pb-12 pt-24 text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center">
        <h1 className="hero-heading text-5xl font-semibold leading-tight sm:text-7xl lg:text-8xl">Hi, I'm {shortName}</h1>
        <div className="relative my-4">
          <div aria-hidden className="absolute inset-x-[15%] inset-y-[15%] rounded-full opacity-25 blur-3xl" style={{ background: 'linear-gradient(135deg,#8b5cf6,#d946ef,#fb923c)' }} />
          <div className="relative"><Avatar3D alt={profile.name} still={!!reduce} /></div>
        </div>
        <p className="text-xl text-zinc-200 sm:text-2xl">{profile.tagline}</p>
        <p className="mt-1 text-sm text-zinc-400">{profile.location} · {profile.yearsOfExperience}</p>
        <SocialLinks className="mt-8 justify-center" />
        <a href="#projects" className="btn-accent mt-8 rounded-full px-8 py-3">View projects</a>
      </motion.div>
    </section>
  );
}
