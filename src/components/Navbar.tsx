import { AnimatePresence, m } from 'motion/react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { site } from '../config/site';
import { useActiveSection } from '../hooks/useActiveSection';
import { cn, scrollToId } from '../lib/utils';
import { Button } from './Button';
import { Logo } from './Logo';
import { SocialLinks } from './SocialLinks';

const ids = [...site.nav.map((n) => n.id), 'book'];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(ids);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll lock + Escape + focus trap while the mobile menu is open.
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    const first = panel.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (e.key === 'Tab' && panel.current) {
        const f = [
          ...(menuBtn.current ? [menuBtn.current] : []),
          ...panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        ];
        if (!f.length) return;
        const firstEl = f[0];
        const lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      menuBtn.current?.focus({ preventScroll: true });
    };
  }, [open]);

  /** Close the menu first (releasing the scroll lock), then scroll to the target. */
  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => {
      scrollToId(id);
      history.replaceState(null, '', `#${id}`);
    }, 30);
  };

  // Close the menu if resized to desktop.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 64rem)');
    const onChange = () => mql.matches && setOpen(false);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,border-color,backdrop-filter] duration-300',
        scrolled || open ? 'border-b border-white/[0.06] bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav aria-label="Primary" className="container-x flex h-16 items-center justify-between gap-4">
        <a href="#home" className="group flex min-h-11 items-center gap-2.5">
          <Logo size={36} className="transition-transform duration-300 group-hover:scale-105" />
          <span className="font-display text-[0.95rem] font-semibold tracking-tight">{site.name}</span>
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 lg:flex">
          {site.nav.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                aria-current={active === n.id ? 'location' : undefined}
                className={cn(
                  'relative flex min-h-11 items-center rounded-full px-3.5 text-sm transition-colors',
                  active === n.id ? 'text-fg' : 'text-muted hover:text-fg',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-0 -z-10 rounded-full border transition-all duration-300',
                    active === n.id ? 'border-orange/30 bg-orange/10 opacity-100' : 'border-transparent opacity-0',
                  )}
                />
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <Button href="#book" icon={<CalendarDays size={16} aria-hidden />}>
              Book a Call
            </Button>
          </div>
          <button
            ref={menuBtn}
            type="button"
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-fg transition-colors hover:border-orange/50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>
    </header>

      {/* Rendered outside <header>: its backdrop-filter would trap position:fixed children. */}
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-40 overflow-y-auto bg-bg/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container-x flex min-h-full flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-6">
              <ul className="flex flex-col">
                {[...site.nav, { id: 'book', label: 'Book a Call' }].map((n, i) => (
                  <m.li
                    key={n.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05, duration: 0.35 }}
                  >
                    <a
                      href={`#${n.id}`}
                      onClick={go(n.id)}
                      aria-current={active === n.id ? 'location' : undefined}
                      className={cn(
                        'flex min-h-14 items-center justify-between border-b border-white/[0.06] font-display text-2xl font-medium tracking-tight transition-colors',
                        active === n.id ? 'text-orange' : 'text-fg hover:text-orange-soft',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden
                          className={cn('h-6 w-0.5 rounded-full transition-colors', active === n.id ? 'bg-orange' : 'bg-transparent')}
                        />
                        {n.label}
                      </span>
                      <span className="font-mono text-xs text-muted" aria-hidden>
                        0{i + 1}
                      </span>
                    </a>
                  </m.li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-5 pt-10">
                <Button href="#book" size="lg" onClick={go('book')}icon={<CalendarDays size={18} aria-hidden />}>
                  Book a Call
                </Button>
                <SocialLinks className="justify-center" />
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
