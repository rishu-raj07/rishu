# rishuraj.tech

Personal website of **Rishu Raj** — Founder. Builder. Explorer.

A static, mobile-first site built with React 19, Vite 8, TypeScript, Tailwind CSS 4, and Motion.
Deploys to **Cloudflare Pages (free)**. There is no backend, database, or paid API.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript only
npm run build      # typecheck + production build -> dist/
npm run preview    # serve the built site locally
```

Requires Node.js 20.19+ (tested with Node 24).

## Editing content

**All content is in [`src/config/site.ts`](src/config/site.ts).** That covers the name, intro, bio, stats, journey, projects, skills, meeting types, contact reasons, nav, socials, and SEO.

- An **empty string (`''`) means "not configured"**. The related button or link is hidden or replaced by a safe fallback, so the site never shows a broken link.
- Socials: paste full `https://` URLs into `site.socials`.
- Email: set `site.email` to show the email card, the copy button, and the `mailto:` fallback.
- CV: put a real PDF in `public/` and set `site.cvUrl` (for example `'/Rishu-Raj-CV.pdf'`) to show the **Download CV** button.
- Projects: set `website` or `github` when real links exist. List a `stack` only for technologies the project actually uses.
- SEO title, description, and Open Graph values are injected into `index.html` from `site.seo` at build time.

## Integrations (environment variables)

Both values are **public** and are baked into the static build. Never put secrets in `VITE_*` variables.

| Variable | Example | Purpose |
| --- | --- | --- |
| `VITE_FORMSPREE_ENDPOINT` | `https://formspree.io/f/abcdwxyz` | Contact form delivery |
| `VITE_SCHEDULING_URL` | `https://calendly.com/your-name` | Book a Call |

For local use, copy `.env.example` to `.env`. For production, set the variables in Cloudflare Pages (see below). Changing a variable requires a new build or deploy.

### Contact form: Formspree (free tier)

1. Sign up at <https://formspree.io> and **verify your email address**. Formspree delivers to verified addresses only.
2. **New Form**. Name it `rishuraj.tech` and choose the email that should receive messages.
3. Copy the endpoint (`https://formspree.io/f/xxxxxxx`) and set it as `VITE_FORMSPREE_ENDPOINT`.
4. Optional: in the form's **Settings → Restrict to domain**, enter `rishuraj.tech`.
5. Deploy, then **send a real test message from the live site** and confirm it arrives. The first submission may ask you to confirm the form by email.

How the form behaves:

- Validation with Zod. Errors are linked with `aria-describedby`, and focus moves to the first invalid field.
- Spam protection: a hidden honeypot field, a minimum time-to-submit check, and Formspree's own spam filtering.
- **No endpoint but `site.email` set:** the form opens the visitor's email app with the message pre-filled.
- **No endpoint and no email:** the form shows an honest "not connected yet" error. It never shows a fake success.
- Success is shown only after Formspree returns HTTP 2xx.

### Book a Call: Calendly (free) or Google Calendar appointment schedules

1. Create a Calendly account (the free plan includes one event type) or a Google Calendar appointment schedule.
2. Copy the public booking-page URL and set it as `VITE_SCHEDULING_URL`.
3. Optional: give each meeting card its own event link through `meetings[].url` in `site.ts` (for example `https://calendly.com/you/15min`).

Booking buttons open the provider's own page in a new tab. That gives a full-screen mobile experience with no cramped iframe. Timezone handling and confirmations come from the provider.
**When no URL is set**, each card becomes a clearly labelled **meeting request** that pre-fills the contact form. Nothing is ever shown as "booked".

## Project structure

```
public/            brand/ (RR logo sizes), favicon-32/192.png, og-image.png, apple-touch-icon.png, robots.txt,
                   sitemap.xml, site.webmanifest, 404.html, _headers (Cloudflare)
src/
  config/site.ts   ← all site content and settings
  components/      Navbar, Button (magnetic), Reveal, SectionHeading, SocialLinks, Chrome (progress/back-to-top/toasts)
  sections/        Hero, About, Journey, Projects, Skills, BookCall, Contact, ContactForm (lazy), Footer
  hooks/           useActiveSection, useCopy, useMedia
  lib/             utils, icons, contact-bridge
  styles/index.css design tokens (orange/black), utilities, 3D object, form styles
```

## Deploying to Cloudflare Pages

### 1. Create the GitHub repository

On GitHub, create a new **empty** repository (for example `rishuraj.tech`), with no README or .gitignore. Then run:

```bash
git init -b main
git add .
git commit -m "Initial commit: rishuraj.tech"
git remote add origin https://github.com/<your-username>/rishuraj.tech.git
git push -u origin main
```

`.env` is ignored by git. Check with `git status` that no `.env` file is staged.

### 2. Connect to Cloudflare Pages

1. Open the Cloudflare dashboard, then go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Authorise GitHub and select the `rishuraj.tech` repository.
3. Use these build settings:
   - Framework preset: **None** (or Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variables (Production *and* Preview): `NODE_VERSION` = `22`, `VITE_FORMSPREE_ENDPOINT`, `VITE_SCHEDULING_URL`
4. **Save and Deploy**. You get a `*.pages.dev` URL. Test it fully before adding the domain.

### 3. Custom domain, DNS and SSL

1. In the Pages project, go to **Custom domains → Set up a custom domain** and enter `rishuraj.tech`. Repeat for `www.rishuraj.tech`.
2. **If `rishuraj.tech` already uses Cloudflare DNS:** Cloudflare adds the CNAME records automatically. Confirm the prompt.
   **If the domain is registered elsewhere:** either move the nameservers to Cloudflare (Add a site → Free plan → update nameservers at your registrar), or add a `CNAME` record at your DNS provider: `www` → `<project>.pages.dev`. An apex `CNAME` requires Cloudflare DNS or a provider with CNAME flattening or ALIAS records.
3. Only change records for `rishuraj.tech`. Do not touch other domains or projects.
4. SSL certificates are issued automatically, usually within minutes. In **SSL/TLS** set the mode to **Full (strict)** and enable **Always Use HTTPS**.
5. Optional: add a redirect so `www` goes to the apex. Use **Rules → Redirect Rules** with `www.rishuraj.tech/*` → `https://rishuraj.tech/${1}` and status 301.

### 4. Verify

- `https://rishuraj.tech` loads with a valid padlock, and `http://` redirects to `https://`.
- `https://rishuraj.tech/robots.txt` and `/sitemap.xml` load. `/anything-random` shows the custom 404 page.
- Send a real contact-form message and confirm it arrives in your inbox.
- Click each Book a Call button and confirm it opens your scheduling page.
- Check the link preview with <https://www.opengraph.xyz> or by pasting the URL into LinkedIn or X.
- Run Lighthouse (Chrome DevTools, Mobile).
- Submit the sitemap in Google Search Console.

## Notes

- `public/_headers` sets security headers and long-term caching for hashed assets.
- `public/404.html` is served by Cloudflare Pages for unknown paths with a real 404 status.
- Motion effects respect `prefers-reduced-motion`. Cursor and magnetic effects run only on devices with a fine pointer and hover.
