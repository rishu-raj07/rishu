import { useSyncExternalStore } from 'react';

function subscribe(query: string) {
  return (cb: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  };
}

/** Reactive matchMedia. Returns false during SSR / before hydration. */
export function useMedia(query: string) {
  return useSyncExternalStore(
    subscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True only on devices with a precise pointer + hover (desktop) and motion allowed. */
export function useFinePointer() {
  return useMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
}
