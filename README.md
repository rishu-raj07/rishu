# rishuraj.tech

Personal website of **Rishu Raj**: entrepreneur, developer and hospitality professional.
Live at **https://rishuraj.tech** (Cloudflare Pages project `rishuraj`).

## Stack

- React 19, Vite 8, TypeScript and Tailwind CSS 4
- **Static prerendering.** Every route is rendered to real HTML at build time by `scripts/prerender.mjs`, so search engines see full content. The page is then hydrated, and client-side navigation takes over.
- **Ask Rishu AI.** A Cloudflare Pages Function (`functions/api/chat.ts`) using the **Workers AI** binding (`wrangler.toml`). There are no API keys in the browser. Answers are grounded in `src/content/knowledge.ts`. It has origin checks, input validation and per-IP rate limiting.
- **Contact form.** Posts by AJAX to Formspree (`https://formspree.io/f/mwloparw`). It has validation, a honeypot, a minimum time-to-submit check and duplicate-submit protection.
- **Booking.** Every booking CTA opens the Calendly event `https://calendly.com/rishurajmld/30min`. On desktop it opens as a popup; on mobile it opens the event page directly.
- **PWA.** `site.webmanifest`, app icons and a versioned service worker (`scripts/sw.template.js`). Pages load network-first, so deploys are never stale.

## Editing content

All copy, links and venture data live in **`src/content/site.ts`**. The AI knowledge base is generated from that file, so the website and the assistant stay consistent.

- **Socials:** add LinkedIn, Instagram or YouTube to `links.socials` once the URLs are confirmed. They then appear in the header and footer and in the `sameAs` structured data.
- **Blog:** add articles to `src/content/posts.ts`. Only posts with `draft: false` are published, prerendered and added to the sitemap. `/blog` stays `noindex` until the first real post exists.
- **Images:** optimized WebP files are in `public/img/`.

## Commands

```bash
npm install
npm run dev        # local dev server (AI endpoint not available)
npm run build      # typecheck, client build, SSR build, then prerender to dist/
npm run preview    # wrangler pages dev dist (includes /api/chat via Workers AI)
npm run deploy     # build, then deploy to production (branch main)
```

To deploy a preview, run `npx wrangler pages deploy dist --project-name rishuraj --branch preview`. It publishes to `https://preview.rishuraj.pages.dev`.

## Routes

`/`, `/about`, `/ventures`, `/ventures/easstay-os`, `/ventures/imcircle`, `/ventures/rapidfoxx`, `/ai`, `/blog`, `/contact`, and a custom `404.html` served with a real 404 status. Canonical URLs have no trailing slash; Cloudflare Pages redirects `/about/` to `/about`. `www` is 301-redirected to the root domain by a Cloudflare Redirect Rule.

## SEO

Each page has its own title, description, canonical URL, Open Graph and Twitter tags, plus JSON-LD structured data: Person, WebSite, ProfilePage, BreadcrumbList, and BlogPosting for published posts. `sitemap.xml` is generated at build time.

To submit to Google Search Console (domain already verified):

1. Go to **Sitemaps** and submit `https://rishuraj.tech/sitemap.xml`.
2. Use **URL Inspection** on `https://rishuraj.tech/`, `/about`, `/ventures` and each venture page, then click **Request indexing**.
