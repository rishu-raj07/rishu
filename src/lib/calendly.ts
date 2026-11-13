import type { MouseEvent } from 'react';
import { links } from '../content/site';

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

let loading: Promise<void> | null = null;

function loadCalendly(): Promise<void> {
  if (window.Calendly) return Promise.resolve();
  if (loading) return loading;
  loading = new Promise<void>((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = () => (window.Calendly ? resolve() : reject(new Error('Calendly unavailable')));
    s.onerror = () => reject(new Error('Calendly failed to load'));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error('Calendly timeout')), 8000);
  }).catch((e) => {
    loading = null;
    throw e;
  });
  return loading;
}

/**
 * Desktop: open Calendly's official popup. Mobile / failures: follow the real link
 * (opens the Calendly event page directly, which is the most reliable mobile flow).
 */
export function openCalendly(e: MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  if (!window.matchMedia('(min-width: 768px) and (hover: hover)').matches) return;
  e.preventDefault();
  loadCalendly()
    .then(() => window.Calendly!.initPopupWidget({ url: `${links.calendly}?hide_gdpr_banner=1` }))
    .catch(() => window.open(links.calendly, '_blank', 'noopener'));
}

/** Warm the Calendly assets when the user shows intent (hover/focus) on desktop. */
export function prefetchCalendly() {
  if (window.matchMedia('(min-width: 768px) and (hover: hover)').matches) void loadCalendly().catch(() => {});
}
