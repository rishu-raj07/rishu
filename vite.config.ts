import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { site } from './src/config/site.ts';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Injects SEO metadata from src/config/site.ts into index.html at build time. */
function seoPlugin() {
  const sameAs = Object.values(site.socials).filter(Boolean);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    url: site.url,
    jobTitle: 'Founder',
    description: site.seo.description,
    image: site.url + site.logo.large,
    knowsAbout: site.interests,
    ...(sameAs.length ? { sameAs } : {}),
  };
  const values: Record<string, string> = {
    TITLE: site.seo.title,
    DESCRIPTION: site.seo.description,
    KEYWORDS: site.seo.keywords,
    NAME: site.name,
    URL: site.url,
    OG_IMAGE: site.url + site.seo.ogImage,
    OG_IMAGE_ALT: site.seo.ogImageAlt,
    LOCALE: site.seo.locale,
  };
  return {
    name: 'inject-seo',
    transformIndexHtml(html: string) {
      let out = html.replace(/%SEO_([A-Z_]+)%/g, (m, key: string) =>
        key in values ? escapeHtml(values[key]) : m,
      );
      out = out.replace('%JSON_LD%', JSON.stringify(jsonLd).replace(/</g, '\u003c'));
      if (site.seo.twitterHandle) {
        out = out.replace(
          '<!-- twitter:site -->',
          `<meta name="twitter:site" content="${escapeHtml(site.seo.twitterHandle)}" />`,
        );
      }
      return out;
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  build: {
    target: 'es2022',
    sourcemap: false,
  },
});
