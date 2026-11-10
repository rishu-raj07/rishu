import { Check, Copy, Mail, MessageSquare } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { onPrefill } from '../lib/contact-bridge';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { SocialLinks, socialList } from '../components/SocialLinks';
import { site } from '../config/site';
import { useCopy } from '../hooks/useCopy';
import { hasEmail, mailto } from '../lib/utils';

const loadForm = () => import('./ContactForm');
const ContactForm = lazy(loadForm);

export function Contact() {
  const { copied, copy } = useCopy();
  const [warm, setWarm] = useState(false);

  // Load the form code only when the visitor approaches this section (keeps first load light),
  // or immediately if another section asks to pre-fill it.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const run = () => {
      void loadForm();
      setWarm(true);
    };
    const offPrefill = onPrefill(run);
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      run();
      return offPrefill;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { rootMargin: '1200px 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      offPrefill();
    };
  }, []);

  return (
    <section id="contact" ref={sectionRef} aria-labelledby="contact-title" className="section-y relative">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-14">
          <div>
            <SectionHeading
              id="contact-title"
              eyebrow="Connect"
              title={
                <>
                  Let&apos;s <span className="text-gradient-orange">connect.</span>
                </>
              }
              description="Collaboration, partnership, investment, a startup idea, or just a good conversation — send a message and I'll get back to you."
            />

            <Reveal className="space-y-4">
              {hasEmail && (
                <div className="card flex flex-wrap items-center gap-3 p-4 sm:p-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-orange/30 bg-orange/10 text-orange">
                    <Mail size={19} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs uppercase tracking-[0.16em] text-muted">Email</p>
                    <a href={mailto()} className="block truncate text-fg hover:text-orange-soft">
                      {site.email}
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(site.email, 'Email address copied')}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/10 px-4 text-sm transition-colors hover:border-orange/50 hover:text-orange-soft"
                    aria-label={copied ? 'Email address copied' : 'Copy email address'}
                  >
                    {copied ? <Check size={16} className="text-orange" aria-hidden /> : <Copy size={16} aria-hidden />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}

              {(socialList.length > 0 || hasEmail) && (
                <div className="card p-4 sm:p-5">
                  <p className="mb-3 text-xs uppercase tracking-[0.16em] text-muted">Elsewhere</p>
                  <SocialLinks />
                </div>
              )}

              <div className="flex items-start gap-3 rounded-2xl border border-dashed border-orange/20 p-4 text-sm text-muted">
                <MessageSquare size={17} className="mt-0.5 shrink-0 text-orange" aria-hidden />
                <p>
                  Prefer to talk live?{' '}
                  <a href="#book" className="font-medium text-orange-soft underline-offset-4 hover:underline">
                    Book a call
                  </a>{' '}
                  instead.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal y={24}>
            <div className="card relative overflow-hidden border-orange/15 shadow-[0_30px_80px_-40px_rgb(249_115_22/0.45)]">
              <div aria-hidden className="h-px w-full bg-gradient-to-r from-transparent via-orange to-transparent" />
              <Suspense fallback={<FormSkeleton />}>{warm ? <ContactForm /> : <FormSkeleton />}</Suspense>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FormSkeleton() {
  return (
    <div className="grid min-h-[38rem] gap-5 p-5 sm:grid-cols-2 sm:p-8" role="status" aria-busy="true" aria-label="Loading contact form">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i}>
          <div className="mb-2 h-4 w-24 rounded bg-white/[0.06]" />
          <div className="h-12 rounded-xl bg-white/[0.04]" />
        </div>
      ))}
      <div className="sm:col-span-2">
        <div className="mb-2 h-4 w-32 rounded bg-white/[0.06]" />
        <div className="h-12 rounded-xl bg-white/[0.04]" />
      </div>
      <div className="sm:col-span-2">
        <div className="mb-2 h-4 w-20 rounded bg-white/[0.06]" />
        <div className="h-36 rounded-xl bg-white/[0.04]" />
      </div>
    </div>
  );
}
