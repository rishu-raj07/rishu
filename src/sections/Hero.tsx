import { m, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, CalendarDays, MessageSquare } from 'lucide-react';
import { useRef } from 'react';
import type { PointerEvent } from 'react';
import { Button } from '../components/Button';
import { SocialLinks } from '../components/SocialLinks';
import { site } from '../config/site';
import { useFinePointer } from '../hooks/useMedia';

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const fine = useFinePointer();
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const rx = useSpring(useTransform(ny, [-0.5, 0.5], [14, -14]), { stiffness: 80, damping: 18 });
  const ry = useSpring(useTransform(nx, [-0.5, 0.5], [-18, 18]), { stiffness: 80, damping: 18 });
  const px = useSpring(useTransform(nx, [-0.5, 0.5], [-14, 14]), { stiffness: 60, damping: 20 });
  const py = useSpring(useTransform(ny, [-0.5, 0.5], [-10, 10]), { stiffness: 60, damping: 20 });

  // Cursor-responsive light + grid: desktop only.
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!fine || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ref.current.style.setProperty('--mx', `${x}px`);
    ref.current.style.setProperty('--my', `${y}px`);
    ref.current.style.setProperty('--hot', '1');
    nx.set(x / r.width - 0.5);
    ny.set(y / r.height - 0.5);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--hot', '0');
    nx.set(0);
    ny.set(0);
  };

  const words = site.headline.split(' ');

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      aria-labelledby="hero-title"
      className="relative isolate flex items-center overflow-hidden pb-14 pt-[calc(6rem+env(safe-area-inset-top))] sm:min-h-[88svh] lg:min-h-[100svh] lg:pb-20"
    >
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="hero-grid" />
        <div className="hero-grid-hot" />
        <div className="hero-light" />
        <div className="glow-orb left-1/2 top-[-14rem] h-[34rem] w-[min(60rem,160vw)] -translate-x-1/2 [--glow:0.2]" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div className="container-x grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
        <div className="text-left">
          <m.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-6 inline-flex max-w-full items-center gap-2.5 rounded-full border border-orange/25 bg-orange/[0.07] py-1.5 pl-2.5 pr-3.5 text-xs text-orange-soft sm:text-sm"
          >
            <span className="relative flex size-2 shrink-0">
              <span className="ping-soft absolute inline-flex size-full rounded-full bg-orange" />
              <span className="relative inline-flex size-2 rounded-full bg-orange" />
            </span>
            <span className="truncate">Currently building EasStay OS</span>
          </m.p>

          <h1 id="hero-title">
            <m.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.05 }}
              className="t-hero block font-display font-bold uppercase text-gradient"
            >
              {site.name}
            </m.span>
            <span className="mt-4 flex flex-wrap gap-x-[0.3em] font-display text-[clamp(1.6rem,5.6vw,2.75rem)] font-semibold leading-tight tracking-tight">
              {words.map((w, i) => (
                <m.span
                  key={w + i}
                  initial={{ opacity: 0, y: '0.5em' }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.09 }}
                  className={i === words.length - 1 ? 'text-shimmer' : 'text-fg'}
                >
                  {w}
                </m.span>
              ))}
            </span>
          </h1>

          <m.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-[0.2em] text-orange-soft sm:text-sm"
          >
            {site.roles.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </m.p>

          <m.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.7 }}
            className="t-lead mt-5 max-w-xl text-muted"
          >
            {site.intro}
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.85 }}
            className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:flex sm:flex-wrap"
          >
            <Button href="#projects" size="lg" className="min-[420px]:col-span-2 sm:col-auto" iconRight={<ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" aria-hidden />}>
              Explore My Work
            </Button>
            <Button href="#contact" variant="secondary" size="lg" icon={<MessageSquare size={17} aria-hidden />}>
              Let&apos;s Connect
            </Button>
            <Button href="#book" variant="secondary" size="lg" icon={<CalendarDays size={17} aria-hidden />}>
              Book a Call
            </Button>
          </m.div>

          <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 0.6 }} className="mt-8">
            <SocialLinks />
          </m.div>
        </div>

        {/* Floating 3D object — compact on mobile, placed after the text so it never covers it */}
        <m.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="scene pointer-events-none relative mx-auto hidden h-[300px] w-full max-w-[300px] place-items-center md:grid lg:h-[460px] lg:max-w-[460px]"
          style={fine ? { x: px, y: py } : undefined}
        >
          <div className="glow-orb inset-0 [--glow:0.3]" />
          <m.div className="float grid place-items-center" style={{ transformStyle: 'preserve-3d', ...(fine ? { rotateX: rx, rotateY: ry } : {}) }}>
            <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
              <div className="ring ring-a" />
              <div className="ring ring-b" />
              <div className="cube">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="core" />
            </div>
          </m.div>
        </m.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 hidden min-h-11 -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted transition-colors hover:text-orange lg:flex"
      >
        Scroll <ArrowDown size={14} className="float" aria-hidden />
      </a>
    </section>
  );
}
