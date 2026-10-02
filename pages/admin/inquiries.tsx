import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Inbox, Mail, Phone, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Badge, Btn, Card, EmptyState, PageHeader, SearchInput, StatusSelect, useConfirm } from '@/components/admin/ui';
import { INQUIRY_STATUSES, inquiryTone } from '@/components/admin/status';
import { useToast } from '@/components/admin/Toast';
import { cn, formatDate, initials, timeAgo } from '@/lib/format';
import type { InquiryStatus } from '@/lib/cms/types';

export default function InquiriesAdmin() {
  const { data, update, remove } = useCMS();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<InquiryStatus | ''>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (router.isReady && typeof router.query.id === 'string') setSelectedId(router.query.id);
  }, [router.isReady, router.query.id]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return [...data.inquiries]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .filter((i) => (!filter || i.status === filter) && (!s || `${i.name} ${i.email} ${i.subject} ${i.message}`.toLowerCase().includes(s)));
  }, [data.inquiries, q, filter]);

  const selected = data.inquiries.find((i) => i.id === selectedId) ?? null;

  const setStatus = async (id: string, status: InquiryStatus) => {
    await update('inquiries', id, { status });
    toast(`Marked as ${status}`);
  };

  const del = async (id: string) => {
    if (!(await confirm({ title: 'Delete inquiry?', message: 'This message will be permanently deleted.', confirmLabel: 'Delete', danger: true }))) return;
    await remove('inquiries', id);
    setSelectedId(null);
    toast('Inquiry deleted');
  };

  return (
    <>
      <PageHeader title="Inquiries" description="Messages sent through the contact form." />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className={cn('overflow-hidden lg:col-span-2', selected && 'hidden lg:block')}>
          <div className="-m-6">
            <div className="space-y-2 border-b border-pine-900/5 p-4">
              <SearchInput value={q} onChange={setQ} placeholder="Search messages…" />
              <div className="flex gap-1">
                {(['', ...INQUIRY_STATUSES] as const).map((s) => (
                  <button key={s || 'all'} onClick={() => setFilter(s)} className={cn('rounded-md px-2.5 py-1 text-xs font-medium capitalize', filter === s ? 'bg-pine-900 text-white' : 'text-pine-800/70 hover:bg-sand-100')}>
                    {s || 'All'}
                  </button>
                ))}
              </div>
            </div>
            {list.length === 0 ? (
              <EmptyState icon={Inbox} title="Inbox zero" description="No messages match." />
            ) : (
              <ul className="max-h-[65vh] divide-y divide-pine-900/5 overflow-y-auto">
                {list.map((i) => (
                  <li key={i.id}>
                    <button
                      onClick={() => setSelectedId(i.id)}
                      className={cn('flex w-full gap-3 px-4 py-3.5 text-left transition-colors', selectedId === i.id ? 'bg-sand-100' : 'hover:bg-sand-50')}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pine-100 text-xs font-bold text-pine-800">{initials(i.name)}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className={cn('truncate text-sm', i.status === 'new' ? 'font-semibold text-pine-950' : 'text-pine-900')}>{i.name}</span>
                          <span className="shrink-0 text-[11px] text-pine-800/45">{timeAgo(i.createdAt)}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs font-medium text-pine-900">{i.subject}</span>
                        <span className="block truncate text-xs text-pine-800/55">{i.message}</span>
                      </span>
                      {i.status === 'new' && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-ember-500" aria-label="New" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <div className={cn('lg:col-span-3', !selected && 'hidden lg:block')}>
          {selected ? (
            <Card>
              <button onClick={() => setSelectedId(null)} className="mb-4 inline-flex items-center gap-1.5 text-sm text-pine-800/60 lg:hidden"><ArrowLeft className="h-4 w-4" /> Back</button>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-pine-800/60">
                    {selected.name} · <a href={`mailto:${selected.email}`} className="hover:underline">{selected.email}</a>
                    {selected.phone && <> · {selected.phone}</>}
                  </p>
                  <p className="mt-0.5 text-xs text-pine-800/45">{formatDate(selected.createdAt, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <StatusSelect value={selected.status} options={INQUIRY_STATUSES} tone={inquiryTone} onChange={(v) => setStatus(selected.id, v)} />
              </div>
              {selected.trekInterest && <div className="mt-4"><Badge tone="orange">Interested in: {selected.trekInterest}</Badge></div>}
              <p className="mt-6 whitespace-pre-wrap rounded-xl bg-sand-50 p-5 text-sm leading-relaxed text-pine-900 ring-1 ring-pine-900/5">{selected.message}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                  onClick={() => selected.status === 'new' && setStatus(selected.id, 'replied')}
                  className="inline-flex items-center gap-2 rounded-lg bg-pine-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-pine-800"
                >
                  <Mail className="h-4 w-4" /> Reply by email
                </a>
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-pine-900 ring-1 ring-pine-900/10 hover:bg-sand-50">
                    <Phone className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                <Btn variant="ghost" className="ml-auto text-rose-600" onClick={() => del(selected.id)}><Trash2 className="h-4 w-4" /> Delete</Btn>
              </div>
            </Card>
          ) : (
            <Card>
              <EmptyState icon={Mail} title="Select a message" description="Pick an inquiry from the list to read and reply." />
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
