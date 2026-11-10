import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle2, Loader2, Lock, Mail, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { socialList } from '../components/SocialLinks';
import { site } from '../config/site';
import { consumePendingPrefill, onPrefill } from '../lib/contact-bridge';
import type { ContactPrefill } from '../lib/contact-bridge';
import { cn, formEndpoint, hasEmail, hasFormEndpoint, mailto } from '../lib/utils';

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(100, 'Name is too long.'),
  email: z.string().trim().min(1, 'Please enter your email address.').pipe(z.email('Please enter a valid email address.')),
  phone: z
    .string()
    .trim()
    .max(30, 'Phone number is too long.')
    .refine((v) => v === '' || /^\+?[\d\s().-]{6,}$/.test(v), 'Please enter a valid phone number.'),
  company: z.string().trim().max(120, 'Company name is too long.'),
  reason: z.enum(site.contactReasons, { message: 'Please choose a reason for contacting.' }),
  message: z
    .string()
    .trim()
    .min(20, 'Please share a little more detail (at least 20 characters).')
    .max(2000, 'Please keep your message under 2000 characters.'),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional(),
});

type FormIn = z.input<typeof schema>;
type FormOut = z.output<typeof schema>;
type Status = 'idle' | 'submitting' | 'success' | 'error';

const MIN_FILL_MS = 3000;

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const mountedAt = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    setFocus,
    formState: { errors },
  } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', phone: '', company: '', reason: '' as FormIn['reason'], message: '', website: '' },
  });

  // Accept prefills from the Book a Call section.
  useEffect(() => {
    const apply = (p: ContactPrefill | null) => {
      if (!p) return;
      if (p.reason) setValue('reason', p.reason, { shouldValidate: false });
      if (p.message) setValue('message', p.message, { shouldValidate: false });
    };
    apply(consumePendingPrefill());
    return onPrefill(apply);
  }, [setValue]);

  useEffect(() => {
    if (status === 'success') successRef.current?.focus();
  }, [status]);

  const messageLen = (watch('message') ?? '').length;

  const onSubmit = async (data: FormOut) => {
    setErrorMsg('');
    // Spam traps: honeypot filled, or submitted unrealistically fast.
    if (data.website) {
      setStatus('success');
      return;
    }
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setStatus('error');
      setErrorMsg('That was quick! Please wait a moment and try again.');
      return;
    }

    if (!hasFormEndpoint) {
      // No form service configured: hand off to the visitor's email app (never a fake success).
      if (hasEmail) {
        const body = `${data.message}\n\n—\nName: ${data.name}\nEmail: ${data.email}${data.phone ? `\nPhone: ${data.phone}` : ''}${data.company ? `\nCompany: ${data.company}` : ''}`;
        window.location.href = mailto(`[${site.domain}] ${data.reason} — ${data.name}`, body);
        setStatus('idle');
        setErrorMsg('');
      } else {
        setStatus('error');
        setErrorMsg(
          socialList.length
            ? 'The contact form is not connected yet. Please reach out through one of the social links instead.'
            : 'The contact form is not connected yet, so your message was not sent. Please try again soon.',
        );
      }
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
          reason: data.reason,
          message: data.message,
          _subject: `[${site.domain}] ${data.reason} — ${data.name}`,
          _replyto: data.email,
        }),
      });
      if (res.ok) {
        setStatus('success');
        reset();
        return;
      }
      let detail = '';
      try {
        const json = (await res.json()) as { errors?: { message?: string }[]; error?: string };
        detail = json.errors?.map((e) => e.message).filter(Boolean).join(' ') || json.error || '';
      } catch {
        /* ignore */
      }
      throw new Error(detail || `Request failed (${res.status})`);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error && err.message && !/Failed to fetch|NetworkError/i.test(err.message)
          ? `Your message couldn't be sent: ${err.message}`
          : "Your message couldn't be sent. Please check your connection and try again.",
      );
    }
  };

  if (status === 'success') {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="flex min-h-[32rem] flex-col items-center justify-center p-6 text-center outline-none sm:p-10">
        <span className="grid size-16 place-items-center rounded-full border border-orange/40 bg-orange/10 text-orange shadow-[0_0_40px_-6px_rgb(249_115_22/0.6)]">
          <CheckCircle2 size={30} aria-hidden />
        </span>
        <h3 className="mt-6 font-display text-2xl font-semibold">Message sent</h3>
        <p className="mt-2 max-w-sm text-muted">Thanks for reaching out. Your message has been delivered and I&apos;ll get back to you by email.</p>
        <button
          type="button"
          onClick={() => {
            mountedAt.current = Date.now();
            setStatus('idle');
          }}
          className="mt-8 min-h-11 rounded-full border border-white/10 px-5 text-sm transition-colors hover:border-orange/50 hover:text-orange-soft"
        >
          Send another message
        </button>
      </div>
    );
  }

  const submitting = status === 'submitting';
  const fieldErr = (id: keyof FormIn) =>
    errors[id]?.message ? (
      <p id={`contact-${id}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm text-red-400">
        <AlertCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
        {errors[id]?.message}
      </p>
    ) : null;
  const aria = (id: keyof FormIn) => ({
    id: `contact-${id}`,
    'aria-invalid': errors[id] ? ('true' as const) : ('false' as const),
    'aria-describedby': errors[id] ? `contact-${id}-error` : undefined,
  });

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit, (errs) => {
        const first = Object.keys(errs)[0] as keyof FormIn | undefined;
        if (first) setFocus(first);
      })}
      className="p-5 sm:p-8"
      aria-describedby="contact-privacy"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-name" required>
            Full name
          </Label>
          <input {...register('name')} {...aria('name')} type="text" autoComplete="name" className="field" placeholder="Your name" aria-required="true" />
          {fieldErr('name')}
        </div>
        <div>
          <Label htmlFor="contact-email" required>
            Email
          </Label>
          <input
            {...register('email')}
            {...aria('email')}
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            className="field"
            placeholder="you@example.com"
            aria-required="true"
          />
          {fieldErr('email')}
        </div>
        <div>
          <Label htmlFor="contact-phone">Phone</Label>
          <input {...register('phone')} {...aria('phone')} type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="+91 …" />
          {fieldErr('phone')}
        </div>
        <div>
          <Label htmlFor="contact-company">Company / organisation</Label>
          <input {...register('company')} {...aria('company')} type="text" autoComplete="organization" className="field" placeholder="Optional" />
          {fieldErr('company')}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="contact-reason" required>
            Reason for contacting
          </Label>
          <select {...register('reason')} {...aria('reason')} className="field" aria-required="true">
            <option value="" disabled>
              Select a reason…
            </option>
            {site.contactReasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {fieldErr('reason')}
        </div>
        <div className="sm:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor="contact-message" required>
              Message
            </Label>
            <span className={cn('text-xs tabular-nums', messageLen > 2000 ? 'text-red-400' : 'text-muted')} aria-hidden>
              {messageLen}/2000
            </span>
          </div>
          <textarea
            {...register('message')}
            {...aria('message')}
            rows={6}
            className="field min-h-36 resize-y"
            placeholder="Tell me a little about what you have in mind…"
            aria-required="true"
          />
          {fieldErr('message')}
        </div>

        {/* Honeypot: hidden from people and assistive tech */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Leave this field empty</label>
          <input {...register('website')} id="contact-website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      {status === 'error' && errorMsg && (
        <div role="alert" className="mt-5 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3.5 text-sm text-red-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden />
          <span>
            {errorMsg}
            {hasEmail && (
              <>
                {' '}
                You can also{' '}
                <a href={mailto()} className="underline underline-offset-2 hover:text-white">
                  email me directly
                </a>
                .
              </>
            )}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        aria-busy={submitting}
        className="mt-6 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-orange px-6 text-base font-semibold text-[#0a0a0a] shadow-[0_10px_40px_-10px_rgb(249_115_22/0.7)] transition-colors hover:bg-orange-bright disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Sending…
          </>
        ) : hasFormEndpoint || !hasEmail ? (
          <>
            <Send size={18} aria-hidden /> Send message
          </>
        ) : (
          <>
            <Mail size={18} aria-hidden /> Continue in your email app
          </>
        )}
      </button>

      <p id="contact-privacy" className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <Lock size={13} className="mt-0.5 shrink-0 text-orange" aria-hidden />
        <span>
          Your details are used only to reply to your message — never sold or added to marketing lists.
          {hasFormEndpoint
            ? ' Submissions are securely processed by Formspree.'
            : hasEmail
              ? ' This form opens your email app with your message ready to send.'
              : ''}
        </span>
      </p>
    </form>
  );
}

function Label({ htmlFor, required, children }: { htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-fg">
      {children}
      {required ? (
        <span className="ml-0.5 text-orange" aria-hidden>
          *
        </span>
      ) : (
        <span className="ml-1.5 text-xs font-normal text-muted">(optional)</span>
      )}
    </label>
  );
}
