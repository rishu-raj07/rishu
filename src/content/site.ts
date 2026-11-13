/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for copy, links and SEO.
 * ─────────────────────────────────────────────────────────────
 *  Everything here is public. Only add facts Rishu has approved:
 *  no invented metrics, funding, awards or credentials.
 *  The AI assistant's knowledge base is generated from this file.
 */

export const SITE_URL = 'https://rishuraj.tech';

export const links = {
  calendly: 'https://calendly.com/rishurajmld/30min',
  formspree: 'https://formspree.io/f/mwloparw',
  /** Only confirmed profiles. Add LinkedIn/Instagram/YouTube here once confirmed. */
  socials: [{ id: 'github', label: 'GitHub', href: 'https://github.com/rishu-raj07' }] as const,
};

export const profile = {
  name: 'Rishu Raj',
  roles: ['Entrepreneur', 'Developer', 'Hospitality'],
  headline: { lead: "Hi, I'm Rishu Raj.", line2: "Building what's", emphasis: 'next.' },
  intro: 'I turn curiosity into products — exploring opportunities at the intersection of technology, AI, and hospitality.',
  positioning:
    'Entrepreneur, developer, technology builder and hospitality professional exploring AI-powered products and business opportunities.',
  avatarAlt: 'Stylised 3D portrait of Rishu Raj with curly hair, glasses and a black T-shirt, arms crossed',
  heroCards: [
    { icon: 'rocket', title: 'Builder', text: 'Ideas → Products' },
    { icon: 'growth', title: 'Founder', text: 'Business & Growth' },
    { icon: 'code', title: 'Problem Solver', text: 'Tech × Operations' },
  ],
  stats: [
    { icon: 'bed', value: '6+', label: 'Years in hospitality' },
    { icon: 'layers', value: '3+', label: 'Product initiatives' },
    { icon: 'infinity', value: '∞', label: 'Curiosity' },
  ],
};

export const about = {
  title: 'From the front desk to building the tools.',
  story: [
    "I'm Rishu Raj — an entrepreneur and developer with six years of hands-on experience in hotel operations: three years at the reception desk and three years in property management.",
    'Working inside hotels every day gave me a practical view of how hospitality actually runs — the shift handovers, the guest requests, the systems behind every check-in, and the small moments that shape a stay.',
    'Alongside that work, I taught myself software development. Today I build full-stack products and explore business opportunities across hospitality technology, logistics, community platforms and AI — always starting from a real problem someone faces every day.',
  ],
  timeline: [
    { title: 'Hotel reception', period: '3 years', text: 'Front desk operations — check-ins, reservations, guest requests, cash handling and shift handovers.' },
    { title: 'Property management', period: '3 years', text: 'Running day-to-day property operations, coordinating teams and keeping workflows moving.' },
    { title: 'Learning to build software', period: 'Self-taught', text: 'JavaScript, React, Node.js, Express, MongoDB and REST APIs — learning by shipping real projects.' },
    { title: 'Building ventures', period: 'Now', text: 'EasStay OS, IMCircle and RapidFoxx — products shaped by operational experience.', current: true },
  ],
  skills: [
    { title: 'Technology', items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Express', 'MongoDB', 'REST APIs', 'Full-stack development', 'Git & GitHub'] },
    { title: 'Hospitality', items: ['Hotel operations', 'Front desk management', 'Property management', 'Guest experience', 'Operational workflows'] },
    { title: 'Business', items: ['Product development', 'Entrepreneurship', 'Startup operations', 'Customer discovery', 'Business development'] },
  ],
  interests: ['Hospitality technology', 'AI products', 'SaaS', 'Logistics', 'Community platforms', 'Entrepreneurship'],
};

export interface Venture {
  slug: string;
  name: string;
  category: string;
  chip: string;
  status: string;
  icon: 'bed' | 'users' | 'truck';
  logo: string;
  logoBg: string;
  summary: string;
  card: { src: string; srcSet: string; alt: string };
  seoTitle: string;
  seoDescription: string;
  intro: string;
  capabilities: { title: string; text: string }[];
  why: string;
  statusNote: string;
  gallery: { src: string; srcSet?: string; width: number; height: number; alt: string; caption: string; tall?: boolean }[];
}

export const ventures: Venture[] = [
  {
    slug: 'easstay-os',
    name: 'EasStay OS',
    category: 'Hospitality Technology · SaaS',
    chip: 'Hospitality · SaaS',
    status: 'In development',
    icon: 'bed',
    logo: '/img/logo-easstay.webp',
    logoBg: '#FFFFFF',
    summary: 'An AI-powered hotel operating system designed to simplify hotel operations and support hospitality teams.',
    card: {
      src: '/img/easstay-desk-640.webp',
      srcSet: '/img/easstay-desk-640.webp 640w, /img/easstay-desk-1200.webp 1200w',
      alt: 'EasStay OS front desk dashboard showing occupancy, shift cash and room status',
    },
    seoTitle: 'EasStay OS by Rishu Raj | AI-Powered Hotel Operating System',
    seoDescription:
      'EasStay OS is an AI-powered hotel operating system being built by Rishu Raj for independent hotels — reservations, front desk, housekeeping, maintenance and payments in one place.',
    intro:
      'EasStay OS is an operating system for independent hotels. It brings reservations, the front desk, housekeeping, maintenance, inventory, folios and payments into one mobile-first workspace — available in English and हिंदी.',
    capabilities: [
      { title: 'Front desk & reservations', text: 'Check-in, quick check-in, bookings, shift cash and handovers designed around how reception teams actually work.' },
      { title: 'Housekeeping & maintenance', text: 'Room status, cleaning and maintenance tasks visible to the whole team in real time.' },
      { title: 'Folios, inventory & payments', text: 'Guest folios, payments, expenses and inventory tracked in the same system as operations.' },
      { title: 'Portals for every role', text: 'Separate workspaces for hotel staff, management and platform administration.' },
      { title: 'Bilingual by design', text: 'A mobile-first interface available in English and Hindi for front-line teams.' },
      { title: 'Buddy, the in-app assistant', text: 'An AI assistant being built to help staff find answers and act on hotel data.' },
    ],
    why: 'Six years in hotel reception and property management showed me how much of a hotel runs on disconnected tools, paper notes and memory. EasStay OS is my attempt to give hospitality teams one calm, reliable system built from the operator’s point of view.',
    statusNote: 'In active development and not yet publicly launched. Screenshots are from a development build using demo data.',
    gallery: [
      {
        src: '/img/easstay-desk-1200.webp',
        srcSet: '/img/easstay-desk-640.webp 640w, /img/easstay-desk-1200.webp 1200w',
        width: 1200, height: 750,
        alt: 'EasStay OS front desk home screen with occupancy, cash summary, arrivals and room status',
        caption: 'Front desk home — development build with demo data.',
      },
      {
        src: '/img/easstay-mascot-1200.webp',
        srcSet: '/img/easstay-mascot-640.webp 640w, /img/easstay-mascot-1200.webp 1200w',
        width: 1200, height: 625,
        alt: 'EasStay OS concept art of the Buddy assistant robot beside bookings, staff, housekeeping and revenue panels',
        caption: 'Concept art for Buddy, the EasStay OS assistant.',
      },
    ],
  },
  {
    slug: 'imcircle',
    name: 'IMCircle',
    category: 'Community · Technology',
    chip: 'Community · Platform',
    status: 'In development',
    icon: 'users',
    logo: '/img/logo-imcircle.webp',
    logoBg: '#FFFFFF',
    summary: 'A social community platform for people who learn, build, connect, and grow.',
    card: {
      src: '/img/imcircle-streak-480.webp',
      srcSet: '/img/imcircle-streak-480.webp 480w, /img/imcircle-streak-900.webp 900w',
      alt: 'IMCircle builder streak card showing a two-day streak',
    },
    seoTitle: 'IMCircle by Rishu Raj | Community Platform for Builders & Learners',
    seoDescription:
      'IMCircle is a social community platform by Rishu Raj for people who learn, build, connect and grow — with builder streaks and shareable profiles.',
    intro:
      'IMCircle is a social community platform for people who learn, build, connect and grow. It is designed around consistent progress and meaningful connections rather than endless scrolling.',
    capabilities: [
      { title: 'Build in public', text: 'Share what you are learning and building, and follow the progress of people working on similar things.' },
      { title: 'Builder streaks', text: 'Streak cards that celebrate showing up consistently and make progress easy to share.' },
      { title: 'Shareable profiles', text: 'Profile cards with a QR code so people can connect in person or online in seconds.' },
      { title: 'Meaningful connections', text: 'A focus on learners, builders and founders who want to grow together.' },
    ],
    why: 'The most valuable thing in my own journey has been people who were building alongside me. IMCircle is about making those circles easier to find and keep.',
    statusNote: 'In development. Visuals show IMCircle design assets.',
    gallery: [
      {
        src: '/img/imcircle-streak-900.webp',
        srcSet: '/img/imcircle-streak-480.webp 480w, /img/imcircle-streak-900.webp 900w',
        width: 900, height: 900,
        alt: 'IMCircle builder streak card with a flame icon and "2 days streak"',
        caption: 'Builder streak card design.',
      },
    ],
  },
  {
    slug: 'rapidfoxx',
    name: 'RapidFoxx',
    category: 'Logistics · Technology',
    chip: 'Logistics · Platform',
    status: 'In development',
    icon: 'truck',
    logo: '/img/logo-rapidfoxx.webp',
    logoBg: '#FFFFFF',
    summary: 'A technology-enabled logistics initiative focused on simplifying shipping and delivery coordination.',
    card: {
      src: '/img/rapidfoxx-home-640.webp',
      srcSet: '/img/rapidfoxx-home-640.webp 640w, /img/rapidfoxx-home-1200.webp 1200w',
      alt: 'RapidFoxx logistics website homepage',
    },
    seoTitle: 'RapidFoxx by Rishu Raj | Technology-Enabled Logistics Platform',
    seoDescription:
      'RapidFoxx is a technology-enabled logistics initiative by Rishu Raj — a full-stack platform for booking, tracking and coordinating shipments, currently in development.',
    intro:
      'RapidFoxx is a technology-enabled logistics initiative — “for an India that can’t wait.” It is a working full-stack application with customer, rider, fleet, hub and admin views, built to make shipping and delivery coordination simpler.',
    capabilities: [
      { title: 'Book & price shipments', text: 'Pickup and delivery addresses, package dimensions, server-side pricing, service eligibility and scheduling.' },
      { title: 'Labels & tracking', text: 'Generated AWB numbers, QR shipping labels, public tracking and private shipment history.' },
      { title: 'Operations views', text: 'Rider availability, barcode AWB scanning, fleet and hub views, and an operations control tower.' },
      { title: 'Merchant workspace', text: 'A tenant-scoped merchant API with multi-carrier comparison, returns and COD tracking — using mock carriers in development.' },
    ],
    why: 'Coordinating deliveries across couriers, riders and hubs is still surprisingly manual. RapidFoxx explores how one platform can make every shipment easier to book, track and manage.',
    statusNote:
      'A development implementation — not a launched courier service. Live payments and pickups are disabled, and carrier integrations use clearly labelled mock data.',
    gallery: [
      {
        src: '/img/rapidfoxx-home-1200.webp',
        srcSet: '/img/rapidfoxx-home-640.webp 640w, /img/rapidfoxx-home-1200.webp 1200w',
        width: 1200, height: 750,
        alt: 'RapidFoxx public website homepage on desktop',
        caption: 'Public website — development build.',
      },
      {
        src: '/img/rapidfoxx-mobile.webp',
        width: 390, height: 844,
        alt: 'RapidFoxx mobile home screen with shipment booking',
        caption: 'Mobile experience — development build.',
        tall: true,
      },
    ],
  },
];

export const contactReasons = [
  'Collaboration',
  'Business Opportunity',
  'Investment Discussion',
  'Technology Project',
  'General Inquiry',
] as const;
export type ContactReason = (typeof contactReasons)[number];

export const nav = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/about', label: 'About', icon: 'user' },
  { href: '/ventures', label: 'Ventures', icon: 'briefcase' },
  { href: '/ai', label: 'AI', icon: 'sparkles' },
  { href: '/blog', label: 'Blogs', icon: 'file' },
] as const;

/** Bottom navigation order on mobile (matches the mockup). */
export const bottomNav = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/ventures', label: 'Ventures', icon: 'briefcase' },
  { href: '/ai', label: 'AI', icon: 'sparkles' },
  { href: '/blog', label: 'Blogs', icon: 'file' },
  { href: '/about', label: 'About', icon: 'user' },
] as const;

export const aiSuggestions = [
  'What is Rishu building?',
  'His background?',
  'How can we collaborate?',
  'What is EasStay OS?',
  'How can I book a meeting?',
];
