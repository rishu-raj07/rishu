import { useEffect, useRef } from 'react';
import { Shell } from './components/Layout';
import { getPost } from './content/posts';
import { ventures } from './content/site';
import { About } from './pages/About';
import { Home } from './pages/Home';
import { AiPage, BlogIndex, BlogPost, ContactPage, NotFound } from './pages/Misc';
import { VentureDetail, VenturesIndex } from './pages/Ventures';
import { RouterProvider, useRouter } from './lib/router';
import { applyHead, getMeta } from './lib/seo';

function Page({ path }: { path: string }) {
  if (path === '/') return <Home />;
  if (path === '/about') return <About />;
  if (path === '/ventures') return <VenturesIndex />;
  const v = ventures.find((x) => path === `/ventures/${x.slug}`);
  if (v) return <VentureDetail v={v} />;
  if (path === '/ai') return <AiPage />;
  if (path === '/blog') return <BlogIndex />;
  const post = path.startsWith('/blog/') ? getPost(path.slice(6)) : undefined;
  if (post) return <BlogPost post={post} />;
  if (path === '/contact') return <ContactPage />;
  return <NotFound />;
}

/** Scroll-reveal + head sync whenever the route changes. */
function Routes() {
  const { path } = useRouter();
  const first = useRef(true);

  useEffect(() => {
    if (!first.current) applyHead(getMeta(path));
    first.current = false;

    const els = document.querySelectorAll<HTMLElement>('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) {
      els.forEach((e) => e.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  return (
    <Shell>
      <Page path={path} />
    </Shell>
  );
}

export default function App({ path }: { path: string }) {
  return (
    <RouterProvider initialPath={path}>
      <Routes />
    </RouterProvider>
  );
}
