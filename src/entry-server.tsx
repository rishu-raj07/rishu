import { renderToString } from 'react-dom/server';
import App from './App';
import { getMeta, publicRoutes, renderHead } from './lib/seo';

/** Used at build time (scripts/prerender.mjs) to generate static HTML for every route. */
export function render(path: string) {
  const meta = getMeta(path);
  return { html: renderToString(<App path={path} />), head: renderHead(meta), status: meta.status, robots: meta.robots };
}

export { publicRoutes };
