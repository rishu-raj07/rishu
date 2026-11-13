import { ArrowUpRight, CalendarDays, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { links } from '../content/site';
import { openCalendly, prefetchCalendly } from '../lib/calendly';
import { Link } from '../lib/router';

const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(' ');
export { cx };

/** Every "Book a call / conversation / meeting" CTA opens the real Calendly event. */
export function CalendlyButton({
  children = 'Book a Call',
  className,
  variant = 'primary',
  compact,
}: {
  children?: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  compact?: boolean;
}) {
  return (
    <a
      href={links.calendly}
      target="_blank"
      rel="noopener noreferrer"
      onClick={openCalendly}
      onPointerEnter={prefetchCalendly}
      onFocus={prefetchCalendly}
      className={cx('btn', variant === 'primary' ? 'btn-primary' : 'btn-secondary', compact && '!min-h-11 !px-4', className)}
    >
      <CalendarDays size={compact ? 18 : 20} aria-hidden />
      <span>{children}</span>
      <ArrowUpRight size={compact ? 16 : 18} aria-hidden className={compact ? 'hidden min-[400px]:block' : ''} />
      <span className="sr-only">(opens Calendly)</span>
    </a>
  );
}

export function Avatar({ size = 44, className, alt = '' }: { size?: number; className?: string; alt?: string }) {
  return (
    <img
      src={size > 56 ? '/img/avatar-logo-192.webp' : '/img/avatar-logo-96.webp'}
      width={size}
      height={size}
      alt={alt}
      decoding="async"
      className={cx('shrink-0 rounded-full bg-[#ffe7d6] object-cover ring-2 ring-white shadow-[0_4px_14px_-4px_rgb(255_90_10/0.45)]', className)}
    />
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx('whitespace-nowrap text-[1.2rem] font-extrabold tracking-[-0.04em] text-ink min-[400px]:text-[1.35rem]', className)}>
      Rishu Raj<span className="text-orange">.</span>
    </span>
  );
}

export function SectionHeader({
  title,
  id,
  action,
  className,
}: {
  title: ReactNode;
  id?: string;
  action?: { to: string; label: string };
  className?: string;
}) {
  return (
    <div className={cx('mb-5 flex items-end justify-between gap-4 sm:mb-7', className)}>
      <h2 id={id} className="flex items-center gap-3 text-[clamp(1.4rem,4.4vw,1.9rem)] font-extrabold tracking-[-0.035em]">
        <span aria-hidden className="h-[5px] w-7 rounded-full bg-orange" />
        {title}
      </h2>
      {action && (
        <Link to={action.to} className="group inline-flex min-h-11 shrink-0 items-center gap-1 text-[0.95rem] font-semibold text-orange-ink">
          {action.label}
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: [string, string][] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map(([label, to], i) => (
          <li key={to} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={14} aria-hidden className="text-[#c9bfb7]" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink">
                {label}
              </span>
            ) : (
              <Link to={to} className="inline-flex min-h-11 min-w-11 items-center hover:text-orange-ink">
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function StatusChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-orange/25 bg-orange/[0.07] px-3 py-1 text-xs font-semibold text-orange-ink">
      <span className="size-1.5 rounded-full bg-orange" aria-hidden />
      {children}
    </span>
  );
}
