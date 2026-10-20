import { asset } from '../lib/asset';
import { useEffect, useRef } from 'react';

/** Photos fixed behind the whole site. The first one is replaced by the second as you scroll down to Projects. */
export default function ImageBackground() {
  const second = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = document.getElementById('projects'); const img = second.current;
      if (!el || !img) return;
      const vh = window.innerHeight, top = el.getBoundingClientRect().top;
      // starts fading when Projects is 90% down the screen, fully changed when it is 20% down
      const p = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.7)));
      img.style.opacity = String(p * p * (3 - 2 * p));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 -z-10 bg-[#0e1011]">
      <img src={asset('/bg.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" draggable={false} />
      <img ref={second} src={asset('/bg2.jpg')} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ opacity: 0 }} draggable={false} />
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
}
