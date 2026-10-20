import { asset } from '../lib/asset';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const VIDEOS = [
  { src: '/videos/denim.mp4', poster: '/videos/denim.jpg', label: '100% denim for the journey' },
  { src: '/videos/funfair.mp4', poster: '/videos/funfair.jpg', label: 'Reliving our youth with all the rides of the funfair' },
];

// Two videos in identical 9:16 frames, side by side. They play only while on screen.
export default function VideoSection() {
  const reduce = useReducedMotion();
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      const v = e.target as HTMLVideoElement;
      if (e.isIntersecting && !reduce) v.play().catch(() => {}); else v.pause();
    }), { threshold: 0.25 });
    refs.current.forEach((v) => v && io.observe(v));
    return () => io.disconnect();
  }, [reduce]);
  return (
    <section id="reel" aria-label="Campaign videos" className="px-6 pb-0 pt-8">
      <div className="mx-auto grid max-w-[70rem] grid-cols-1 gap-6 md:grid-cols-2">
        {VIDEOS.map((v, i) => (
          <div key={v.src} className="relative aspect-[3/2] overflow-hidden rounded-2xl [-webkit-mask-image:linear-gradient(to_bottom,#000_50%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_50%,transparent_100%)]">
            <video ref={(el) => { refs.current[i] = el; }} src={asset(v.src)} poster={asset(v.poster)} aria-label={v.label}
              muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
