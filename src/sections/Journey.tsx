import { m, useScroll, useSpring } from 'motion/react';
import { Boxes, Building2, Code2, ConciergeBell, Hotel, Rocket, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../config/site';
import { cn } from '../lib/utils';

const icons: Record<string, LucideIcon> = {
  hotel: Hotel,
  concierge: ConciergeBell,
  building: Building2,
  code: Code2,
  boxes: Boxes,
  rocket: Rocket,
  sparkles: Sparkles,
};

export function Journey() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="journey" aria-labelledby="journey-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="journey-title"
          eyebrow="My Journey"
          title={
            <>
              Built on real operations, <span className="text-gradient-orange">shaped by building.</span>
            </>
          }
          description="The path from hotel front desks to building hospitality technology."
        />

        <ol ref={ref} className="relative mx-auto max-w-4xl">
          {/* Rail: left on mobile, centered on desktop */}
          <div aria-hidden className="absolute bottom-0 left-[19px] top-0 w-px bg-white/[0.07] md:left-1/2">
            <m.div style={{ scaleY }} className="h-full w-full origin-top bg-gradient-to-b from-orange-soft via-orange to-orange-bright" />
          </div>

          {site.journey.map((step, i) => {
            const Icon = icons[step.icon] ?? Sparkles;
            const right = i % 2 === 1;
            const current = 'current' in step && step.current;
            return (
              <li key={step.title} className="relative pb-8 pl-14 last:pb-0 md:grid md:grid-cols-2 md:gap-14 md:pl-0">
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-0 top-1 z-10 grid size-10 place-items-center rounded-full border bg-bg md:left-1/2 md:-translate-x-1/2',
                    current ? 'border-orange text-orange shadow-[0_0_24px_rgb(249_115_22/0.55)]' : 'border-orange/30 text-orange-soft',
                  )}
                >
                  <Icon size={17} />
                </span>
                <Reveal className={cn(right ? 'md:col-start-2' : 'md:col-start-1 md:text-right')} y={14}>
                  <div
                    className={cn(
                      'card glow-border p-5 sm:p-6',
                      current && 'border-orange/40 shadow-[0_0_40px_-12px_rgb(249_115_22/0.45)]',
                    )}
                    onPointerMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`);
                    }}
                  >
                    <p className={cn('mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-orange', !right && 'md:justify-end')}>
                      {current ? 'Now' : `Chapter ${String(i + 1).padStart(2, '0')}`}
                    </p>
                    <h3 className="font-display text-lg font-semibold text-fg sm:text-xl">{step.title}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{step.text}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
