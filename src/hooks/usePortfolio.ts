import { useMemo } from 'react';
import raw from '../data/portfolio.json';
import type { PortfolioData, Project } from '../types/portfolio';

export interface UsePortfolio extends PortfolioData { shortName: string; sortedProjects: Project[]; }

export function usePortfolio(): UsePortfolio {
  return useMemo(() => {
    const data = raw as PortfolioData;
    const sortedProjects = [...data.projects].sort((a, b) => Number(b.highlight) - Number(a.highlight));
    return { ...data, shortName: data.profile.name.split(' ')[0], sortedProjects };
  }, []);
}
