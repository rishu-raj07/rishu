import { AlertCircle, CheckCircle2, Loader2, Lock, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { contactReasons, links } from '../content/site';
import { cx } from './ui';

type Field = 'name' | 'email' | 'company' | 'reason' | 'message';
type Values = Record<Field, string>;
const empty: Values = { name: '', email: '', company: '', reason: '', message: '' };
const order: Field[] = ['name', 'email', 'company', 'reason', 'message'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Lightweight client-side validation (Formspree validates server-side too). */
function validate(f: Field, v: string): string {
  const s = v.trim();
  switch (f) {
    case 'name':
      return s.length < 2 ? 'Please enter your full name.' : s.length > 100 ? 'Name is too long.' : '';
    case 'email':
      return !s ? 'Please enter your email address.' : !EMAIL.test(s) ? 'Please enter a valid email address.' : '';
    case 'company':
      return s.length > 120 ? 'Company name is too long.' : '';
    case 'reason':
      return (contactReasons as readonly string[]).includes(s) ? '' : 'Please choose a reason for contacting.';
    case 'message':
      return s.length < 10 ? 'Please write at least a short message (10+ characters).' : s.length > 3000 ? 'Please keep your message under 3000 characters.' : '';
  }
}

export function ContactForm({ idPrefix = 'contact' }: { idPrefix?: string }) {
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const sending = useRef(false);
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (f: string) => `${idPrefix}-${f}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  useEffect(() => {
    if (status === 'sent') doneRef.current?.focus();
  }, [status]);

  const onChange = (f: Field) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValues((s) => ({ ...s, [f]: v }));
    if (touched[f]) setErrors((s) => ({ ...s, [f]: validate(f, v) }));
  };
  const onBlur = (f: Field) => () => {
    setTouched((s) => ({ ...s, [f]: true }));
    setErrors((s) => ({ ...s, [f]: validate(f, values[f]) }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending.current) return; // prevent duplicate submissions
    const next: Partial<Record<Field, string>> = {};
    for (const f of order) next[f] = validate(f, values[f]);
    setErrors(next);
    setTouched({ name: true, email: true, company: true, reason: true, message: true });
    const firstBad = order.find((f) => next[f]);
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`#${id(firstBad)}`)?.focus();
      return;
    }
    if (honeypot.current?.value) {
      setStatus('sent'); // bots fill the hidden field: drop silently
      return;
    }
    if (Date.now() - startedAt.current < 2500) {
      setStatus('error');
      setServerError('That was very quick — please take a moment and submit again.');
      return;
    }
    sending.current = true;
    setStatus('sending');
    setServerError('');
    const d = Object.fromEntries(order.map((f) => [f, values[f].trim()])) as Values;
    try {
      const res = await fetch(links.formspree, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...d, _subject: `[rishuraj.tech] ${d.reason} — ${d.name}`, _replyto: d.email }),
      });
      if (res.ok) {
        setValues(empty);
        setTouched({});
        setStatus('sent');
        return;
      }
      const j = (await res.json().catch(() => ({}))) as { errors?: { message?: string }[] };
      throw new Error(j.errors?.map((x) => x.message).filter(Boolean).join(' ') || `The form service returned an error (${res.status}).`);
    } catch (err) {
      setStatus('error');
      setServerError(err instanceof Error && !/fetch|network/i.test(err.message) ? err.message : 'Your message could not be sent. Please check your connection and try again.');
    } finally {
      sending.current = false;
    }
  }

  if (status === 'sent') {
    return (
      <div ref={doneRef} tabIndex={-1} role="status" className="flex min-h-[26rem] flex-col items-center justify-center rounded-[1.4rem] border border-line bg-white p-8 text-center shadow-card outline-none">
        <span className="grid size-16 place-items-center rounded-full bg-orange/10 text-orange">
          <CheckCircle2 size={32} aria-hidden />
        </span>
        <h3 className="mt-5 text-2xl font-bold">Message sent</h3>
        <p className="mt-2 max-w-sm text-muted">Thank you for reaching out. Your message has been delivered, and Rishu will reply by email.</p>
        <button
          type="button"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus('idle');
          }}
          className="btn btn-secondary mt-7 !text-base"
        >
          Send another message
        </button>
      </div>
    );
  }

  const err = (f: Field) =>
    errors[f] ? (
      <p id={id(`${f}-error`)} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-red-700">
        <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
        {errors[f]}
      </p>
    ) : null;
  const common = (f: Field, required = true) => ({
    id: id(f),
    name: f,
    value: values[f],
    onChange: onChange(f),
    onBlur: onBlur(f),
    'aria-invalid': errors[f] ? ('true' as const) : ('false' as const),
    'aria-describedby': errors[f] ? id(`${f}-error`) : undefined,
    ...(required ? { 'aria-required': 'true' as const } : {}),
    className: 'field',
  });
  const label = (f: Field, text: string, required = true) => (
    <label htmlFor={id(f)} className="mb-1.5 block text-[0.95rem] font-semibold">
      {text}
      {required ? (
        <span className="ml-0.5 text-orange-ink" aria-hidden>
          *
        </span>
      ) : (
        <span className="ml-1.5 text-sm font-normal text-muted">(optional)</span>
      )}
    </label>
  );
  const isSending = status === 'sending';

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="rounded-[1.4rem] border border-line bg-white p-5 shadow-card sm:p-7" aria-describedby={id('privacy')}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          {label('name', 'Full name')}
          <input {...common('name')} autoComplete="name" placeholder="Your name" />
          {err('name')}
        </div>
        <div>
          {label('email', 'Email')}
          <input {...common('email')} type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false} placeholder="you@example.com" />
          {err('email')}
        </div>
        <div>
          {label('company', 'Company or organization', false)}
          <input {...common('company', false)} autoComplete="organization" placeholder="Where you work" />
          {err('company')}
        </div>
        <div>
          {label('reason', 'Reason for contacting')}
          <select {...common('reason')}>
            <option value="" disabled>
              Choose a reason…
            </option>
            {contactReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {err('reason')}
        </div>
        <div className="sm:col-span-2">
          {label('message', 'Message')}
          <textarea {...common('message')} rows={5} className="field min-h-32 resize-y" placeholder="Tell me about your idea, project or opportunity…" />
          {err('message')}
        </div>
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id('gotcha')}>Leave this field empty</label>
          <input ref={honeypot} id={id('gotcha')} name="_gotcha" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status === 'error' && serverError && (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden />
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSending} aria-busy={isSending} className={cx('btn btn-primary mt-5 w-full sm:w-auto', isSending && 'cursor-wait opacity-80')}>
        {isSending ? <Loader2 size={20} className="animate-spin" aria-hidden /> : <Send size={19} aria-hidden />}
        {isSending ? 'Sending…' : 'Send message'}
      </button>

      <p id={id('privacy')} className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-muted">
        <Lock size={14} className="mt-1 shrink-0 text-orange-ink" aria-hidden />
        Your details are only used to respond to your inquiry. They are processed by Formspree and never sold or added to marketing lists.
      </p>
    </form>
  );
}
