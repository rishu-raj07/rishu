import { AnimatePresence, m } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../config/site';
import type { Project } from '../config/site';
import { GitHubIcon } from '../lib/icons';
import { cn, isHttpsUrl } from '../lib/utils';

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-y relative">
      <div aria-hidden className="glow-orb inset-x-0 top-1/4 -z-10 mx-auto h-[36rem] max-w-5xl [--glow:0.07]" />
      <div className="container-x">
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title={
            <>
              Ideas I&apos;m <span className="text-gradient-orange">turning into products.</span>
            </>
          }
          description="Ventures and initiatives I'm building or exploring. Statuses are kept honest — nothing here is presented as launched before it is."
        />
        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {site.projects.map((p, i) => (
            <Reveal as="li" key={p.id} delay={(i % 2) * 0.08} className={cn(p.featured && 'md:col-span-2')}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProjectCard({ project: p }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const website = isHttpsUrl(p.website) ? p.website : '';
  const github = isHttpsUrl(p.github) ? p.github : '';

  return (
    <article
      aria-labelledby={`${detailsId}-title`}
      className={cn('card glow-border flex h-full flex-col overflow-hidden p-5 sm:p-7', p.featured && 'lg:p-9')}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`);
      }}
    >
      {p.featured && (
        <div aria-hidden className="glow-orb -right-28 -top-32 size-96 [--glow:0.18]" />
      )}

      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <span
          aria-hidden
          className="grid size-12 place-items-center rounded-2xl border border-orange/30 bg-gradient-to-br from-orange/20 to-transparent font-display text-lg font-bold text-orange-soft"
        >
          {p.name.charAt(0)}
        </span>
        {p.status && (
          <span className="inline-flex items-center gap-2 rounded-full border border-orange/30 bg-orange/[0.08] px-3 py-1 text-xs font-medium text-orange-soft">
            <span className="size-1.5 rounded-full bg-orange" aria-hidden />
            {p.status}
          </span>
        )}
      </div>

      <div className="relative mt-5 flex-1">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-orange">{p.tagline}</p>
        <h3 id={`${detailsId}-title`} className={cn('mt-2 font-display font-semibold tracking-tight text-fg', p.featured ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl')}>
          {p.name}
        </h3>
        <p className={cn('mt-3 leading-relaxed text-muted', p.featured && 'max-w-2xl sm:text-lg')}>{p.description}</p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <m.div
            id={detailsId}
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden"
          >
            <div className="mt-5 border-t border-white/[0.07] pt-5">
              <h4 className="mb-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">Focus areas</h4>
              <ul className="flex flex-wrap gap-2">
                {p.focus.map((f) => (
                  <li key={f} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-fg/90">
                    {f}
                  </li>
                ))}
              </ul>
              {p.stack.length > 0 && (
                <>
                  <h4 className="mb-2.5 mt-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">Tech stack</h4>
                  <ul className="flex flex-wrap gap-2">
                    {p.stack.map((s) => (
                      <li key={s} className="rounded-md border border-orange/20 bg-orange/[0.06] px-2.5 py-1 font-mono text-xs text-orange-soft">
                        {s}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {!website && !github && <p className="mt-5 text-sm text-muted">Public links will be shared when ready.</p>}
            </div>
          </m.div>
        )}
      </AnimatePresence>

      <div className="relative mt-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={detailsId}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/10 px-4 text-sm text-fg transition-colors hover:border-orange/50 hover:text-orange-soft"
        >
          {open ? 'Hide details' : 'View details'}
          <ChevronDown size={16} aria-hidden className={cn('transition-transform duration-300', open && 'rotate-180')} />
        </button>
        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-orange px-4 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-orange-bright"
          >
            Visit website <ArrowUpRight size={16} aria-hidden />
            <span className="sr-only">(opens in new tab)</span>
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} on GitHub (opens in new tab)`}
            className="grid size-11 place-items-center rounded-full border border-white/10 text-muted transition-colors hover:border-orange/50 hover:text-orange"
          >
            <GitHubIcon size={18} />
          </a>
        )}
      </div>
    </article>
  );
}
