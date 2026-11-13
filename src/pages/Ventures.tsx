import { ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { Breadcrumbs, CalendlyButton, cx, StatusChip } from '../components/ui';
import { VentureCard } from '../components/Ventures';
import type { Venture } from '../content/site';
import { ventures } from '../content/site';
import { Link } from '../lib/router';

export function VenturesIndex() {
  return (
    <>
      <section className="hero-bg">
        <div className="wrap pb-8 pt-8 sm:pt-12">
          <Breadcrumbs items={[['Home', '/'], ['Ventures', '/ventures']]} />
          <p className="eyebrow">Ventures & Projects</p>
          <h1 className="t-display mt-4 max-w-3xl !text-[clamp(2.1rem,7vw,3.6rem)]">
            Ideas I&apos;m turning into <span className="serif-accent">products.</span>
          </h1>
          <p className="t-lead mt-4 max-w-2xl text-muted">
            Each venture starts from a real problem I&apos;ve seen up close — in hotels, in logistics and in the communities of people building alongside me. Statuses are kept honest: nothing here is presented as launched before it is.
          </p>
        </div>
      </section>
      <section aria-labelledby="all-ventures" className="wrap grid gap-5 pb-14 pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <h2 id="all-ventures" className="sr-only">All ventures</h2>
        {ventures.map((v, i) => (
          <VentureCard key={v.slug} v={v} className="reveal" eager={i < 2} />
        ))}
      </section>
    </>
  );
}

export function VentureDetail({ v }: { v: Venture }) {
  const idx = ventures.indexOf(v);
  const prev = ventures[(idx - 1 + ventures.length) % ventures.length];
  const next = ventures[(idx + 1) % ventures.length];
  return (
    <article>
      <header className="hero-bg">
        <div className="wrap pb-8 pt-8 sm:pt-12">
          <Breadcrumbs items={[['Home', '/'], ['Ventures', '/ventures'], [v.name, `/ventures/${v.slug}`]]} />
          <div className="flex flex-wrap items-center gap-4">
            <img src={v.logo} width={72} height={72} alt={`${v.name} logo`} className="size-16 rounded-2xl border border-line bg-white object-contain p-1.5 shadow-card sm:size-[4.5rem]" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-orange-ink">{v.category}</p>
              <div className="mt-1"><StatusChip>{v.status}</StatusChip></div>
            </div>
          </div>
          <h1 className="t-display mt-5 !text-[clamp(2.2rem,7.5vw,3.8rem)]">{v.name}</h1>
          <p className="t-lead mt-3 max-w-2xl text-muted">{v.summary}</p>
        </div>
      </header>

      <div className="wrap grid gap-10 pb-14 pt-4 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-10">
          <section aria-labelledby="what" className="reveal">
            <h2 id="what" className="t-h2">What it is</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{v.intro}</p>
          </section>

          <section aria-label="Product visuals" className={cx('grid gap-4', v.gallery.some((g) => g.tall) && 'sm:grid-cols-[1.7fr_1fr]')}>
            {v.gallery.map((g, i) => (
              <figure key={g.src} className="reveal">
                <img
                  src={g.src}
                  srcSet={g.srcSet}
                  sizes="(min-width: 1024px) 720px, 100vw"
                  width={g.width}
                  height={g.height}
                  alt={g.alt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className={cx('w-full rounded-2xl border border-line bg-ivory shadow-card', g.tall && 'mx-auto max-h-[34rem] w-auto')}
                />
                <figcaption className="mt-2 text-sm text-muted">{g.caption}</figcaption>
              </figure>
            ))}
          </section>

          <section aria-labelledby="caps" className="reveal">
            <h2 id="caps" className="t-h2">Key capabilities</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {v.capabilities.map((c) => (
                <li key={c.title} className="card flex gap-3 p-4">
                  <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-orange" aria-hidden />
                  <div>
                    <h3 className="font-bold">{c.title}</h3>
                    <p className="mt-1 text-[0.95rem] text-muted">{c.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="why" className="reveal">
            <h2 id="why" className="t-h2">Why I&apos;m building it</h2>
            <p className="mt-4 text-[1.05rem] leading-relaxed text-muted">{v.why}</p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card reveal p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <Info size={18} className="text-orange-ink" aria-hidden /> Current status
            </h2>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{v.statusNote}</p>
          </div>
          <div className="reveal rounded-[1.4rem] bg-panel p-5 text-white">
            <h2 className="text-lg font-bold">Interested in {v.name}?</h2>
            <p className="mt-1 text-[0.95rem] text-[#c4c7cc]">Partnerships, feedback or collaboration — let&apos;s talk.</p>
            <div className="mt-4 grid gap-2">
              <CalendlyButton className="w-full">Schedule a Call</CalendlyButton>
              <Link to="/contact" className="btn w-full border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]">
                Send a message
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <nav aria-label="More ventures" className="wrap flex flex-wrap justify-between gap-3 border-t border-line py-6">
        <Link to={`/ventures/${prev.slug}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-orange-ink">
          <ArrowLeft size={18} aria-hidden /> {prev.name}
        </Link>
        <Link to={`/ventures/${next.slug}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-orange-ink">
          {next.name} <ArrowRight size={18} aria-hidden />
        </Link>
      </nav>
    </article>
  );
}
