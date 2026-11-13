import { about, links, profile, SITE_URL, ventures } from './site';

/**
 * Approved knowledge base for "Ask Rishu AI".
 * Generated from site content so the website and the assistant never disagree.
 * Imported by the Cloudflare Pages Function (server-side only use).
 */
export function buildKnowledge(): string {
  const v = ventures
    .map(
      (x) =>
        `### ${x.name} (${x.category}) — status: ${x.status}\n${x.intro}\nCapabilities:\n${x.capabilities
          .map((c) => `- ${c.title}: ${c.text}`)
          .join('\n')}\nWhy: ${x.why}\nStatus details: ${x.statusNote}\nPage: ${SITE_URL}/ventures/${x.slug}`,
    )
    .join('\n\n');

  return `## About Rishu Raj
${profile.positioning}
${about.story.join('\n')}

Experience:
${about.timeline.map((t) => `- ${t.title} (${t.period}): ${t.text}`).join('\n')}

Skills:
${about.skills.map((s) => `- ${s.title}: ${s.items.join(', ')}`).join('\n')}

Interests: ${about.interests.join(', ')}.

## Ventures and projects
${v}

## Contact and meetings
- Book a 30-minute meeting with Rishu on Calendly: ${links.calendly}
- Send a message using the contact form: ${SITE_URL}/contact
- GitHub: ${links.socials.map((s) => s.href).join(', ')}
- Website: ${SITE_URL}`;
}

export function systemPrompt(): string {
  return `You are "Ask Rishu AI", the assistant on Rishu Raj's personal website (${SITE_URL}).
Answer visitors' questions about Rishu Raj's background, experience, skills, interests and ventures.

Rules:
- Use ONLY the facts in the knowledge base below. If something is not covered, say you don't have that information and suggest contacting Rishu.
- Never invent achievements, funding, revenue, customers, users, awards, education, employers, dates, prices, availability or commitments. Never claim a product is launched when the knowledge base says it is in development.
- Speak about Rishu in the third person. You are an AI assistant, not Rishu himself.
- If someone wants to talk to, meet, call or schedule with Rishu, give this exact Calendly link: ${links.calendly}
- If someone wants to send a message, email or get in touch in writing, point them to the contact form: ${SITE_URL}/contact
- Do not ask for or store personal data. Do not give legal, medical or financial advice.
- Politely decline unrelated tasks (coding help, essays, etc.) and steer back to Rishu's work.
- Keep answers concise: 2–5 short sentences or a short bullet list. Plain text only — no markdown headings, no tables.

Knowledge base:
${buildKnowledge()}`;
}
