import React, { useMemo, useState } from 'react';
import { Download, Mail, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Btn, Card, EmptyState, IconBtn, PageHeader, SearchInput, useConfirm } from '@/components/admin/ui';
import { useToast } from '@/components/admin/Toast';
import { downloadCSV } from '@/lib/csv';
import { formatDate, todayISO } from '@/lib/format';

export default function SubscribersAdmin() {
  const { data, remove } = useCMS();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.subscribers.filter((x) => !s || x.email.includes(s));
  }, [data.subscribers, q]);

  const exportCsv = () => {
    downloadCSV(`subscribers-${todayISO()}.csv`, data.subscribers.map((x) => ({ email: x.email, subscribed: x.createdAt.slice(0, 10) })));
  };

  const del = async (id: string, email: string) => {
    if (!(await confirm({ title: 'Remove subscriber?', message: `${email} will no longer be on the list.`, confirmLabel: 'Remove', danger: true }))) return;
    await remove('subscribers', id);
    toast('Subscriber removed');
  };

  return (
    <>
      <PageHeader
        title="Subscribers"
        description="Emails collected by the newsletter form in the footer."
        actions={data.subscribers.length > 0 && <Btn variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Btn>}
      />
      <Card>
        {data.subscribers.length === 0 ? (
          <EmptyState icon={Mail} title="No subscribers yet" description="Sign-ups from the footer form will appear here." />
        ) : (
          <div className="-m-6">
            <div className="border-b border-pine-900/5 p-4">
              <SearchInput value={q} onChange={setQ} placeholder="Search emails…" className="max-w-sm" />
            </div>
            <ul className="divide-y divide-pine-900/5">
              {list.map((x) => (
                <li key={x.id} className="flex items-center justify-between gap-4 px-6 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-pine-950">{x.email}</div>
                    <div className="text-xs text-pine-800/50">Subscribed {formatDate(x.createdAt.slice(0, 10))}</div>
                  </div>
                  <IconBtn label={`Remove ${x.email}`} onClick={() => del(x.id, x.email)}><Trash2 className="h-4 w-4" /></IconBtn>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </>
  );
}
