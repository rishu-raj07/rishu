import { Mail } from 'lucide-react';
import type { ComponentType } from 'react';
import { site } from '../config/site';
import { GitHubIcon, InstagramIcon, LinkedInIcon, XIcon } from '../lib/icons';
import { cn, hasEmail, isHttpsUrl, mailto } from '../lib/utils';

type IconC = ComponentType<{ size?: number }>;

export const socialList: { key: string; label: string; href: string; Icon: IconC }[] = [
  { key: 'github', label: 'GitHub', href: site.socials.github, Icon: GitHubIcon },
  { key: 'linkedin', label: 'LinkedIn', href: site.socials.linkedin, Icon: LinkedInIcon },
  { key: 'instagram', label: 'Instagram', href: site.socials.instagram, Icon: InstagramIcon },
  { key: 'x', label: 'X', href: site.socials.x, Icon: XIcon },
].filter((s) => isHttpsUrl(s.href));

/** Renders only configured socials (empty links in site.ts are hidden). */
export function SocialLinks({ className, withEmail = true }: { className?: string; withEmail?: boolean }) {
  const items = [...socialList];
  if (withEmail && hasEmail) items.push({ key: 'email', label: 'Email', href: mailto(), Icon: Mail as IconC });
  if (!items.length) return null;
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)} aria-label="Social links">
      {items.map(({ key, label, href, Icon }) => (
        <li key={key}>
          <a
            href={href}
            {...(key !== 'email' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            aria-label={key === 'email' ? `Email ${site.name}` : `${site.name} on ${label} (opens in new tab)`}
            className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-orange/60 hover:text-orange"
          >
            <Icon size={18} />
          </a>
        </li>
      ))}
    </ul>
  );
}
