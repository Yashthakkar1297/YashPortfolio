export interface Social { github: string; instagram: string; linkedin: string; email: string; }
export interface Profile {
  name: string; tagline: string; role: string; specialization: string; location: string;
  yearsOfExperience: string; bio: string; avatarSvg: string; phone: string; social: Social;
}
export interface SkillCategory { name: string; items: string[]; }
export interface Experience {
  company: string; role: string; period: string; location: string; summary: string; highlights: string[]; }
export interface Project {
  id: string; title: string; subtitle: string; description: string; stack: string[];
  role: string; year: string; link: string; image: string; folder: string; aspect: number; highlight: boolean;
  pdf?: string; downloadName?: string; pages?: string[]; layout?: 'screen'; // optional: a PDF shown page by page inside the project panel
}
export interface Education { institution: string; degree: string; period: string; }
export interface Testimonial { id: string; quote: string; name: string; role: string; avatarColor: string; }
export interface Resume { title: string; pdf: string; downloadName: string; pages: string[]; }
export interface PortfolioData {
  resume: Resume;
  profile: Profile; skills: { categories: SkillCategory[] }; experience: Experience[];
  projects: Project[]; education: Education[]; testimonials: Testimonial[];
}
