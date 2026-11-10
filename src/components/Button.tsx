import { m, useMotionValue, useSpring } from 'motion/react';
import type { ComponentPropsWithoutRef, PointerEvent, ReactNode } from 'react';
import { useFinePointer } from '../hooks/useMedia';
import { cn } from '../lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

const styles: Record<Variant, string> = {
  primary:
    'bg-orange text-[#0a0a0a] font-semibold shadow-[0_8px_30px_-8px_rgb(249_115_22/0.6)] hover:bg-orange-bright hover:shadow-[0_10px_40px_-6px_rgb(255_107_0/0.7)]',
  secondary:
    'border border-white/12 bg-white/[0.03] text-fg hover:border-orange/60 hover:bg-orange/[0.06] hover:text-white',
  ghost: 'text-muted hover:text-orange-soft',
};

const sizes: Record<Size, string> = {
  md: 'min-h-11 px-5 text-[0.95rem]',
  lg: 'min-h-12 px-6 text-base',
};

interface Common {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconRight?: ReactNode;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
}

type AsLink = Common & { href: string } & Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'className'>;
type AsButton = Common & { href?: undefined } & Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'className'>;

/** Pill button with a subtle magnetic pull on desktop (disabled on touch & reduced motion). */
export function Button(props: AsLink | AsButton) {
  const { variant = 'primary', size = 'md', icon, iconRight, magnetic = true, className, children, ...rest } = props;
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  const active = fine && magnetic;
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cls = cn(
    'group relative inline-flex select-none items-center justify-center gap-2 rounded-full transition-[background-color,border-color,color,box-shadow] duration-300',
    'disabled:cursor-not-allowed disabled:opacity-60',
    styles[variant],
    sizes[size],
    className,
  );
  const inner = (
    <>
      {icon}
      <span>{children}</span>
      {iconRight}
    </>
  );
  const motionProps = {
    style: active ? { x: sx, y: sy } : undefined,
    onPointerMove: onMove,
    onPointerLeave: onLeave,
  };

  if ('href' in rest && rest.href !== undefined) {
    const { href, ...a } = rest as Omit<AsLink, keyof Common>;
    return (
      <m.a href={href} className={cls} {...motionProps} {...(a as object)}>
        {inner}
      </m.a>
    );
  }
  const b = rest as Omit<AsButton, keyof Common>;
  return (
    <m.button type={b.type ?? 'button'} className={cls} {...motionProps} {...(b as object)}>
      {inner}
    </m.button>
  );
}
