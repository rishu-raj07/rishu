import { site } from '../config/site';

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through to legacy path */
  }
  try {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    el.remove();
    return ok;
  } catch {
    return false;
  }
}

/* ── Links ─────────────────────────────────────────────────── */
export const hasEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email);

export function mailto(subject?: string, body?: string) {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${site.email}${parts.length ? `?${parts.join('&')}` : ''}`;
}

const isHttps = (u: string) => /^https:\/\/\S+$/i.test(u);
export const schedulingUrl = site.integrations.schedulingUrl;
export const hasScheduling = isHttps(schedulingUrl);
export const formEndpoint = site.integrations.formEndpoint;
export const hasFormEndpoint = isHttps(formEndpoint);

export function meetingUrl(url: string) {
  return isHttps(url) ? url : schedulingUrl;
}

export const isHttpsUrl = isHttps;

/* ── Tiny event buses ──────────────────────────────────────── */
type Listener<T> = (v: T) => void;
function bus<T>() {
  const ls = new Set<Listener<T>>();
  return {
    emit: (v: T) => ls.forEach((l) => l(v)),
    on: (l: Listener<T>) => {
      ls.add(l);
      return () => {
        ls.delete(l);
      };
    },
  };
}

export const toastBus = bus<string>();
export const toast = (msg: string) => toastBus.emit(msg);

export const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};
