import { Code2, Compass, Sparkles } from 'lucide-react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../config/site';

const pillars = [
  { Icon: Sparkles, title: 'Hospitality operations', text: 'Six years on the ground — reception and property management.' },
  { Icon: Code2, title: 'Software development', text: 'Self-taught full-stack builder working with React, Node.js and MongoDB.' },
  { Icon: Compass, title: 'Entrepreneurship', text: 'Exploring ventures in hospitality tech, SaaS, logistics and digital products.' },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          eyebrow="About"
          title={
            <>
              From the front desk <span className="text-gradient-orange">to building the tools.</span>
            </>
          }
        />

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div className="space-y-5">
            {site.bio.map((p, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? 't-lead text-fg' : 't-lead text-muted'}>{p}</p>
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <h3 className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.2em] text-muted">Interests</h3>
              <ul className="flex flex-wrap gap-2">
                {site.interests.map((t) => (
                  <li key={t} className="rounded-full border border-orange/20 bg-orange/[0.06] px-3.5 py-1.5 text-sm text-orange-soft">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="space-y-4">
            {/* Experience numbers with a minimal vertical rail */}
            <Reveal className="card overflow-hidden p-6 sm:p-7">
              <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">Experience</h3>
              <ol className="relative space-y-6 border-l border-orange/20 pl-6">
                {site.stats.map((s) => (
                  <li key={s.label} className="relative">
                    <span aria-hidden className="absolute -left-[1.84rem] top-3 size-2.5 rounded-full border-2 border-bg bg-orange shadow-[0_0_12px_rgb(249_115_22/0.8)]" />
                    <p className="flex items-baseline gap-2">
                      <span className="font-display text-5xl font-bold leading-none text-gradient-orange">{s.value}</span>
                      <span className="text-sm text-orange-soft">{s.unit}</span>
                    </p>
                    <p className="mt-1 text-muted">{s.label}</p>
                  </li>
                ))}
              </ol>
            </Reveal>

            <div className="grid gap-4">
              {pillars.map(({ Icon, title, text }, i) => (
                <Reveal key={title} delay={0.05 * i} className="card flex gap-4 p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-orange/25 bg-orange/10 text-orange">
                    <Icon size={20} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-semibold text-fg">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
