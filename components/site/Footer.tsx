import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import Logo from './Logo';
import { useCMS, usePublishedTreks, useSettings } from '@/context/CMSContext';

export default function Footer() {
  const s = useSettings();
  const treks = usePublishedTreks();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const { create } = useCMS();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSending(true);
    try {
      await create('subscribers', { email: email.trim().toLowerCase() });
      setSubscribed(true);
    } catch (err) {
      // Already subscribed counts as success.
      if (err instanceof Error && err.message.includes('duplicate key')) setSubscribed(true);
      else setError('Could not subscribe right now. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const socials = [
    { href: s.socials.instagram, icon: Instagram, label: 'Instagram' },
    { href: s.socials.youtube, icon: Youtube, label: 'YouTube' },
    { href: s.socials.facebook, icon: Facebook, label: 'Facebook' },
    { href: s.socials.twitter, icon: Twitter, label: 'X / Twitter' },
  ].filter((x) => x.href);

  return (
    <footer className="topo relative overflow-hidden bg-pine-950 text-white/70">
      <div className="container-x relative pt-20">
        {/* Newsletter */}
        <div className="flex flex-col gap-8 border-b border-white/10 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">{s.newsletter.title}</h2>
            <p className="mt-3 text-white/60">{s.newsletter.subtitle}</p>
          </div>
          {subscribed ? (
            <p className="rounded-full bg-white/10 px-6 py-4 text-sm font-medium text-white">You're on the list. See you on the trail.</p>
          ) : (
            <form
              onSubmit={subscribe}
              className="flex w-full max-w-md items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/10 focus-within:ring-ember-400"
            >
              <label htmlFor="newsletter" className="sr-only">Email address</label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button disabled={sending} className="inline-flex items-center gap-1.5 rounded-full bg-ember-500 px-5 py-3 text-sm font-semibold text-pine-950 transition-colors hover:bg-ember-400 disabled:opacity-60">
                {sending ? 'Subscribing…' : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>
          )}
          {error && <p className="text-sm font-medium text-rose-300">{error}</p>}
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" showTagline />
            <p className="mt-6 max-w-sm text-sm leading-relaxed">{s.description}</p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 transition-all hover:bg-ember-500 hover:text-pine-950 hover:ring-ember-500">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li><Link href="/trips" className="hover:text-white">All treks</Link></li>
              <li><Link href="/about" className="hover:text-white">About us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/account" className="hover:text-white">My bookings</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">Popular treks</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {treks.slice(0, 5).map((t) => (
                <li key={t.id}><Link href={`/trips/${t.slug}`} className="hover:text-white">{t.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-sm font-semibold text-white">Base camp</h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li><a href={`mailto:${s.email}`} className="flex gap-3 hover:text-white"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />{s.email}</a></li>
              <li><a href={`tel:${s.phone.replace(/\s/g, '')}`} className="flex gap-3 hover:text-white"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />{s.phone}</a></li>
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />{s.address}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <div className="container-x">
          <div className="font-display text-[22vw] font-extrabold leading-[0.8] tracking-tighter text-white/[0.04] lg:text-[17rem]">chaloye</div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.siteName}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/contact" className="hover:text-white">Privacy</Link>
            <Link href="/contact" className="hover:text-white">Terms</Link>
            <Link href="/contact" className="hover:text-white">Cancellation policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
