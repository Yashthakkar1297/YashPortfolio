import { usePortfolio } from '../hooks/usePortfolio';

export default function AboutSection() {
  const { profile } = usePortfolio();
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-24">
      <h2 className="hero-heading text-4xl font-semibold sm:text-6xl">About me</h2>
      <p className="prose-safe mt-8 text-lg leading-relaxed text-zinc-300">{profile.bio}</p>
    </section>
  );
}
