import React from 'react';
import Head from 'next/head';
import { Quote } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { useAuth } from '@/context/AuthContext';

export const authInput =
  'w-full rounded-2xl bg-white px-5 py-4 text-pine-950 ring-1 ring-pine-900/10 outline-none transition placeholder:text-pine-800/40 focus:ring-2 focus:ring-ember-500';

/** "Continue with Google" plus an "or" divider, for the sign-in and sign-up forms. */
export function GoogleSignIn({ next }: { next?: string }) {
  const { signInWithGoogle } = useAuth();
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');

  const go = async () => {
    setError('');
    setBusy(true);
    const res = await signInWithGoogle(next);
    // On success the browser is already leaving for Google.
    if (!res.ok) {
      setError(res.error);
      setBusy(false);
    }
  };

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="flex w-full items-center justify-center gap-3 rounded-full bg-white py-4 font-semibold text-pine-950 ring-1 ring-pine-900/15 transition hover:bg-sand-50 disabled:opacity-60"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24z" />
          <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6H1.3a12 12 0 0 0 0 10.8l4-3.1z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
        </svg>
        {busy ? 'Redirecting…' : 'Continue with Google'}
      </button>
      {error && <p className="mt-2 text-sm font-medium text-rose-600">{error}</p>}
      <div className="mt-6 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-pine-800/40">
        <span className="h-px flex-1 bg-pine-900/10" /> or with email <span className="h-px flex-1 bg-pine-900/10" />
      </div>
    </div>
  );
}

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: React.ReactNode; children: React.ReactNode }) {
  const { data } = useCMS();
  const t = data.testimonials.find((x) => x.published);
  return (
    <>
      <Head>
        <title>{`${title} · ${data.settings.siteName}`}</title>
      </Head>
      <section className="grid min-h-screen pt-[72px] lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-16 sm:px-8">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-3 text-pine-800/65">{subtitle}</p>
            <div className="mt-10">{children}</div>
          </div>
        </div>
        <div className="grain relative hidden overflow-hidden bg-pine-950 lg:block">
          <img src={data.pages.auth.image} alt="" className="absolute inset-0 h-full w-full animate-ken-burns object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/20 to-transparent" />
          {t && (
            <figure className="absolute bottom-12 left-12 right-12 rounded-3xl bg-white/10 p-8 text-white ring-1 ring-white/20 backdrop-blur-xl">
              <Quote className="h-8 w-8 text-ember-400" />
              <blockquote className="mt-4 font-display text-xl leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm text-white/70">{t.name} · {t.trekName}</figcaption>
            </figure>
          )}
        </div>
      </section>
    </>
  );
}
