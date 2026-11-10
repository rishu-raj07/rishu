import { ArrowUpRight, CalendarDays, Clock, Globe2, MessageSquare } from 'lucide-react';
import { Button } from '../components/Button';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import { site } from '../config/site';
import type { Meeting } from '../config/site';
import { prefillContact } from '../lib/contact-bridge';
import { cn, hasScheduling, meetingUrl } from '../lib/utils';

/**
 * Booking opens the provider's own page in a new tab: this gives the
 * provider's full mobile layout + timezone handling (no cramped iframe),
 * and only the provider can confirm a booking.
 * Without a scheduling URL, each card becomes a clearly labelled meeting
 * request sent through the contact form.
 */
export function BookCall() {
  const request = (mt: Meeting) =>
    prefillContact({
      reason: 'Meeting request',
      message: `Hi Rishu, I'd like to request a ${mt.minutes}-minute ${mt.title.toLowerCase()}.\n\nTopic: \nPreferred days/times (with timezone): `,
    });

  return (
    <section id="book" aria-labelledby="book-title" className="section-y relative">
      <div aria-hidden className="glow-orb inset-x-0 top-0 -z-10 mx-auto h-[30rem] max-w-5xl [--glow:0.1]" />
      <div className="container-x">
        <SectionHeading
          id="book-title"
          align="center"
          eyebrow="Book a Call"
          title={
            <>
              Let&apos;s Build Something <span className="text-gradient-orange">Meaningful.</span>
            </>
          }
          description={site.bookingText}
        />

        <ul className="grid gap-4 sm:gap-5 md:grid-cols-3">
          {site.meetings.map((mt, i) => {
            const url = meetingUrl(mt.url);
            const featured = i === 1;
            return (
              <Reveal as="li" key={mt.id} delay={i * 0.08}>
                <article
                  className={cn(
                    'card glow-border flex h-full flex-col p-6 sm:p-7',
                    featured && 'border-orange/35 shadow-[0_0_50px_-18px_rgb(249_115_22/0.55)]',
                  )}
                  onPointerMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--px', `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty('--py', `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-xl border border-orange/30 bg-orange/10 text-orange">
                      <Clock size={20} aria-hidden />
                    </span>
                    {featured && (
                      <span className="rounded-full border border-orange/30 bg-orange/10 px-2.5 py-1 text-xs text-orange-soft">Most common</span>
                    )}
                  </div>
                  <p className="mt-6 flex items-baseline gap-1.5">
                    <span className="font-display text-5xl font-bold leading-none text-gradient-orange">{mt.minutes}</span>
                    <span className="text-muted">min</span>
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-fg">{mt.title}</h3>
                  <p className="mt-2 flex-1 leading-relaxed text-muted">{mt.description}</p>
                  <div className="mt-6">
                    {url ? (
                      <Button
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        size="lg"
                        variant={featured ? 'primary' : 'secondary'}
                        className="w-full"
                        magnetic={false}
                        iconRight={<ArrowUpRight size={18} aria-hidden />}
                      >
                        Book {mt.minutes} min
                        <span className="sr-only"> {mt.title} (opens scheduling page in a new tab)</span>
                      </Button>
                    ) : (
                      <Button
                        size="lg"
                        variant={featured ? 'primary' : 'secondary'}
                        className="w-full"
                        magnetic={false}
                        onClick={() => request(mt)}
                        icon={<MessageSquare size={17} aria-hidden />}
                      >
                        Request this meeting
                        <span className="sr-only">: {mt.minutes}-minute {mt.title}, via the contact form</span>
                      </Button>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>

        <Reveal className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 text-center">
          {hasScheduling ? (
            <>
              <Button
                href={site.integrations.schedulingUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                icon={<CalendarDays size={18} aria-hidden />}
                iconRight={<ArrowUpRight size={18} aria-hidden />}
              >
                See all available times
              </Button>
              <p className="flex items-center gap-2 text-sm text-muted">
                <Globe2 size={15} className="shrink-0 text-orange" aria-hidden />
                Times are shown in your local timezone. Your booking is confirmed only by the scheduling provider&apos;s confirmation email.
              </p>
            </>
          ) : (
            <p className="flex items-start gap-2 text-sm text-muted sm:items-center">
              <Globe2 size={15} className="mt-0.5 shrink-0 text-orange sm:mt-0" aria-hidden />
              <span>
                Online booking isn&apos;t open yet — choosing a meeting sends a <strong className="font-medium text-fg">meeting request</strong>{' '}
                through the contact form. It&apos;s not a confirmed appointment; I&apos;ll reply to agree a time across timezones.
              </span>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
