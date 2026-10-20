import { useEffect } from 'react';

// A small glowing hollow ring that replaces the mouse arrow.
// Texture from "Boost Ring" by Jakob Henerey (CC BY 4.0) – credited in the footer.
const SIZE = 38; // px

export default function RingCursor() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return; // touch screens keep normal behaviour
    const el = document.createElement('div');
    Object.assign(el.style, { position: 'fixed', left: '0', top: '0', width: SIZE + 'px', height: SIZE + 'px', pointerEvents: 'none', zIndex: '99999', opacity: '0', transition: 'opacity .2s', willChange: 'transform' });
    const img = document.createElement('img');
    img.src = '/ring-cursor.png'; img.alt = ''; img.draggable = false;
    Object.assign(img.style, { width: '100%', height: '100%', display: 'block' });
    img.animate([{ transform: 'scale(.92)', opacity: 0.85 }, { transform: 'scale(1.06)', opacity: 1 }], { duration: 1400, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
    el.appendChild(img); document.body.appendChild(el);
    const style = document.createElement('style');
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    let x = -100, y = -100, tx = -100, ty = -100, scale = 1, target = 1, seen = false, raf = 0;
    const move = (e: PointerEvent) => {
      tx = e.clientX; ty = e.clientY; if (!seen) { x = tx; y = ty; seen = true; el.style.opacity = '1'; }
      target = (e.target as HTMLElement | null)?.closest?.('a,button,[role="button"],input,textarea,select,video') ? 1.5 : 1;
    };
    const leave = () => { el.style.opacity = '0'; seen = false; };
    window.addEventListener('pointermove', move); document.documentElement.addEventListener('mouseleave', leave);
    const loop = () => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.45; y += (ty - y) * 0.45; scale += (target - scale) * 0.2;
      el.style.transform = `translate(${x - SIZE / 2}px, ${y - SIZE / 2}px) scale(${scale})`;
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('mouseleave', leave); el.remove(); style.remove(); };
  }, []);
  return null;
}
