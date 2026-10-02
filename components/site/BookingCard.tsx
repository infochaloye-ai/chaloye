import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Minus, Plus, ShieldCheck, Users } from 'lucide-react';
import type { Trek } from '@/lib/cms/types';
import { useCMS } from '@/context/CMSContext';
import { useAuth } from '@/context/AuthContext';
import { cn, formatDate, formatPrice, todayISO } from '@/lib/format';

const input =
  'w-full rounded-xl bg-sand-50 px-4 py-3 text-sm text-pine-950 ring-1 ring-pine-900/10 outline-none transition focus:bg-white focus:ring-2 focus:ring-ember-500 placeholder:text-pine-800/40';

export default function BookingCard({ trek, id }: { trek: Trek; id?: string }) {
  const { data, create } = useCMS();
  const { user } = useAuth();
  const currency = data.settings.currency;

  const departures = useMemo(() => [...trek.departures].filter((d) => d >= todayISO()).sort(), [trek.departures]);
  const [date, setDate] = useState(departures[0] ?? '');
  const [people, setPeople] = useState(1);
  const [step, setStep] = useState<'select' | 'details' | 'done'>('select');
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => setDate(departures[0] ?? ''), [departures]);
  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: f.name || `${user.firstName} ${user.lastName}`.trim(), email: f.email || user.email, phone: f.phone || user.phone || '' }));
  }, [user]);

  const total = trek.price * people;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError('Please enter a valid email.');
    if (form.phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid phone number.');
    setSubmitting(true);
    try {
      const b = await create('bookings', {
        trekId: trek.id,
        trekName: trek.name,
        customerName: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        departureDate: date,
        participants: people,
        amount: total,
        status: 'pending',
        notes: form.notes.trim() || undefined,
      });
      setBookingId(b.id.slice(0, 8).toUpperCase());
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id={id} className="scroll-mt-28 overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(14,28,21,0.35)] ring-1 ring-pine-900/[0.04] shadow-soft">
      <div className="bg-pine-900 px-7 py-6 text-white">
        <div className="text-xs font-medium uppercase tracking-wider text-white/60">Price per person</div>
        <div className="mt-1 flex items-baseline gap-3">
          <span className="font-display text-4xl font-bold">{formatPrice(trek.price, currency)}</span>
          {trek.originalPrice && trek.originalPrice > trek.price && (
            <span className="text-white/50 line-through">{formatPrice(trek.originalPrice, currency)}</span>
          )}
        </div>
        <div className="mt-1 text-xs text-white/60">Inclusive of all taxes · {trek.durationDays} days</div>
      </div>

      {step === 'done' ? (
        <div className="p-7 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-pine-600" />
          <h3 className="mt-4 text-2xl font-bold">Request received!</h3>
          <p className="mt-2 text-sm leading-relaxed text-pine-800/70">
            Booking <strong className="text-pine-950">#{bookingId}</strong> for {people} trekker{people > 1 ? 's' : ''} on {formatDate(date)} is pending.
            Our team will call you within 24 hours to confirm and share payment details.
          </p>
          <Link href="/account" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:underline">
            View my bookings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="p-7">
          {step === 'select' ? (
            <>
              <label className="block text-xs font-semibold uppercase tracking-wider text-pine-800/60">Departure date</label>
              {departures.length === 0 ? (
                <p className="mt-2 rounded-xl bg-sand-100 p-4 text-sm text-pine-800/70">
                  No upcoming departures are scheduled. <Link href="/contact" className="font-semibold text-ember-600 underline">Ask us</Link> about custom dates.
                </p>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {departures.slice(0, 6).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDate(d)}
                      className={cn(
                        'flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium transition-all',
                        date === d ? 'bg-pine-900 text-white' : 'bg-sand-50 text-pine-900 ring-1 ring-pine-900/10 hover:ring-pine-900/30'
                      )}
                    >
                      <Calendar className={cn('h-4 w-4 shrink-0', date === d ? 'text-ember-400' : 'text-pine-800/40')} />
                      {formatDate(d, { day: 'numeric', month: 'short', year: '2-digit' })}
                    </button>
                  ))}
                </div>
              )}

              <label className="mt-6 block text-xs font-semibold uppercase tracking-wider text-pine-800/60">Trekkers</label>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-sand-50 p-2 ring-1 ring-pine-900/10">
                <button onClick={() => setPeople((p) => Math.max(1, p - 1))} aria-label="Fewer trekkers" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm disabled:opacity-40" disabled={people <= 1}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex items-center gap-2 font-semibold"><Users className="h-4 w-4 text-pine-800/50" />{people}</span>
                <button onClick={() => setPeople((p) => Math.min(20, p + 1))} aria-label="More trekkers" className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-dashed border-pine-900/15 pt-5">
                <span className="text-sm text-pine-800/70">{formatPrice(trek.price, currency)} × {people}</span>
                <span className="font-display text-2xl font-bold">{formatPrice(total, currency)}</span>
              </div>

              <button
                disabled={!date}
                onClick={() => setStep('details')}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 py-4 font-semibold text-pine-950 transition-all hover:bg-ember-400 disabled:opacity-50"
              >
                Reserve my spot <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <form onSubmit={submit} className="space-y-3">
              <div className="mb-4 flex items-center justify-between rounded-xl bg-sand-100 px-4 py-3 text-sm">
                <span className="font-medium">{formatDate(date)} · {people} trekker{people > 1 ? 's' : ''}</span>
                <button type="button" onClick={() => setStep('select')} className="font-semibold text-ember-600 hover:underline">Change</button>
              </div>
              <input required className={input} placeholder="Full name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="email" className={input} placeholder="Email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <input required type="tel" className={input} placeholder="Phone / WhatsApp" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <textarea rows={2} className={input} placeholder="Anything we should know? (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
              <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 py-4 font-semibold text-pine-950 transition-all hover:bg-ember-400 disabled:opacity-60">
                {submitting ? 'Sending…' : <>Request booking · {formatPrice(total, currency)}</>}
              </button>
            </form>
          )}

          <div className="mt-5 flex items-start gap-2.5 text-xs leading-relaxed text-pine-800/60">
            <ShieldCheck className="h-4 w-4 shrink-0 text-pine-600" />
            No payment now. Free cancellation up to 30 days before departure.
          </div>
        </div>
      )}
    </div>
  );
}
