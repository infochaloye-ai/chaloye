import React, { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, Home, Wallet, Inbox, Map as MapIcon, Plus, TrendingUp } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Badge, Card, PageHeader, Table, Td, Th } from '@/components/admin/ui';
import { bookingTone, inquiryTone } from '@/components/admin/status';
import { formatDate, formatPrice, timeAgo, todayISO } from '@/lib/format';

export default function Dashboard() {
  const { data } = useCMS();
  const { bookings, inquiries, treks } = data;
  const currency = data.settings.currency;

  const stats = useMemo(() => {
    const revenue = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').reduce((n, b) => n + b.amount, 0);
    const pipeline = bookings.filter((b) => b.status === 'pending').reduce((n, b) => n + b.amount, 0);
    return [
      { label: 'Confirmed revenue', value: formatPrice(revenue, currency), sub: `${formatPrice(pipeline, currency)} pending`, icon: Wallet, href: '/admin/bookings' },
      { label: 'Pending bookings', value: bookings.filter((b) => b.status === 'pending').length, sub: `${bookings.length} total`, icon: CalendarCheck, href: '/admin/bookings?status=pending' },
      { label: 'New inquiries', value: inquiries.filter((i) => i.status === 'new').length, sub: `${inquiries.length} total`, icon: Inbox, href: '/admin/inquiries' },
      { label: 'Published treks', value: treks.filter((t) => t.status === 'published').length, sub: `${treks.filter((t) => t.status === 'draft').length} drafts`, icon: MapIcon, href: '/admin/treks' },
    ];
  }, [bookings, inquiries, treks, currency]);

  const byTrek = useMemo(() => {
    const m = new Map<string, number>();
    bookings.filter((b) => b.status !== 'cancelled').forEach((b) => m.set(b.trekName, (m.get(b.trekName) ?? 0) + b.participants));
    const rows = [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
    const max = Math.max(1, ...rows.map((r) => r[1]));
    return rows.map(([name, count]) => ({ name, count, pct: (count / max) * 100 }));
  }, [bookings]);

  const upcoming = useMemo(() => {
    const today = todayISO();
    return treks
      .filter((t) => t.status === 'published')
      .flatMap((t) => t.departures.filter((d) => d >= today).map((d) => ({ trek: t, date: d })))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5)
      .map((x) => ({
        ...x,
        booked: bookings.filter((b) => b.trekId === x.trek.id && b.departureDate === x.date && b.status !== 'cancelled').reduce((n, b) => n + b.participants, 0),
      }));
  }, [treks, bookings]);

  const recentBookings = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const recentInquiries = [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A snapshot of bookings, enquiries and content."
        actions={
          <>
            <Link href="/admin/homepage" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-pine-900 shadow-sm ring-1 ring-pine-900/10 hover:bg-sand-50"><Home className="h-4 w-4" /> Edit homepage</Link>
            <Link href="/admin/treks/new" className="inline-flex items-center gap-2 rounded-lg bg-pine-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-pine-800"><Plus className="h-4 w-4" /> New trek</Link>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-pine-900/5 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-sm text-pine-800/60">{s.label}</span>
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sand-100 text-pine-700 transition-colors group-hover:bg-ember-500 group-hover:text-pine-950"><s.icon className="h-4 w-4" /></span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold tracking-tight text-pine-950">{s.value}</div>
            <div className="mt-1 text-xs text-pine-800/50">{s.sub}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card title="Recent bookings" className="lg:col-span-2" actions={<Link href="/admin/bookings" className="text-sm font-medium text-ember-700 hover:underline">View all</Link>}>
          <div className="-m-6">
            <Table head={<><Th>Customer</Th><Th>Trek</Th><Th>Departure</Th><Th>Amount</Th><Th>Status</Th></>}>
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-sand-50">
                  <Td><div className="font-medium text-pine-950">{b.customerName}</div><div className="text-xs text-pine-800/50">{timeAgo(b.createdAt)}</div></Td>
                  <Td className="text-pine-800/80">{b.trekName}</Td>
                  <Td className="whitespace-nowrap text-pine-800/80">{formatDate(b.departureDate)}</Td>
                  <Td className="font-medium">{formatPrice(b.amount, currency)}</Td>
                  <Td><Badge tone={bookingTone[b.status]}>{b.status}</Badge></Td>
                </tr>
              ))}
            </Table>
          </div>
        </Card>

        <Card title="Top treks" description="Trekkers booked (excl. cancelled)">
          {byTrek.length === 0 ? (
            <p className="text-sm text-pine-800/50">No bookings yet.</p>
          ) : (
            <ul className="space-y-4">
              {byTrek.map((r) => (
                <li key={r.name}>
                  <div className="mb-1.5 flex justify-between text-sm"><span className="truncate pr-2 text-pine-900">{r.name}</span><span className="font-semibold">{r.count}</span></div>
                  <div className="h-2 overflow-hidden rounded-full bg-sand-100"><div className="h-full rounded-full bg-gradient-to-r from-pine-700 to-pine-500" style={{ width: `${r.pct}%` }} /></div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Upcoming departures" className="lg:col-span-2">
          {upcoming.length === 0 ? (
            <p className="text-sm text-pine-800/50">No upcoming departures. Add dates in a trek's settings.</p>
          ) : (
            <ul className="divide-y divide-pine-900/5">
              {upcoming.map((u) => (
                <li key={u.trek.id + u.date} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="w-14 shrink-0 rounded-lg bg-sand-100 py-1.5 text-center">
                    <div className="text-[10px] font-semibold uppercase text-ember-700">{formatDate(u.date, { month: 'short' })}</div>
                    <div className="font-display text-lg font-bold leading-none">{formatDate(u.date, { day: 'numeric' })}</div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/treks/${u.trek.id}`} className="block truncate font-medium text-pine-950 hover:underline">{u.trek.name}</Link>
                    <div className="text-xs text-pine-800/50">{u.trek.region} · {u.trek.durationDays} days</div>
                  </div>
                  <div className="text-right text-sm"><span className="font-semibold">{u.booked}</span> <span className="text-pine-800/50">booked</span></div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Latest inquiries" actions={<Link href="/admin/inquiries" className="text-sm font-medium text-ember-700 hover:underline">View all</Link>}>
          <ul className="space-y-4">
            {recentInquiries.map((i) => (
              <li key={i.id}>
                <Link href={`/admin/inquiries?id=${i.id}`} className="group block">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-pine-950 group-hover:underline">{i.name}</span>
                    <Badge tone={inquiryTone[i.status]}>{i.status}</Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-pine-800/55">{i.subject}: {i.message}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl bg-pine-900 p-5 text-sm text-white/80">
        <TrendingUp className="h-5 w-5 shrink-0 text-ember-400" />
        <span className="flex-1">Tip: every change you make here shows up on the live site instantly, including in other open tabs.</span>
        <Link href="/" target="_blank" className="inline-flex shrink-0 items-center gap-1 font-semibold text-white hover:underline">Open site <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </>
  );
}
