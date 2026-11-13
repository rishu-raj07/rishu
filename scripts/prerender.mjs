// Prerenders every public route to static HTML (crawlable without JS),
// writes 404.html, sitemap.xml and a versioned service worker.
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const SITE = 'https://rishuraj.tech';

const { render, publicRoutes } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-->') || !template.includes('<!--head-->')) throw new Error('Template placeholders missing');

const page = (path) => {
  const { html, head } = render(path);
  return template.replace('<!--head-->', head).replace('<!--app-->', html);
};

// Cloudflare Pages serves /about from about.html (no trailing slash = canonical form).
const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`);

const routes = publicRoutes();
const indexable = [];
for (const route of routes) {
  const out = join(dist, fileFor(route));
  mkdirSync(dirname(out), { recursive: true });
  const html = page(route);
  writeFileSync(out, html);
  if (!/name="robots" content="noindex/.test(html)) indexable.push(route);
  console.log('prerendered', route, '->', fileFor(route));
}
writeFileSync(join(dist, '404.html'), page('/__not-found__'));
console.log('prerendered 404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map((r) => `  <url>\n    <loc>${SITE}${r === '/' ? '/' : r}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${r === '/' ? '1.0' : r.split('/').length > 2 ? '0.7' : '0.8'}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
console.log('sitemap.xml with', indexable.length, 'urls');

// Versioned service worker so each deploy gets a fresh cache.
const build = Date.now().toString(36);
const sw = readFileSync(join(root, 'scripts', 'sw.template.js'), 'utf8').replace('__BUILD__', build);
writeFileSync(join(dist, 'sw.js'), sw);
console.log('sw.js version', build);

if (existsSync(ssrDir)) rmSync(ssrDir, { recursive: true, force: true });
