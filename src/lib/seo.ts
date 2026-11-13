import { getPost, posts } from '../content/posts';
import { about, links, profile, SITE_URL, ventures } from '../content/site';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  robots: string;
  ogType: 'website' | 'article' | 'profile';
  image: string;
  imageAlt: string;
  jsonLd: object[];
  status: 200 | 404;
}

const OG = { image: `${SITE_URL}/og-image.png`, alt: "Rishu Raj — Building what's next." };
const personId = `${SITE_URL}/#person`;
const websiteId = `${SITE_URL}/#website`;

const person = {
  '@type': 'Person',
  '@id': personId,
  name: profile.name,
  url: SITE_URL,
  image: `${SITE_URL}/icon-512.png`,
  jobTitle: 'Entrepreneur & Developer',
  description: profile.positioning,
  knowsAbout: about.interests,
  sameAs: links.socials.map((s) => s.href),
};

const website = {
  '@type': 'WebSite',
  '@id': websiteId,
  url: SITE_URL,
  name: 'Rishu Raj',
  inLanguage: 'en',
  publisher: { '@id': personId },
};

function breadcrumbs(items: [string, string][]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${SITE_URL}${path === '/' ? '/' : path}`,
    })),
  };
}

const graph = (...nodes: object[]) => [{ '@context': 'https://schema.org', '@graph': nodes }];

/** Every public route that is prerendered. */
export function publicRoutes(): string[] {
  return [
    '/',
    '/about',
    '/ventures',
    ...ventures.map((v) => `/ventures/${v.slug}`),
    '/ai',
    '/blog',
    ...posts.map((p) => `/blog/${p.slug}`),
    '/contact',
  ];
}

export function getMeta(path: string): PageMeta {
  const base = { path, robots: 'index, follow, max-image-preview:large', ogType: 'website' as const, image: OG.image, imageAlt: OG.alt, status: 200 as const };

  if (path === '/') {
    return {
      ...base,
      title: 'Rishu Raj | Entrepreneur, Developer & Technology Builder',
      description:
        "Explore Rishu Raj's journey in entrepreneurship, technology, AI, and hospitality. Discover his projects, experience, and opportunities to connect.",
      jsonLd: graph(website, person, {
        '@type': 'ProfilePage',
        '@id': `${SITE_URL}/#profile`,
        url: SITE_URL,
        name: 'Rishu Raj',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      }),
    };
  }
  if (path === '/about') {
    return {
      ...base,
      ogType: 'profile',
      title: 'About Rishu Raj | Hospitality Professional Turned Developer & Founder',
      description:
        'Rishu Raj spent six years in hotel operations — three at reception and three in property management — before building software products in hospitality tech, logistics and AI.',
      jsonLd: graph(person, {
        '@type': 'ProfilePage',
        url: `${SITE_URL}/about`,
        name: 'About Rishu Raj',
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      }, breadcrumbs([['Home', '/'], ['About', '/about']])),
    };
  }
  if (path === '/ventures') {
    return {
      ...base,
      title: 'Ventures & Projects by Rishu Raj | EasStay OS, IMCircle, RapidFoxx',
      description:
        'Explore the ventures Rishu Raj is building: EasStay OS for hotels, IMCircle for builders and learners, and RapidFoxx for logistics.',
      jsonLd: graph({
        '@type': 'CollectionPage',
        url: `${SITE_URL}/ventures`,
        name: 'Ventures & Projects',
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        hasPart: ventures.map((v) => ({ '@type': 'CreativeWork', name: v.name, url: `${SITE_URL}/ventures/${v.slug}`, creator: { '@id': personId } })),
      }, breadcrumbs([['Home', '/'], ['Ventures', '/ventures']])),
    };
  }
  const v = ventures.find((x) => path === `/ventures/${x.slug}`);
  if (v) {
    return {
      ...base,
      title: v.seoTitle,
      description: v.seoDescription,
      image: `${SITE_URL}${v.gallery[0].src}`,
      imageAlt: v.gallery[0].alt,
      jsonLd: graph({
        '@type': 'WebPage',
        url: `${SITE_URL}${path}`,
        name: v.seoTitle,
        description: v.seoDescription,
        isPartOf: { '@id': websiteId },
        about: { '@type': 'CreativeWork', name: v.name, creator: { '@id': personId }, genre: v.category },
      }, breadcrumbs([['Home', '/'], ['Ventures', '/ventures'], [v.name, path]])),
    };
  }
  if (path === '/ai') {
    return {
      ...base,
      title: "Ask Rishu AI | Chat About Rishu Raj's Work & Ventures",
      description: "Ask Rishu AI questions about Rishu Raj's background, hospitality experience, skills and ventures like EasStay OS, IMCircle and RapidFoxx.",
      jsonLd: graph({ '@type': 'WebPage', url: `${SITE_URL}/ai`, name: 'Ask Rishu AI', isPartOf: { '@id': websiteId } }, breadcrumbs([['Home', '/'], ['Ask Rishu AI', '/ai']])),
    };
  }
  if (path === '/blog') {
    return {
      ...base,
      // Keep the empty index out of search results until real articles are published.
      robots: posts.length ? base.robots : 'noindex, follow',
      title: 'Blog | Rishu Raj — Notes on Building, Hospitality & AI',
      description: 'Articles and case studies by Rishu Raj on building products, hospitality technology, logistics and AI.',
      jsonLd: graph({ '@type': 'Blog', url: `${SITE_URL}/blog`, name: 'Rishu Raj — Blog', author: { '@id': personId } }, breadcrumbs([['Home', '/'], ['Blog', '/blog']])),
    };
  }
  const post = path.startsWith('/blog/') ? getPost(path.slice(6)) : undefined;
  if (post) {
    return {
      ...base,
      ogType: 'article',
      title: `${post.title} | Rishu Raj`,
      description: post.description,
      image: post.image ? `${SITE_URL}${post.image.src}` : OG.image,
      imageAlt: post.image?.alt ?? OG.alt,
      jsonLd: graph({
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        url: `${SITE_URL}${path}`,
        mainEntityOfPage: `${SITE_URL}${path}`,
        author: { '@id': personId },
        publisher: { '@id': personId },
        articleSection: post.category,
        ...(post.image ? { image: `${SITE_URL}${post.image.src}` } : {}),
      }, breadcrumbs([['Home', '/'], ['Blog', '/blog'], [post.title, path]])),
    };
  }
  if (path === '/contact') {
    return {
      ...base,
      title: 'Contact Rishu Raj | Book a Call or Send a Message',
      description: 'Get in touch with Rishu Raj about collaborations, business opportunities or technology projects — book a 30-minute call or send a message.',
      jsonLd: graph({ '@type': 'ContactPage', url: `${SITE_URL}/contact`, name: 'Contact Rishu Raj', isPartOf: { '@id': websiteId }, about: { '@id': personId } }, breadcrumbs([['Home', '/'], ['Contact', '/contact']])),
    };
  }
  return {
    ...base,
    status: 404,
    robots: 'noindex, follow',
    title: 'Page not found | Rishu Raj',
    description: "This page doesn't exist. Explore Rishu Raj's ventures, story and ways to connect.",
    jsonLd: [],
  };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Head tags for prerendering. */
export function renderHead(m: PageMeta): string {
  const url = `${SITE_URL}${m.path === '/' ? '/' : m.path}`;
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${m.robots}" />`,
    m.status === 200 ? `<link rel="canonical" href="${url}" />` : '',
    `<meta property="og:type" content="${m.ogType}" />`,
    `<meta property="og:site_name" content="Rishu Raj" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    m.status === 200 ? `<meta property="og:url" content="${url}" />` : '',
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:alt" content="${esc(m.imageAlt)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    ...m.jsonLd.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, '\\u003c')}</script>`),
  ];
  return tags.filter(Boolean).join('\n    ');
}

/** Client-side head sync after in-app navigation. */
export function applyHead(m: PageMeta) {
  document.title = m.title;
  const set = (sel: string, attr: string, value: string) => {
    const el = document.head.querySelector(sel);
    if (el) el.setAttribute(attr, value);
  };
  const url = `${SITE_URL}${m.path === '/' ? '/' : m.path}`;
  set('meta[name="description"]', 'content', m.description);
  set('meta[name="robots"]', 'content', m.robots);
  set('link[rel="canonical"]', 'href', url);
  set('meta[property="og:title"]', 'content', m.title);
  set('meta[property="og:description"]', 'content', m.description);
  set('meta[property="og:url"]', 'content', url);
  set('meta[name="twitter:title"]', 'content', m.title);
  set('meta[name="twitter:description"]', 'content', m.description);
}
