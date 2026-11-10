import { Briefcase, Code2, Hotel } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../config/site';

const icons: Record<string, LucideIcon> = { code: Code2, hotel: Hotel, briefcase: Briefcase };

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & Expertise"
          title={
            <>
              Where technology <span className="text-gradient-orange">meets operations.</span>
            </>
          }
        />
        <ul className="grid gap-4 sm:gap-5 lg:grid-cols-3">
          {site.skills.map((cat, i) => {
            const Icon = icons[cat.icon] ?? Code2;
            return (
              <Reveal as="li" key={cat.id} delay={i * 0.08}>
                <article
                  className="card glow-border h-full p-5 sm:p-7"
                  onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-orange/30 bg-orange/10 text-orange">
                      <Icon size={22} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-fg">{cat.title}</h3>
                      <p className="text-sm text-muted">{cat.description}</p>
                    </div>
                  </div>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${cat.title} skills`}>
                    {cat.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-fg/90 transition-colors hover:border-orange/50 hover:text-orange-soft"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
