import { ArrowRight, CalendarDays, FileText, Home as HomeIcon, Mail } from 'lucide-react';
import { AiChat } from '../components/AiChat';
import { ContactForm } from '../components/ContactForm';
import { Avatar, Breadcrumbs, CalendlyButton } from '../components/ui';
import type { Post } from '../content/posts';
import { posts } from '../content/posts';
import { links } from '../content/site';
import { GitHubIcon } from '../lib/icons';
import { Link } from '../lib/router';

export function AiPage() {
  return (
    <section className="hero-bg">
      <div className="wrap pb-14 pt-8 sm:pt-12">
        <Breadcrumbs items={[['Home', '/'], ['Ask Rishu AI', '/ai']]} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <p className="eyebrow">AI assistant</p>
            <h1 className="t-display mt-4 !text-[clamp(2.1rem,7vw,3.4rem)]">
              Ask Rishu <span className="serif-accent">AI.</span>
            </h1>
            <p className="t-lead mt-4 text-muted">
              Curious about my background, hospitality experience or the ventures I&apos;m building? Ask here — answers only use information I&apos;ve approved.
            </p>
            <ul className="mt-6 hidden space-y-2 text-[0.95rem] text-muted lg:block">
              <li>• Powered by Cloudflare Workers AI through a secure server endpoint.</li>
              <li>• It won&apos;t invent achievements, numbers or commitments.</li>
              <li>• Want to talk to me directly? Book a call or send a message.</li>
            </ul>
          </div>
          <AiChat variant="page" />
        </div>
      </div>
    </section>
  );
}

export function BlogIndex() {
  return (
    <section className="hero-bg">
      <div className="wrap pb-14 pt-8 sm:pt-12">
        <Breadcrumbs items={[['Home', '/'], ['Blog', '/blog']]} />
        <p className="eyebrow">Blog</p>
        <h1 className="t-display mt-4 !text-[clamp(2.1rem,7vw,3.4rem)]">
          Notes on <span className="serif-accent">building.</span>
        </h1>
        <p className="t-lead mt-4 max-w-2xl text-muted">Articles and case studies on hospitality technology, logistics, AI and what I learn while building.</p>
        {posts.length === 0 ? (
          <div className="card mt-8 max-w-2xl p-6 sm:p-8">
            <FileText size={28} className="text-orange" aria-hidden />
            <h2 className="mt-3 text-xl font-bold">The first articles are being written</h2>
            <p className="mt-2 text-muted">
              I&apos;d rather publish nothing than publish filler. Real write-ups on EasStay OS, IMCircle and RapidFoxx will appear here soon.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/ventures" className="btn btn-secondary !text-base">
                Explore ventures <ArrowRight size={18} aria-hidden />
              </Link>
              <Link to="/ai" className="btn btn-secondary !text-base">
                Ask Rishu AI
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug} className="card reveal overflow-hidden">
                {p.image && <img src={p.image.src} width={p.image.width} height={p.image.height} alt={p.image.alt} loading="lazy" className="aspect-[16/9] w-full object-cover" />}
                <div className="p-5">
                  <p className="text-sm text-muted">
                    <time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</time> · {p.category}
                  </p>
                  <h2 className="mt-1 text-lg font-bold">
                    <Link to={`/blog/${p.slug}`}>{p.title}</Link>
                  </h2>
                  <p className="mt-1 text-[0.95rem] text-muted">{p.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export function BlogPost({ post }: { post: Post }) {
  return (
    <article className="wrap max-w-3xl pb-14 pt-8 sm:pt-12">
      <Breadcrumbs items={[['Home', '/'], ['Blog', '/blog'], [post.title, `/blog/${post.slug}`]]} />
      <p className="text-sm text-muted">
        <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</time> · {post.category}
      </p>
      <h1 className="t-h2 mt-2">{post.title}</h1>
      {post.image && <img src={post.image.src} width={post.image.width} height={post.image.height} alt={post.image.alt} className="mt-6 w-full rounded-2xl" />}
      <div className="mt-6 space-y-4 text-[1.05rem] leading-relaxed text-ink/90">
        {post.body.map((b, i) =>
          b.type === 'h2' ? (
            <h2 key={i} className="pt-4 text-2xl font-bold">{b.text}</h2>
          ) : b.type === 'ul' ? (
            <ul key={i} className="list-disc space-y-1 pl-6">{b.items?.map((x) => <li key={x}>{x}</li>)}</ul>
          ) : (
            <p key={i}>{b.text}</p>
          ),
        )}
      </div>
    </article>
  );
}

export function ContactPage() {
  return (
    <section className="hero-bg">
      <div className="wrap pb-14 pt-8 sm:pt-12">
        <Breadcrumbs items={[['Home', '/'], ['Contact', '/contact']]} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <p className="eyebrow">Contact</p>
            <h1 className="t-display mt-4 !text-[clamp(2.1rem,7vw,3.4rem)]">
              Let&apos;s build something <span className="serif-accent">together.</span>
            </h1>
            <p className="t-lead mt-4 text-muted">Collaborations, business opportunities, investment discussions or technology projects — pick whatever is easiest for you.</p>
            <div className="card mt-6 p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <CalendarDays size={20} className="text-orange" aria-hidden /> Book a 30-minute call
              </h2>
              <p className="mt-1 text-[0.95rem] text-muted">Choose a time that works for you on Calendly — it shows slots in your own timezone and sends the confirmation.</p>
              <CalendlyButton className="mt-4">Schedule a Call</CalendlyButton>
            </div>
            <div className="card mt-4 p-5">
              <h2 className="flex items-center gap-2 font-bold">
                <Mail size={20} className="text-orange" aria-hidden /> Prefer writing?
              </h2>
              <p className="mt-1 text-[0.95rem] text-muted">Use the form and I&apos;ll reply by email.</p>
              {links.socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-ink hover:text-orange-ink">
                  <GitHubIcon size={18} /> Follow on {s.label}
                </a>
              ))}
            </div>
          </div>
          <ContactForm idPrefix="contact" />
        </div>
      </div>
    </section>
  );
}

export function NotFound() {
  return (
    <section className="hero-bg">
      <div className="wrap flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <Avatar size={112} alt="" className="!size-24" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.1em] text-orange-ink">Error 404</p>
        <h1 className="t-h2 mt-2">This page doesn&apos;t exist.</h1>
        <p className="mt-3 max-w-md text-muted">The link may be broken or the page may have moved. Here are a few good places to go instead.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-primary">
            <HomeIcon size={19} aria-hidden /> Back home
          </Link>
          <Link to="/ventures" className="btn btn-secondary">
            Explore ventures
          </Link>
        </div>
      </div>
    </section>
  );
}
