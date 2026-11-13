import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

/** Tiny history router: pages are prerendered as static HTML, then navigated client-side. */
interface RouterValue {
  path: string;
  navigate: (to: string) => void;
}
const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} });

export function normalizePath(p: string) {
  const clean = p.split(/[?#]/)[0] || '/';
  return clean.length > 1 ? clean.replace(/\/+$/, '') : '/';
}

function scrollToHash(hash: string) {
  const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'auto' });
}

export function RouterProvider({ initialPath, children }: { initialPath: string; children: ReactNode }) {
  const [path, setPath] = useState(() => normalizePath(initialPath));

  useEffect(() => {
    const onPop = () => setPath(normalizePath(location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to: string) => {
    const url = new URL(to, location.href);
    const next = normalizePath(url.pathname);
    if (next === normalizePath(location.pathname) && url.search === location.search) {
      if (url.hash) history.replaceState(null, '', url.hash);
      scrollToHash(url.hash);
      return;
    }
    history.pushState(null, '', url.pathname + url.search + url.hash);
    setPath(next);
    // Wait for the new page to render before scrolling.
    requestAnimationFrame(() => setTimeout(() => scrollToHash(url.hash), 0));
  }, []);

  return <RouterContext.Provider value={{ path, navigate }}>{children}</RouterContext.Provider>;
}

export const useRouter = () => useContext(RouterContext);

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** Internal link: a real <a href> (crawlable, works without JS) with client-side navigation. */
export function Link({ to, onClick, children, ...rest }: LinkProps) {
  const { navigate } = useRouter();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || rest.target) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
