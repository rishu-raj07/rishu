import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Venture } from '../content/site';
import { ventures } from '../content/site';
import { icons } from '../lib/icons';
import { Link } from '../lib/router';
import { cx } from './ui';

export function VentureCard({ v, className, eager }: { v: Venture; className?: string; eager?: boolean }) {
  const Icon = icons[v.icon];
  return (
    <article className={cx('card group relative flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 hover:shadow-glow', className)}>
      <div className="relative aspect-[16/9] overflow-hidden bg-ivory">
        <img
          src={v.card.src}
          srcSet={v.card.srcSet}
          sizes="(min-width: 1024px) 300px, (min-width: 768px) 45vw, 82vw"
          width={640}
          height={360}
          alt={v.card.alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-ink shadow-soft">{v.chip}</span>
        <img
          src={v.logo}
          width={44}
          height={44}
          alt=""
          loading="lazy"
          className="absolute bottom-3 right-3 size-11 rounded-xl border border-white bg-white object-contain p-1 shadow-card"
        />
      </div>
      <div className="flex flex-1 gap-3 p-4 sm:p-5">
        <Icon size={26} className="mt-0.5 shrink-0 text-orange" aria-hidden />
        <div>
          <h3 className="flex items-center gap-1 text-[1.2rem] font-bold tracking-[-0.02em]">
            <Link to={`/ventures/${v.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {v.name}
            </Link>
            <ArrowUpRight size={18} className="text-orange transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
          </h3>
          <p className="mt-1 text-[0.95rem] leading-snug text-muted">{v.summary}</p>
        </div>
      </div>
    </article>
  );
}

/** Mobile: swipeable, snap-scrolling carousel with dots + arrow controls. */
export function VentureCarousel() {
  const row = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setIndex(items.indexOf(e.target as HTMLElement));
      },
      { root: el, threshold: 0.6 },
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = row.current;
    const target = el?.children[i] as HTMLElement | undefined;
    if (el && target) el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: 'smooth' });
  };

  return (
    <div className="md:hidden" role="region" aria-roledescription="carousel" aria-label="Ventures">
      <ul ref={row} className="snap-row -mx-4 flex gap-3 overflow-x-auto px-4 pb-3 pt-1">
        {ventures.map((v, i) => (
          <li key={v.slug} className="w-[82%] max-w-[22rem] shrink-0" aria-roledescription="slide" aria-label={`${i + 1} of ${ventures.length}: ${v.name}`}>
            <VentureCard v={v} />
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center justify-center gap-2">
        <button type="button" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0} aria-label="Previous venture" className="grid size-11 place-items-center rounded-full text-ink disabled:opacity-30">
          <ChevronLeft size={20} aria-hidden />
        </button>
        {ventures.map((v, i) => (
          <button
            key={v.slug}
            type="button"
            onClick={() => go(i)}
            aria-label={`Show ${v.name}`}
            aria-current={i === index ? 'true' : undefined}
            className="grid size-11 place-items-center"
          >
            <span className={cx('block h-2 rounded-full transition-all duration-300', i === index ? 'w-5 bg-orange' : 'w-2 bg-[#e3d8cf]')} />
          </button>
        ))}
        <button type="button" onClick={() => go(Math.min(ventures.length - 1, index + 1))} disabled={index === ventures.length - 1} aria-label="Next venture" className="grid size-11 place-items-center rounded-full text-ink disabled:opacity-30">
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>
    </div>
  );
}
