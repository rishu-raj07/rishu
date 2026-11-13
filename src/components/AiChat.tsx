import { RotateCcw, Send, Sparkles } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { aiSuggestions, links } from '../content/site';
import { Link } from '../lib/router';
import { Avatar, cx } from './ui';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

const MAX_LEN = 600;

/** Turn URLs in assistant replies into links (internal ones use the router). */
function linkify(text: string): ReactNode[] {
  const parts = text.split(/(https?:\/\/[^\s)]+[^\s).,!?])/g);
  return parts.map((p, i) => {
    if (!/^https?:\/\//.test(p)) return <Fragment key={i}>{p}</Fragment>;
    const internal = p.startsWith('https://rishuraj.tech');
    const cls = 'break-all font-semibold text-[#ff8a4c] underline underline-offset-2 hover:text-white';
    return internal ? (
      <Link key={i} to={p.replace('https://rishuraj.tech', '') || '/'} className={cls}>
        {p}
      </Link>
    ) : (
      <a key={i} href={p} target="_blank" rel="noopener noreferrer" className={cls}>
        {p}
      </a>
    );
  });
}

export function AiChat({ variant = 'panel', className }: { variant?: 'panel' | 'page'; className?: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const page = variant === 'page';

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const q = text.trim().slice(0, MAX_LEN);
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setInput('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.slice(-8) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) throw new Error(data.error || `Request failed (${res.status})`);
      setMessages((m) => [...m, { role: 'assistant', content: data.reply! }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setMessages(next.slice(0, -1));
      setInput(q);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  return (
    <section
      aria-label="Ask Rishu AI"
      className={cx('relative flex flex-col overflow-hidden rounded-[1.4rem] bg-panel text-white shadow-[0_24px_60px_-24px_rgb(17_19_24/0.6)]', className)}
    >
      <div aria-hidden className="ai-dots pointer-events-none absolute right-0 top-0 h-40 w-56" />
      <div className="relative flex items-start justify-between gap-3 p-5 pb-3 sm:p-6 sm:pb-3">
        <div className="flex items-center gap-3">
          {page ? <Avatar size={48} alt="" /> : <Sparkles size={26} className="shrink-0 text-orange" aria-hidden />}
          <div>
            <h2 className="text-[1.35rem] font-bold tracking-[-0.02em]">{page ? 'Ask Rishu AI' : 'AI Assistant'}</h2>
            <p className="text-[0.95rem] text-[#c4c7cc]">Ask me about my work, ventures, or ideas.</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setMessages([]);
              setError('');
              inputRef.current?.focus();
            }}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm text-[#c4c7cc] transition-colors hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={15} aria-hidden /> Reset
          </button>
        )}
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-busy={loading}
        className={cx('relative space-y-3 overflow-y-auto px-5 sm:px-6', page ? (messages.length || loading ? 'min-h-[14rem] max-h-[55vh] flex-1' : 'lg:min-h-[12rem] flex-1') : messages.length || loading ? 'max-h-72' : '')}
      >
        {messages.map((m, i) => (
          <div key={i} className={cx('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <p
              className={cx(
                'max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[0.95rem] leading-relaxed',
                m.role === 'user' ? 'rounded-br-md bg-orange text-white' : 'rounded-bl-md bg-white/[0.08] text-[#ececee]',
              )}
            >
              <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Ask Rishu AI: '}</span>
              {m.role === 'assistant' ? linkify(m.content) : m.content}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <p className="typing inline-flex items-center gap-1 rounded-2xl rounded-bl-md bg-white/[0.08] px-4 py-3" aria-label="Ask Rishu AI is typing">
              <span className="size-1.5 rounded-full bg-orange" />
              <span className="size-1.5 rounded-full bg-orange" />
              <span className="size-1.5 rounded-full bg-orange" />
            </p>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <ul className="relative flex flex-wrap gap-2 px-5 pt-1 sm:px-6" aria-label="Suggested questions">
          {aiSuggestions.slice(0, page ? 5 : 3).map((s) => (
            <li key={s}>
              <button
                type="button"
                onClick={() => void send(s)}
                className="min-h-11 rounded-full border border-white/10 bg-white/[0.06] px-4 text-[0.92rem] font-medium text-white transition-colors hover:border-orange/60 hover:bg-orange/15"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="relative mx-5 mt-3 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 sm:mx-6">
          {error} You can also{' '}
          <a href={links.calendly} target="_blank" rel="noopener noreferrer" className="underline">
            book a call
          </a>{' '}
          or{' '}
          <Link to="/contact" className="underline">
            send a message
          </Link>
          .
        </p>
      )}

      <form onSubmit={onSubmit} className="relative p-5 pt-4 sm:p-6 sm:pt-4">
        <label htmlFor={`ai-input-${variant}`} className="sr-only">
          Ask a question about Rishu Raj
        </label>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] p-1.5 pl-5 focus-within:border-orange/60">
          <input
            ref={inputRef}
            id={`ai-input-${variant}`}
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
            placeholder="Ask anything..."
            autoComplete="off"
            enterKeyHint="send"
            className="h-11 min-w-0 flex-1 bg-transparent text-[16px] text-white placeholder:text-[#9a9ea5] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send question"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-white shadow-[0_8px_20px_-8px_rgb(255_90_10/0.9)] transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={18} aria-hidden />
          </button>
        </div>
        <p className="mt-2.5 px-1 text-xs text-[#9a9ea5]">AI answers can be imperfect — they are based only on information Rishu has shared here.</p>
      </form>
    </section>
  );
}
