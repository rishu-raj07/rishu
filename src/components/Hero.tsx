import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { profile } from '../content/site';
import { icons } from '../lib/icons';
import { Link } from '../lib/router';
import { CalendlyButton, cx } from './ui';

/**
 * The avatar is a professionally rendered 3D-style portrait (static image) with
 * gentle pointer parallax on desktop — not a real-time 3D model.
 * Card positions are percentages of the avatar box so they scale with it.
 */
const cardPos = [
  'left-[-10%] top-[30%] min-w-[37%] min-h-[22%]', // covers the card baked into the source render
  'left-[83%] top-[27%] min-w-[34%] min-h-[21%]',
  'left-[86%] top-[63%] min-w-[36%] min-h-[19%]',
];

export function Hero() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    if (!fine.matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty('--px', `${(x * 14).toFixed(1)}px`);
        el.style.setProperty('--py', `${(y * 10).toFixed(1)}px`);
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const { headline } = profile;

  return (
    <section aria-labelledby="hero-title" className="hero-bg relative overflow-hidden">
      <div className="wrap grid items-center gap-6 pb-8 pt-6 md:pt-10 lg:grid-cols-[1.08fr_1fr] lg:gap-4 lg:pb-14 lg:pt-12">
        {/* Text column */}
        <div className="relative">
          {/* Mobile/tablet: avatar sits top-right beside the headline; the min-height keeps the intro below it. */}
          <div className="relative min-h-[calc(1.5rem+min(50vw,17rem)*1.144)] lg:min-h-0">
          <img
            src="/img/avatar-mobile.webp"
            width={348}
            height={398}
            alt={profile.avatarAlt}
            fetchPriority="high"
            className="rise pointer-events-none absolute right-0 top-6 w-[min(50vw,17rem)] select-none lg:hidden"
          />
          <p className="eyebrow rise relative text-[0.66rem] tracking-[0.05em] min-[400px]:text-[0.72rem] sm:text-[0.8rem] sm:tracking-[0.08em]">{profile.roles.join(' • ')}</p>
          <h1 id="hero-title" className="t-display rise rise-1 relative mt-4 max-w-[62%] sm:max-w-[60%] lg:max-w-none">
            <span className="block">{headline.lead}</span>
            <span className="block">
              {headline.line2} <span className="serif-accent">{headline.emphasis}</span>
            </span>
          </h1>
          </div>
          <p className="t-lead rise rise-2 relative mt-5 max-w-xl text-muted lg:mt-6">{profile.intro}</p>
          <div className="rise rise-3 relative mt-7 flex flex-wrap gap-3">
            <CalendlyButton className="flex-1 sm:flex-none">Book a conversation</CalendlyButton>
            <Link to="/#contact" className="btn btn-secondary flex-1 sm:flex-none">
              <Send size={19} className="text-orange" aria-hidden />
              Send a message
            </Link>
          </div>

          <ul className="rise rise-4 relative mt-8 grid grid-cols-3 rounded-2xl border border-line bg-white/80 p-3 shadow-soft sm:p-4 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
            {profile.stats.map((s, i) => {
              const Icon = icons[s.icon];
              return (
                <li key={s.label} className={cx('flex flex-col gap-1 px-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4', i > 0 && 'border-l border-line')}>
                  <Icon size={26} className="shrink-0 text-orange" aria-hidden />
                  <div>
                    <p className="text-[1.6rem] font-extrabold leading-none tracking-[-0.04em] sm:text-[1.9rem]">{s.value}</p>
                    <p className="mt-1 text-[0.68rem] font-semibold uppercase leading-tight tracking-[0.06em] text-ink/80 sm:text-[0.72rem]">{s.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Desktop avatar stage with floating cards */}
        <div ref={stage} className="relative mx-auto hidden w-full max-w-[30rem] lg:block">
          <div className="relative aspect-[472/568]" style={{ transform: 'translate3d(var(--px,0),var(--py,0),0)', transition: 'transform 0.4s ease-out' }}>
            <img
              src="/img/avatar-hero.webp"
              width={472}
              height={568}
              alt={profile.avatarAlt}
              fetchPriority="high"
              className="rise absolute inset-0 size-full select-none object-cover"
            />
          </div>
          {profile.heroCards.map((c, i) => {
            const Icon = icons[c.icon];
            return (
              <div
                key={c.title}
                className={cx('absolute flex', cardPos[i])}
                style={{ transform: 'translate3d(calc(var(--px,0) * -0.6), calc(var(--py,0) * -0.6), 0)', transition: 'transform 0.5s ease-out' }}
              >
                <div className={cx('float-card rise flex-1 rounded-2xl border border-white bg-white/[0.97] px-4 py-3.5 shadow-card backdrop-blur', i === 1 && 'delay-1', i === 2 && 'delay-2', `rise-${i + 2}`)}>
                  <Icon size={26} className="text-orange" aria-hidden />
                  <p className="mt-1.5 text-[1.05rem] font-bold leading-tight">{c.title}</p>
                  <p className="text-sm text-muted">{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
