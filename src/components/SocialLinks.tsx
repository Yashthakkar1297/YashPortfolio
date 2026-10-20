import { Github, Instagram, Linkedin, Mail, type LucideIcon } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';

export default function SocialLinks({ className = '' }: { className?: string }) {
  const { social } = usePortfolio().profile;
  const all: { key: string; label: string; href: string; Icon: LucideIcon }[] = [
    { key: 'github', label: 'GitHub', href: social.github, Icon: Github },
    { key: 'instagram', label: 'Instagram', href: social.instagram, Icon: Instagram },
    { key: 'linkedin', label: 'LinkedIn', href: social.linkedin, Icon: Linkedin },
    { key: 'email', label: 'Email', href: social.email ? `mailto:${social.email}` : '', Icon: Mail },
  ];
  const items = all.filter((i) => i.href.trim() !== '');
  if (!items.length) return null;
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {items.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a href={href} target={key === 'email' ? undefined : '_blank'} rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-2 text-sm text-zinc-100 transition hover:border-white/50 hover:text-white">
            <Icon size={16} />{label}
          </a>
        </li>
      ))}
    </ul>
  );
}
