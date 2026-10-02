import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { CalendarCheck, Download, Mail, Phone, Plus, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Btn, Card, EmptyState, Field, Input, Modal, PageHeader, SearchInput, Select, StatusSelect, Table, Td, Textarea, Th, useConfirm } from '@/components/admin/ui';
import { BOOKING_STATUSES, bookingTone } from '@/components/admin/status';
import { useToast } from '@/components/admin/Toast';
import { downloadCSV } from '@/lib/csv';
import { cn, formatDate, formatPrice, timeAgo, todayISO } from '@/lib/format';
import type { Booking, BookingStatus, NewItem } from '@/lib/cms/types';

type Draft = NewItem<'bookings'>;

function BookingEditor({ booking, onClose }: { booking: Booking | 'new'; onClose: () => void }) {
  const { data, create, update, remove } = useCMS();
  const toast = useToast();
  const confirm = useConfirm();
  const isNew = booking === 'new';
  const firstTrek = data.treks[0];

  const [d, setD] = useState<Draft>(() =>
    isNew
      ? {
          trekId: firstTrek?.id ?? '',
          trekName: firstTrek?.name ?? '',
          customerName: '',
          email: '',
          phone: '',
          departureDate: firstTrek?.departures.find((x) => x >= todayISO()) ?? todayISO(),
          participants: 1,
          amount: firstTrek?.price ?? 0,
          status: 'confirmed',
          notes: '',
        }
      : (({ id, createdAt, updatedAt, ...rest }) => rest)(booking)
  );
  const [saving, setSaving] = useState(false);
  const trek = data.treks.find((t) => t.id === d.trekId);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isNew) await create('bookings', d);
      else await update('bookings', booking.id, d);
      toast(isNew ? 'Booking added' : 'Booking updated');
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (isNew) return;
    if (!(await confirm({ title: 'Delete booking?', message: `This permanently removes ${booking.customerName}'s booking.`, confirmLabel: 'Delete', danger: true }))) return;
    await remove('bookings', booking.id);
    toast('Booking deleted');
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={isNew ? 'Add booking' : `Booking #${booking.id.slice(0, 8).toUpperCase()}`}
      footer={
        <>
          {!isNew && <Btn type="button" variant="ghost" className="mr-auto text-rose-600" onClick={del}><Trash2 className="h-4 w-4" /> Delete</Btn>}
          <Btn type="button" variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn type="submit" form="booking-form" disabled={saving}>{isNew ? 'Add booking' : 'Save'}</Btn>
        </>
      }
    >
      <form id="booking-form" onSubmit={save} className="space-y-5">
        {!isNew && (
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${d.email}`} className="inline-flex items-center gap-1.5 rounded-lg bg-sand-100 px-3 py-1.5 text-xs font-medium hover:bg-sand-200"><Mail className="h-3.5 w-3.5" /> Email</a>
            <a href={`tel:${d.phone}`} className="inline-flex items-center gap-1.5 rounded-lg bg-sand-100 px-3 py-1.5 text-xs font-medium hover:bg-sand-200"><Phone className="h-3.5 w-3.5" /> Call</a>
            <a href={`https://wa.me/${d.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366]/10 px-3 py-1.5 text-xs font-medium text-[#128C7E] hover:bg-[#25D366]/20">WhatsApp</a>
            <span className="ml-auto self-center text-xs text-pine-800/50">Received {timeAgo(booking.createdAt)}</span>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status">
            <Select value={d.status} onChange={(e) => setD({ ...d, status: e.target.value as BookingStatus })}>
              {BOOKING_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </Select>
          </Field>
          <Field label="Trek">
            <Select
              value={d.trekId}
              onChange={(e) => {
                const t = data.treks.find((x) => x.id === e.target.value);
                setD({ ...d, trekId: e.target.value, trekName: t?.name ?? d.trekName, amount: (t?.price ?? 0) * d.participants });
              }}
            >
              {!trek && <option value={d.trekId}>{d.trekName} (deleted)</option>}
              {data.treks.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
          </Field>
          <Field label="Customer name" required><Input required value={d.customerName} onChange={(e) => setD({ ...d, customerName: e.target.value })} /></Field>
          <Field label="Email" required><Input required type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></Field>
          <Field label="Phone" required><Input required value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} /></Field>
          <Field label="Departure date" required><Input required type="date" value={d.departureDate} onChange={(e) => setD({ ...d, departureDate: e.target.value })} /></Field>
          <Field label="Trekkers">
            <Input type="number" min={1} value={d.participants} onChange={(e) => { const n = Math.max(1, Number(e.target.value)); setD({ ...d, participants: n, amount: trek ? trek.price * n : d.amount }); }} />
          </Field>
          <Field label={`Amount (${data.settings.currency})`} hint="Auto-calculated, but you can override it.">
            <Input type="number" min={0} value={d.amount} onChange={(e) => setD({ ...d, amount: Number(e.target.value) })} />
          </Field>
          <Field label="Internal notes" className="sm:col-span-2"><Textarea rows={3} value={d.notes ?? ''} onChange={(e) => setD({ ...d, notes: e.target.value })} /></Field>
        </div>
      </form>
    </Modal>
  );
}

export default function BookingsAdmin() {
  const { data, update } = useCMS();
  const router = useRouter();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [tab, setTab] = useState<BookingStatus | ''>('');
  const [editing, setEditing] = useState<Booking | 'new' | null>(null);
  const currency = data.settings.currency;

  useEffect(() => {
    if (router.isReady && typeof router.query.status === 'string') setTab(router.query.status as BookingStatus);
  }, [router.isReady, router.query.status]);

  const sorted = useMemo(() => [...data.bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [data.bookings]);
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return sorted.filter((b) => (!tab || b.status === tab) && (!s || `${b.customerName} ${b.email} ${b.trekName} ${b.phone} ${b.id}`.toLowerCase().includes(s)));
  }, [sorted, tab, q]);

  const exportCsv = () =>
    downloadCSV(
      `bookings-${todayISO()}.csv`,
      rows.map((b) => ({ id: b.id, created: b.createdAt, status: b.status, trek: b.trekName, departure: b.departureDate, trekkers: b.participants, amount: b.amount, name: b.customerName, email: b.email, phone: b.phone, notes: b.notes ?? '' }))
    );

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Requests from the website and bookings you add manually."
        actions={
          <>
            <Btn variant="secondary" onClick={exportCsv} disabled={!rows.length}><Download className="h-4 w-4" /> Export CSV</Btn>
            <Btn onClick={() => setEditing('new')}><Plus className="h-4 w-4" /> Add booking</Btn>
          </>
        }
      />

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-pine-900/5 no-scrollbar">
        {(['', ...BOOKING_STATUSES] as const).map((s) => {
          const count = s ? data.bookings.filter((b) => b.status === s).length : data.bookings.length;
          return (
            <button key={s || 'all'} onClick={() => setTab(s)} className={cn('flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition-colors', tab === s ? 'bg-pine-900 text-white' : 'text-pine-800/70 hover:bg-sand-50')}>
              {s || 'All'} <span className={cn('rounded-md px-1.5 text-xs', tab === s ? 'bg-white/15' : 'bg-sand-100')}>{count}</span>
            </button>
          );
        })}
      </div>

      <Card className="overflow-hidden">
        <div className="-m-6">
          <div className="border-b border-pine-900/5 p-4">
            <SearchInput value={q} onChange={setQ} placeholder="Search by name, email, phone, trek or booking ID…" />
          </div>
          {rows.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No bookings found" description={q || tab ? 'Try changing the filters.' : 'Bookings from the website will appear here.'} />
          ) : (
            <Table head={<><Th>Customer</Th><Th>Trek</Th><Th>Departure</Th><Th>Trekkers</Th><Th>Amount</Th><Th>Status</Th></>}>
              {rows.map((b) => (
                <tr key={b.id} onClick={() => setEditing(b)} className="cursor-pointer hover:bg-sand-50">
                  <Td>
                    <div className="font-medium text-pine-950">{b.customerName}</div>
                    <div className="text-xs text-pine-800/50">{b.email}</div>
                  </Td>
                  <Td className="text-pine-800/80">{b.trekName}</Td>
                  <Td className="whitespace-nowrap">{formatDate(b.departureDate)}</Td>
                  <Td>{b.participants}</Td>
                  <Td className="whitespace-nowrap font-medium">{formatPrice(b.amount, currency)}</Td>
                  <Td>
                    <StatusSelect
                      value={b.status}
                      options={BOOKING_STATUSES}
                      tone={bookingTone}
                      onChange={async (v) => {
                        await update('bookings', b.id, { status: v });
                        toast(`Marked as ${v}`);
                      }}
                    />
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </Card>

      {editing && <BookingEditor booking={editing} onClose={() => setEditing(null)} />}
    </>
  );
}
