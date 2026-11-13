/**
 * POST /api/chat — "Ask Rishu AI"
 * Cloudflare Pages Function using the Workers AI binding (env.AI).
 * No API keys exist in the client; the model runs server-side on Cloudflare.
 */
import { systemPrompt } from '../../src/content/knowledge';

interface AiBinding {
  run(model: string, input: Record<string, unknown>): Promise<{ response?: string } | unknown>;
}
interface Env {
  AI?: AiBinding;
}
interface Ctx {
  request: Request;
  env: Env;
}

const MODELS = ['@cf/meta/llama-3.3-70b-instruct-fp8-fast', '@cf/meta/llama-3.1-8b-instruct'];
const ALLOWED_ORIGIN = /^https:\/\/((www\.)?rishuraj\.tech|([a-z0-9-]+\.)?rishuraj\.pages\.dev)$|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
const MAX_BODY = 12_000;
const MAX_MSG = 600;
const MAX_TURNS = 8;

// Best-effort per-isolate rate limit (Cloudflare also applies platform protections).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60 * 60_000);
  const lastMinute = recent.filter((t) => now - t < 60_000).length;
  if (lastMinute >= 8 || recent.length >= 60) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra },
  });

export const onRequestPost = async ({ request, env }: Ctx): Promise<Response> => {
  const origin = request.headers.get('Origin');
  if (origin && !ALLOWED_ORIGIN.test(origin)) return json({ error: 'Origin not allowed.' }, 403);
  if (!(request.headers.get('Content-Type') || '').includes('application/json')) return json({ error: 'Expected JSON.' }, 415);

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (limited(ip)) return json({ error: 'You are sending messages too quickly. Please wait a minute and try again.' }, 429, { 'Retry-After': '60' });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return json({ error: 'Message is too long.' }, 413);

  let body: { messages?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }
  const list = Array.isArray(body.messages) ? body.messages.slice(-MAX_TURNS) : [];
  const messages: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of list) {
    if (!m || typeof m !== 'object') return json({ error: 'Invalid message.' }, 400);
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return json({ error: 'Invalid message.' }, 400);
    const text = content.trim().slice(0, role === 'user' ? MAX_MSG : 2000);
    if (!text) return json({ error: 'Empty message.' }, 400);
    messages.push({ role, content: text });
  }
  if (!messages.length || messages[messages.length - 1].role !== 'user') return json({ error: 'Please ask a question.' }, 400);

  if (!env.AI) return json({ error: 'The AI assistant is not configured on this deployment yet.' }, 503);

  const input = {
    messages: [{ role: 'system', content: systemPrompt() }, ...messages],
    max_tokens: 380,
    temperature: 0.3,
  };

  for (const model of MODELS) {
    try {
      const out = (await env.AI.run(model, input)) as { response?: string };
      const reply = typeof out?.response === 'string' ? out.response.trim() : '';
      if (reply) return json({ reply });
    } catch {
      // try the next model
    }
  }
  return json({ error: 'The AI assistant is temporarily unavailable.' }, 502);
};

export const onRequest = async ({ request }: Ctx): Promise<Response> =>
  request.method === 'POST' ? json({ error: 'Unhandled.' }, 500) : json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
