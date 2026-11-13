import {
  BedDouble,
  Briefcase,
  Code2,
  FileText,
  House,
  Infinity as InfinityIcon,
  Layers,
  Rocket,
  Sparkles,
  TrendingUp,
  Truck,
  User,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';

export const icons: Record<string, LucideIcon> = {
  home: House,
  user: User,
  briefcase: Briefcase,
  sparkles: Sparkles,
  file: FileText,
  rocket: Rocket,
  growth: TrendingUp,
  code: Code2,
  bed: BedDouble,
  layers: Layers,
  infinity: InfinityIcon,
  users: Users,
  truck: Truck,
};

export function GitHubIcon({ size = 18, ...p }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...p}>
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .31.2.69.82.57A12 12 0 0 0 12 .3" />
    </svg>
  );
}
