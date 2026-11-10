import type { ReactNode } from 'react';
import { cn } from '../lib/utils';
import { Reveal } from './Reveal';

interface Props {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ eyebrow, title, description, id, align = 'left' }: Props) {
  return (
    <Reveal className={cn('mb-10 max-w-2xl sm:mb-14', align === 'center' && 'mx-auto text-center')}>
      <p className={cn('mb-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-orange', align === 'center' && 'justify-center')}>
        <span className="h-px w-6 bg-gradient-to-r from-transparent to-orange" aria-hidden />
        {eyebrow}
      </p>
      <h2 id={id} className="t-h2 font-display font-semibold text-fg">
        {title}
      </h2>
      {description && <p className="t-lead mt-4 text-muted">{description}</p>}
    </Reveal>
  );
}
