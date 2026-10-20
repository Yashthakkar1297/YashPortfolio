const TOOLS = [
  ['photoshop', 'Photoshop'],
  ['procreate', 'Procreate'],
  ['claude', 'Claude'],
  ['illustrator', 'Illustrator'],
  ['rhino', 'Rhino'],
  ['creative-cloud', 'Creative Cloud'],
  ['github', 'GitHub'],
  ['powerpoint', 'PowerPoint'],
  ['chatgpt', 'ChatGPT'],
];

// The tools I work with: one straight row, centred, equal gaps between the icons.
export default function ToolsSection() {
  return (
    <section id="tools" aria-label="Tools I use" className="px-4 pb-6 pt-24 sm:pt-32">
      <ul className="mx-auto flex max-w-5xl flex-nowrap items-center justify-center" style={{ gap: 'clamp(0.5rem, 2.6vw, 1.75rem)' }}>
        {TOOLS.map(([file, name]) => (
          <li key={file} style={{ width: 'clamp(1.8rem, 7.4vw, 3.4rem)' }}>
            <img src={asset(`/tools/${file}.png`)} alt={name} title={name} draggable={false} loading="lazy" className="block h-auto w-full select-none" />
          </li>
        ))}
      </ul>
    </section>
  );
}
