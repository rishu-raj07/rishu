/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONFIGURATION — the single place to edit site content.
 * ─────────────────────────────────────────────────────────────
 *  Everything in this file is PUBLIC (it ships in the browser bundle).
 *  Never put passwords, private API keys or tokens here.
 *
 *  Empty strings ('') are treated as "not configured": the related
 *  link/button is hidden or replaced by a safe fallback instead of
 *  showing a broken link.
 */

/** Read a public Vite env var safely (also works when imported by vite.config.ts). */
function env(value: string | undefined): string {
  return (value ?? '').trim();
}
const viteEnv: Partial<ImportMetaEnv> =
  typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const site = {
  name: 'Rishu Raj',
  shortName: 'Rishu',
  initials: 'RR',
  /** Brand mark (generated from the original in /public/brand). */
  logo: {
    small: '/brand/rr-logo-96.webp',
    medium: '/brand/rr-logo-192.webp',
    large: '/brand/rr-logo-512.png',
  },
  roles: ['Founder.', 'Builder.', 'Explorer.'],
  headline: "Building What's Next.",
  intro:
    'Exploring technology, hospitality, and entrepreneurship — turning real-world problems into meaningful products.',
  bookingHeadline: "Let's Build Something Meaningful.",
  bookingText:
    "Whether it's a collaboration, startup idea, partnership, or an interesting conversation, I'd love to hear from you.",
  currentFocus: 'EasStay OS — an AI-powered hotel operating system',

  domain: 'rishuraj.tech',
  url: 'https://rishuraj.tech',

  /** Public contact email. Leave '' to hide email buttons. e.g. 'hello@rishuraj.tech' */
  email: '',
  /** Optional public phone number. Leave '' to keep it private (recommended). */
  phone: '',
  /** Path to a real CV file inside /public (e.g. '/Rishu-Raj-CV.pdf'). Leave '' to hide the button. */
  cvUrl: '',

  /** Social profiles — paste full URLs. Empty entries are hidden. */
  socials: {
    github: '', // e.g. 'https://github.com/your-username'
    linkedin: '', // e.g. 'https://www.linkedin.com/in/your-profile'
    instagram: '', // e.g. 'https://www.instagram.com/your-handle'
    x: '', // optional, e.g. 'https://x.com/your-handle'
  },

  integrations: {
    /** Formspree endpoint — set VITE_FORMSPREE_ENDPOINT (see .env.example). */
    formEndpoint: env(viteEnv.VITE_FORMSPREE_ENDPOINT),
    /** Calendly / Google Calendar booking page — set VITE_SCHEDULING_URL. */
    schedulingUrl: env(viteEnv.VITE_SCHEDULING_URL),
  },

  bio: [
    "I'm Rishu Raj, a founder and builder with six years of hands-on experience in hotel operations — three years at the reception desk and three years in property management.",
    'Working on the operational side of hospitality gave me a practical view of how hotels actually run: the daily workflows, the systems behind them, and the small moments that shape a guest’s stay. That perspective now shapes how I build software.',
    'Alongside that, I learned software development and now build full-stack products while exploring business opportunities across hospitality technology, SaaS, logistics, and digital products — with a focus on solving real problems for the people who face them every day.',
  ],

  stats: [
    { value: '6', unit: 'years', label: 'in hotel operations' },
    { value: '3', unit: 'years', label: 'at hotel reception' },
    { value: '3', unit: 'years', label: 'in property management' },
  ],

  interests: [
    'Hospitality technology',
    'SaaS',
    'Logistics',
    'Entrepreneurship',
    'Digital products',
  ],

  journey: [
    {
      icon: 'hotel',
      title: 'Early experience in hospitality',
      text: 'Started my career inside hotels, learning how guest service, teams and operations come together on the ground.',
    },
    {
      icon: 'concierge',
      title: 'Reception operations',
      text: 'Three years at the front desk — check-ins, reservations, guest requests and the systems that keep a property moving.',
    },
    {
      icon: 'building',
      title: 'Property management',
      text: 'Three years managing property operations, coordinating teams, workflows and the day-to-day running of hotels.',
    },
    {
      icon: 'code',
      title: 'Learning software development',
      text: 'Taught myself to build for the web — JavaScript, React, Node.js and the full-stack tools behind modern products.',
    },
    {
      icon: 'boxes',
      title: 'Building technology products',
      text: 'Began turning ideas into working software, combining operational experience with product thinking.',
    },
    {
      icon: 'rocket',
      title: 'Exploring entrepreneurship',
      text: 'Exploring ventures across hospitality, travel, logistics and social platforms — testing ideas against real-world problems.',
    },
    {
      icon: 'sparkles',
      title: 'Now: hospitality technology',
      text: 'Focused on building technology for hotels — starting with EasStay OS, an AI-powered hotel operating system.',
      current: true,
    },
  ],

  /**
   * Projects. Leave `website` / `github` as '' until real links exist.
   * Only list technologies that are actually used.
   */
  projects: [
    {
      id: 'easstay',
      name: 'EasStay OS',
      tagline: 'AI-powered hotel operating system',
      status: 'In Development',
      description:
        'An operating system for hotels that brings day-to-day operations, guest experience and automation into one place — designed from first-hand experience running hotel front desks and properties.',
      focus: [
        'Hotel operations',
        'Guest experience',
        'Automation',
        'Multi-property management',
        'Hospitality technology',
      ],
      stack: [] as string[],
      website: '',
      github: '',
      featured: true,
    },
    {
      id: 'imcircle',
      name: 'IMCircle',
      tagline: 'Social networking for growth',
      status: '',
      description:
        'A social networking platform focused on growth, learning and meaningful professional connections.',
      focus: ['Professional networking', 'Learning', 'Personal growth', 'Community'],
      stack: [] as string[],
      website: '',
      github: '',
      featured: false,
    },
    {
      id: 'rapidfoxx',
      name: 'RapidFoxx Logistics',
      tagline: 'Technology-led logistics',
      status: 'Exploring',
      description:
        'A technology-led logistics initiative exploring delivery and shipping infrastructure.',
      focus: ['Delivery', 'Shipping infrastructure', 'Logistics technology'],
      stack: [] as string[],
      website: '',
      github: '',
      featured: false,
    },
    {
      id: 'easexplore',
      name: 'EasExplore',
      tagline: 'Hospitality & travel technology',
      status: 'Exploring',
      description: 'A home for hospitality and travel technology initiatives.',
      focus: ['Travel technology', 'Hospitality', 'Guest discovery'],
      stack: [] as string[],
      website: '',
      github: '',
      featured: false,
    },
  ],

  skills: [
    {
      id: 'technology',
      icon: 'code',
      title: 'Technology',
      description: 'Building full-stack web products end to end.',
      items: [
        'React',
        'JavaScript',
        'TypeScript',
        'Node.js',
        'Express',
        'MongoDB',
        'REST APIs',
        'Full-stack development',
        'Git & GitHub',
      ],
    },
    {
      id: 'hospitality',
      icon: 'hotel',
      title: 'Hospitality',
      description: 'Six years inside hotel operations.',
      items: [
        'Hotel operations',
        'Front desk management',
        'Property management',
        'Guest experience',
        'Operational workflows',
      ],
    },
    {
      id: 'business',
      icon: 'briefcase',
      title: 'Business',
      description: 'Turning ideas into products and ventures.',
      items: [
        'Product development',
        'Entrepreneurship',
        'Startup operations',
        'Customer discovery',
        'Business development',
      ],
    },
  ],

  /**
   * Meeting types. `url` may point to a specific event type
   * (e.g. https://calendly.com/you/15min); otherwise the main
   * scheduling URL is used.
   */
  meetings: [
    {
      id: 'intro',
      minutes: 15,
      title: 'Introduction',
      description: 'A quick hello to see where we might work together.',
      url: '',
    },
    {
      id: 'collab',
      minutes: 30,
      title: 'Collaboration call',
      description: 'Dig into a project, partnership or startup idea.',
      url: '',
    },
    {
      id: 'business',
      minutes: 45,
      title: 'Business discussion',
      description: 'A deeper conversation on opportunities and next steps.',
      url: '',
    },
  ],

  contactReasons: [
    'Collaboration',
    'Partnership',
    'Investment discussion',
    'Startup opportunity',
    'Business enquiry',
    'Speaking invitation',
    'Technology project',
    'General message',
    'Meeting request',
  ] as const,

  seo: {
    title: "Rishu Raj — Founder. Builder. Explorer. | Building What's Next",
    description:
      'Rishu Raj is a founder and builder with six years in hotel operations, building technology for hospitality — including EasStay OS, an AI-powered hotel operating system.',
    keywords:
      'Rishu Raj, founder, builder, hospitality technology, hotel technology, EasStay OS, SaaS, startup, rishuraj.tech',
    ogImage: '/og-image.png',
    ogImageAlt: "Rishu Raj — Building What's Next.",
    twitterHandle: '', // e.g. '@yourhandle'
    themeColor: '#080808',
    locale: 'en_US',
  },

  /** Section ids used for navigation. 'book' is rendered as the CTA button. */
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'journey', label: 'Journey' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Connect' },
  ],
};

export type Site = typeof site;
export type Project = Site['projects'][number];
export type Meeting = Site['meetings'][number];
export type ContactReason = Site['contactReasons'][number];
