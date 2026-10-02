import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar, LogOut, Mountain, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCMS } from '@/context/CMSContext';
import { supabase } from '@/lib/supabase';
import { ButtonLink } from '@/components/site/ui';
import { authInput } from '@/components/site/AuthShell';
import { cn, formatDate, formatPrice, initials, todayISO } from '@/lib/format';
import type { BookingStatus } from '@/lib/cms/types';

const STATUS: Record<BookingStatus, string> = {
  pending: 'bg-amber-50 text-amber-800 ring-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  completed: 'bg-sky-50 text-sky-800 ring-sky-200',
  cancelled: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function AccountPage() {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const { data, refresh } = useCMS();
  const router = useRouter();
  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  useEffect(() => {
    if (!isLoading && !user) router.replace('/login?next=/account');
  }, [isLoading, user, router]);

  useEffect(() => {
    if (user) setProfile({ firstName: user.firstName, lastName: user.lastName, phone: user.phone ?? '' });
  }, [user]);

  const cancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    const { error } = await supabase.rpc('cancel_booking', { booking_id: id });
    if (error) alert(error.message);
    await refresh();
  };

  const bookings = useMemo(
    () => (user ? data.bookings.filter((b) => b.email.toLowerCase() === user.email.toLowerCase()) : []),
    [data.bookings, user]
  );

  if (!user) return <div className="min-h-screen" />;

  const currency = data.settings.currency;
  const trekById = (id: string) => data.treks.find((t) => t.id === id);

  return (
    <>
      <Head>
        <title>{`My account · ${data.settings.siteName}`}</title>
      </Head>
      <section className="container-x pb-24 pt-32">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="flex items-center gap-5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-ember-500 font-display text-xl font-bold text-pine-950">
              {initials(`${user.firstName} ${user.lastName}`)}
            </span>
            <div>
              <h1 className="text-4xl font-bold">Namaste, {user.firstName}</h1>
              <p className="text-pine-800/60">{user.email}</p>
            </div>
          </div>
          <button onClick={async () => { await logout(); router.push('/'); }} className="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-pine-800/70 ring-1 ring-pine-900/10 hover:bg-white sm:self-auto">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-2xl font-bold">My bookings</h2>
            {bookings.length === 0 ? (
              <div className="mt-6 rounded-[2rem] bg-white p-12 text-center ring-1 ring-pine-900/[0.04] shadow-soft">
                <Mountain className="mx-auto h-12 w-12 text-pine-300" />
                <p className="mt-4 text-pine-800/65">No bookings yet. Your next adventure is waiting.</p>
                <ButtonLink href="/trips" className="mt-6">Explore treks</ButtonLink>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {bookings.map((b) => {
                  const trek = trekById(b.trekId);
                  const canCancel = (b.status === 'pending' || b.status === 'confirmed') && b.departureDate > todayISO();
                  return (
                    <div key={b.id} className="flex flex-col gap-5 rounded-3xl bg-white p-4 ring-1 ring-pine-900/[0.04] shadow-soft sm:flex-row sm:items-center">
                      {trek && <img src={trek.image} alt="" className="h-28 w-full rounded-2xl object-cover sm:w-36" />}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset', STATUS[b.status])}>{b.status}</span>
                          <span className="text-xs text-pine-800/50">#{b.id.slice(0, 8).toUpperCase()}</span>
                        </div>
                        {trek ? (
                          <Link href={`/trips/${trek.slug}`} className="mt-2 block font-display text-xl font-semibold hover:text-ember-600">{b.trekName}</Link>
                        ) : (
                          <div className="mt-2 font-display text-xl font-semibold">{b.trekName}</div>
                        )}
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-pine-800/65">
                          <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(b.departureDate)}</span>
                          <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{b.participants}</span>
                          <span className="font-semibold text-pine-950">{formatPrice(b.amount, currency)}</span>
                        </div>
                      </div>
                      {canCancel && (
                        <button
                          onClick={() => cancel(b.id)}
                          className="self-start rounded-full px-4 py-2 text-sm font-semibold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 sm:self-center"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <h2 className="text-2xl font-bold">Profile</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const res = await updateProfile(profile);
                setProfileError(res.ok ? '' : res.error);
                if (!res.ok) return;
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="mt-6 space-y-3 rounded-3xl bg-sand-100 p-6"
            >
              <input className={authInput} placeholder="First name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
              <input className={authInput} placeholder="Last name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
              <input className={authInput} placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
              {profileError && <p className="text-sm font-medium text-rose-600">{profileError}</p>}
              <button className="w-full rounded-full bg-pine-900 py-3.5 font-semibold text-white hover:bg-pine-800">{saved ? 'Saved ✓' : 'Save changes'}</button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
