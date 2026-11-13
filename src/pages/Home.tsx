import { Mail } from 'lucide-react';
import { AiChat } from '../components/AiChat';
import { ContactForm } from '../components/ContactForm';
import { Hero } from '../components/Hero';
import { CalendlyButton, SectionHeader } from '../components/ui';
import { VentureCard, VentureCarousel } from '../components/Ventures';
import { ventures } from '../content/site';

export function Home() {
  return (
    <>
      <Hero />

      <section aria-labelledby="ventures-title" className="cv-auto wrap py-8 [contain-intrinsic-size:auto_900px] sm:py-12">
        <SectionHeader id="ventures-title" title="Ventures & Projects" action={{ to: '/ventures', label: 'Explore all' }} />
        <div className="gap-5 md:grid md:grid-cols-2 lg:grid-cols-4">
          <VentureCarousel />
          {ventures.map((v) => (
            <div key={v.slug} className="hidden md:block">
              <VentureCard v={v} className="reveal" />
            </div>
          ))}
          {/* One assistant instance for every breakpoint */}
          <AiChat className="reveal mt-6 md:col-span-2 md:mt-0 lg:col-span-1" />
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="cv-auto wrap pb-6 pt-4 sm:pb-20">
        <div className="reveal grid items-center gap-6 rounded-[1.6rem] bg-gradient-to-br from-[#fff1e8] via-ivory to-white p-6 shadow-soft sm:p-10 lg:grid-cols-[1fr_1.1fr_auto]">
          <h2 id="contact-title" className="text-[clamp(1.8rem,5vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em]">
            Let&apos;s build
            <br /> something <span className="serif-accent">together.</span>
          </h2>
          <p className="text-[1.05rem] leading-relaxed text-muted lg:border-l lg:border-line lg:pl-8">
            Have an idea, project or opportunity to discuss? I&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap gap-3">
            <CalendlyButton className="flex-1 sm:flex-none">Book a Meeting</CalendlyButton>
            <a href="#contact-form" className="btn btn-secondary flex-1 sm:flex-none">
              <Mail size={19} className="text-orange" aria-hidden />
              Get in Touch
            </a>
          </div>
        </div>
        <div id="contact-form" className="reveal mx-auto mt-8 max-w-3xl">
          <ContactForm idPrefix="home-contact" />
        </div>
      </section>
    </>
  );
}
