import { Briefcase, Code2, Hotel } from 'lucide-react';
import { Avatar, Breadcrumbs, CalendlyButton, cx } from '../components/ui';
import { about, profile, ventures } from '../content/site';
import { Link } from '../lib/router';

const skillIcons = [Code2, Hotel, Briefcase];

export function About() {
  return (
    <>
      <section className="hero-bg">
        <div className="wrap pb-10 pt-8 sm:pb-14 sm:pt-12">
          <Breadcrumbs items={[['Home', '/'], ['About', '/about']]} />
          <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow">About Rishu</p>
              <h1 className="t-display mt-4 !text-[clamp(2.1rem,7vw,3.8rem)]">
                From the front desk to <span className="serif-accent">building</span> the tools.
              </h1>
              <p className="t-lead mt-5 max-w-2xl text-muted">{profile.positioning}</p>
            </div>
            <div className="relative mx-auto">
              <div aria-hidden className="absolute inset-[-12%] rounded-full bg-[radial-gradient(closest-side,rgb(255_120_50/0.25),transparent)]" />
              <Avatar size={220} alt={profile.avatarAlt} className="relative !size-44 ring-8 sm:!size-56" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="story" className="wrap grid gap-10 py-12 lg:grid-cols-[1.3fr_1fr] lg:py-16">
        <div className="reveal">
          <h2 id="story" className="t-h2">My story</h2>
          <div className="mt-5 space-y-4 text-[1.05rem] leading-relaxed text-muted">
            {about.story.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-ink' : ''}>
                {p}
              </p>
            ))}
          </div>
        </div>
        <div className="reveal">
          <h2 className="t-h2">Experience</h2>
          <ol className="relative mt-6 space-y-6 border-l-2 border-line pl-6">
            {about.timeline.map((t) => (
              <li key={t.title} className="relative">
                <span
                  aria-hidden
                  className={cx('absolute -left-[1.98rem] top-1.5 size-3.5 rounded-full border-[3px] border-white', 'current' in t && t.current ? 'bg-orange shadow-[0_0_0_4px_rgb(255_90_10/0.2)]' : 'bg-[#e7c8b4]')}
                />
                <p className="text-sm font-semibold uppercase tracking-[0.06em] text-orange-ink">{t.period}</p>
                <h3 className="mt-0.5 text-lg font-bold">{t.title}</h3>
                <p className="mt-1 text-muted">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="skills" className="bg-ivory/70 py-12 lg:py-16">
        <div className="wrap">
          <h2 id="skills" className="t-h2 reveal">Skills & expertise</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {about.skills.map((s, i) => {
              const Icon = skillIcons[i];
              return (
                <article key={s.title} className="card reveal p-5 sm:p-6">
                  <Icon size={26} className="text-orange" aria-hidden />
                  <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {s.items.map((x) => (
                      <li key={x} className="rounded-full border border-line bg-ivory px-3 py-1.5 text-sm font-medium">
                        {x}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <h2 className="mt-10 text-lg font-bold reveal">Interests</h2>
          <ul className="reveal mt-3 flex flex-wrap gap-2">
            {about.interests.map((x) => (
              <li key={x} className="rounded-full bg-orange/10 px-3.5 py-1.5 text-sm font-semibold text-orange-ink">
                {x}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap py-12 lg:py-16">
        <div className="reveal rounded-[1.6rem] bg-panel p-7 text-white sm:p-10">
          <h2 className="text-[clamp(1.6rem,4.5vw,2.3rem)] font-extrabold tracking-[-0.035em]">
            What I&apos;m building <span className="serif-accent">now</span>
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {ventures.map((v) => (
              <li key={v.slug}>
                <Link to={`/ventures/${v.slug}`} className="flex min-h-14 items-center gap-3 rounded-2xl bg-white/[0.06] p-3 transition-colors hover:bg-white/[0.12]">
                  <img src={v.logo} width={40} height={40} alt="" loading="lazy" className="size-10 rounded-xl bg-white object-contain p-1" />
                  <span>
                    <span className="block font-bold">{v.name}</span>
                    <span className="text-sm text-[#c4c7cc]">{v.category}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <CalendlyButton>Talk to Rishu</CalendlyButton>
          </div>
        </div>
      </section>
    </>
  );
}
