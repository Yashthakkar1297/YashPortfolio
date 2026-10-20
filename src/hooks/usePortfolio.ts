import { useMemo } from 'react';
import raw from '../data/portfolio.json';
import type { PortfolioData, Project } from '../types/portfolio';
import { asset } from '../lib/asset';

function withBase(v: unknown, key = ''): unknown {
  if (typeof v === 'string') return key === 'avatarSvg' ? v : asset(v);
  if (Array.isArray(v)) return v.map((x) => withBase(x));
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withBase(x, k)]));
  return v;
}

export interface UsePortfolio extends PortfolioData { shortName: string; sortedProjects: Project[]; }

export function usePortfolio(): UsePortfolio {
  return useMemo(() => {
    const data = withBase(raw) as PortfolioData;
    const sortedProjects = [...data.projects].sort((a, b) => Number(b.highlight) - Number(a.highlight));
    return { ...data, shortName: data.profile.name.split(' ')[0], sortedProjects };
  }, []);
}
