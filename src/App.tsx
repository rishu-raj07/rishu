import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import { BackToTop, ScrollProgress, Toaster } from './components/Chrome';
import { Navbar } from './components/Navbar';
import { About } from './sections/About';
import { BookCall } from './sections/BookCall';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { Hero } from './sections/Hero';
import { Journey } from './sections/Journey';
import { Projects } from './sections/Projects';
import { Skills } from './sections/Skills';

export default function App() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ScrollProgress />
        <Navbar />
        <main id="main">
          <Hero />
          <About />
          <Journey />
          <Projects />
          <Skills />
          <BookCall />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
        <Toaster />
      </MotionConfig>
    </LazyMotion>
  );
}
