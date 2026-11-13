import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { bottomNav, links, nav } from '../content/site';
import { GitHubIcon, icons } from '../lib/icons';
import { Link, useRouter } from '../lib/router';
import { Avatar, CalendlyButton, cx, Wordmark } from './ui';

const isActive = (path: string, href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

export function Header() {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={cx(
        'sticky top-0 z-40 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow,border-color] duration-300',
        scrolled ? 'border-b border-line bg-white/95 shadow-[0_6px_24px_-18px_rgb(17_19_24/0.35)]' : 'border-b border-transparent bg-white',
      )}
    >
      <div className="wrap flex h-[4.25rem] items-center justify-between gap-3 md:h-[4.75rem]">
        <Link to="/" className="flex min-h-11 items-center gap-2.5" aria-label="Rishu Raj — home">
          <Avatar size={44} className="size-10 min-[400px]:size-11 md:size-12" />
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 lg:gap-2">
            {nav.map((n) => {
              const active = isActive(path, n.href);
              return (
                <li key={n.href}>
                  <Link
                    to={n.href}
                    aria-current={active ? 'page' : undefined}
                    className={cx(
                      'relative flex min-h-11 min-w-11 items-center justify-center px-3 text-[1rem] font-semibold transition-colors',
                      active ? 'text-orange-ink' : 'text-ink/80 hover:text-ink',
                    )}
                  >
                    {n.label}
                    <span
                      aria-hidden
                      className={cx('absolute inset-x-3 bottom-1.5 h-[3px] rounded-full bg-orange transition-transform duration-300', active ? 'scale-x-100' : 'scale-x-0')}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {links.socials.map((s) => (
            <a
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${s.label} profile (opens in new tab)`}
              className="hidden size-11 place-items-center rounded-full text-ink transition-colors hover:bg-ivory hover:text-orange-ink lg:grid"
            >
              <GitHubIcon size={21} />
            </a>
          ))}
          <span aria-hidden className="mx-1 hidden h-7 w-px bg-line lg:block" />
          <CalendlyButton compact className="!gap-2 !px-3.5 !text-[1.05rem] min-[400px]:!px-4 md:!text-[1.1875rem]">
            Book a Call
          </CalendlyButton>
        </div>
      </div>
    </header>
  );
}

export function BottomNav() {
  const { path } = useRouter();
  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-18px_rgb(17_19_24/0.3)] md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pt-1.5 pb-1.5">
        {bottomNav.map((n) => {
          const Icon = icons[n.icon];
          const active = isActive(path, n.href);
          return (
            <li key={n.href} className="flex justify-center">
              <Link
                to={n.href}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex min-h-[3.4rem] w-full max-w-[4.6rem] flex-col items-center justify-center gap-0.5 rounded-2xl text-[0.75rem] font-semibold transition-colors duration-300',
                  active ? 'bg-orange/10 text-orange-ink' : 'text-muted active:bg-ivory',
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden className={active ? 'text-orange' : ''} />
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="cv-auto hidden border-t border-line bg-ivory/60 [contain-intrinsic-size:auto_520px] md:block">
      <div className="wrap grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1fr] md:py-14">
        <div>
          <Link to="/" className="inline-flex min-h-11 items-center gap-2.5" aria-label="Rishu Raj — home">
            <Avatar size={40} />
            <Wordmark />
          </Link>
          <p className="mt-3 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            Entrepreneur, developer and hospitality professional building technology products at the intersection of AI and real-world operations.
          </p>
        </div>
        <nav aria-label="Footer">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-ink">Explore</h2>
          <ul className="grid grid-cols-2 gap-x-4 text-[0.95rem]">
            {[...nav, { href: '/contact', label: 'Contact' }].map((n) => (
              <li key={n.href}>
                <Link to={n.href} className="inline-flex min-h-11 min-w-11 items-center text-muted transition-colors hover:text-orange-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-[0.08em] text-ink">Connect</h2>
          <ul className="text-[0.95rem]">
            <li>
              <a href={links.calendly} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-muted hover:text-orange-ink">
                Book a 30-minute call
              </a>
            </li>
            <li>
              <Link to="/contact" className="inline-flex min-h-11 items-center text-muted hover:text-orange-ink">
                Send a message
              </Link>
            </li>
            {links.socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-muted hover:text-orange-ink">
                  <GitHubIcon size={16} /> {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="wrap flex flex-col gap-1 border-t border-line py-5 text-sm text-muted sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Rishu Raj · rishuraj.tech</p>
        <p>Built with care in India.</p>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <div className="pb-bottomnav">
        <main id="main">{children}</main>
        <Footer />
      </div>
      <BottomNav />
    </>
  );
}
