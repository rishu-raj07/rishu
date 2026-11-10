import { ArrowUp, Check, Download, Link2, MessageCircle, Share2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { SocialLinks } from '../components/SocialLinks';
import { site } from '../config/site';
import { useCopy } from '../hooks/useCopy';
import { LinkedInIcon, XIcon } from '../lib/icons';
import { toast } from '../lib/utils';

const shareUrl = site.url + '/';
const shareText = `${site.name} — ${site.headline}`;
const shareLinks = [
  { label: 'Share on X', Icon: XIcon, href: `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
  { label: 'Share on LinkedIn', Icon: LinkedInIcon, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
  { label: 'Share on WhatsApp', Icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}` },
];

export function Footer() {
  const { copied, copy } = useCopy();
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const nativeShare = async () => {
    try {
      await navigator.share({ title: site.seo.title, text: shareText, url: shareUrl });
    } catch (e) {
      if ((e as Error).name !== 'AbortError') toast('Sharing is not available here');
    }
  };

  const iconBtn =
    'grid size-11 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-muted transition-colors hover:border-orange/60 hover:text-orange';

  return (
    <footer className="relative border-t border-white/[0.06] pb-[max(2rem,env(safe-area-inset-bottom))] pt-14">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/50 to-transparent" />
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a href="#home" className="inline-flex min-h-11 items-center gap-3">
              <Logo size={44} />
              <span className="font-display text-lg font-semibold">{site.name}</span>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{site.intro}</p>
            <SocialLinks className="mt-5" />
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Navigate</h2>
            <ul className="grid grid-cols-2 gap-x-4 md:grid-cols-1">
              {[...site.nav, { id: 'book', label: 'Book a Call' }].map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="flex min-h-11 items-center text-sm text-fg/85 transition-colors hover:text-orange">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">Share</h2>
            <ul className="flex flex-wrap gap-2">
              {canNativeShare && (
                <li>
                  <button type="button" onClick={nativeShare} className={iconBtn} aria-label="Share this page">
                    <Share2 size={18} aria-hidden />
                  </button>
                </li>
              )}
              {shareLinks.map(({ label, Icon, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={iconBtn} aria-label={`${label} (opens in new tab)`}>
                    <Icon size={17} />
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => copy(shareUrl, 'Profile link copied')} className={iconBtn} aria-label="Copy profile link">
                  {copied ? <Check size={18} className="text-orange" aria-hidden /> : <Link2 size={18} aria-hidden />}
                </button>
              </li>
            </ul>
            {site.cvUrl && (
              <a
                href={site.cvUrl}
                download
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-orange/40 px-4 text-sm text-orange-soft transition-colors hover:bg-orange/10"
              >
                <Download size={16} aria-hidden /> Download CV
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-white/[0.06] pt-6 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.domain}
          </p>
          <a href="#home" className="inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-orange">
            Back to top <ArrowUp size={15} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
