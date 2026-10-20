# Portfolio

React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + lucide-react.

## Install & scripts
```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Structure
- `src/data/portfolio.json` — all profile, experience, project and testimonial content
- `src/types/portfolio.ts` — types for the JSON
- `src/hooks/usePortfolio.ts` — typed hook (adds `shortName`, `sortedProjects`)
- `src/components/` — Navbar, Hero, About, Experience, Services, Projects, ProjectCard, Testimonials, Footer, SocialLinks
- `src/index.css` — Tailwind, `.hero-heading`, marquee keyframes, reduced-motion rules

## Editing content
Edit `src/data/portfolio.json` only. Empty social URLs and empty project `link` values are hidden automatically. A project with an empty `image` shows a dark placeholder with its title. Projects with `"highlight": true` appear first. `avatarSvg` takes raw SVG markup. Services rows are still hardcoded in `ServicesSection.tsx` (marked with a TODO).
