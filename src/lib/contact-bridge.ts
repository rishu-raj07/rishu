import type { ContactReason } from '../config/site';
import { scrollToId } from './utils';

/**
 * Lets other sections (e.g. "Book a Call" when no scheduling URL is set)
 * pre-fill the lazily loaded contact form.
 */
export interface ContactPrefill {
  reason?: ContactReason;
  message?: string;
}

type Listener = (p: ContactPrefill) => void;
let pending: ContactPrefill | null = null;
const listeners = new Set<Listener>();

export function prefillContact(p: ContactPrefill) {
  pending = p;
  listeners.forEach((l) => l(p));
  scrollToId('contact');
  window.setTimeout(() => document.getElementById('contact-name')?.focus({ preventScroll: true }), 800);
}

export function consumePendingPrefill() {
  const p = pending;
  pending = null;
  return p;
}

export function onPrefill(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
