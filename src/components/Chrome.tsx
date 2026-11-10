import { AnimatePresence, m, useScroll, useSpring } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toastBus } from '../lib/utils';

/** Thin orange reading-progress bar at the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <m.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-gradient-to-r from-orange-soft via-orange to-orange-bright"
      style={{ scaleX }}
    />
  );
}

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 900);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <m.a
          href="#home"
          aria-label="Back to top"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="glass fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-[max(1.25rem,env(safe-area-inset-right))] z-40 grid size-12 place-items-center rounded-full text-orange shadow-lg transition-colors hover:border-orange/50"
        >
          <ArrowUp size={20} aria-hidden />
        </m.a>
      )}
    </AnimatePresence>
  );
}

/** Polite live-region toasts (copy confirmations etc.). */
export function Toaster() {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null);
  useEffect(() => {
    let t: number | undefined;
    const off = toastBus.on((text) => {
      setMsg({ id: Date.now(), text });
      window.clearTimeout(t);
      t = window.setTimeout(() => setMsg(null), 2400);
    });
    return () => {
      off();
      window.clearTimeout(t);
    };
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-[70] flex justify-center px-4"
    >
      <AnimatePresence>
        {msg && (
          <m.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass rounded-full border-orange/30 px-4 py-2.5 text-sm text-fg shadow-xl"
          >
            {msg.text}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
