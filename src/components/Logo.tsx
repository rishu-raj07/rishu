import { site } from '../config/site';
import { cn } from '../lib/utils';

/** The RR brand mark. Decorative by default: the visible name next to it carries the text. */
export function Logo({ size = 36, className, alt = '' }: { size?: number; className?: string; alt?: string }) {
  return (
    <img
      src={site.logo.small}
      srcSet={`${site.logo.small} 96w, ${site.logo.medium} 192w`}
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={alt}
      decoding="async"
      className={cn(
        'shrink-0 rounded-xl border border-orange/30 bg-[#080808] object-cover shadow-[0_0_20px_-6px_rgb(249_115_22/0.6)]',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
