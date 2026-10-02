import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Copy, ExternalLink, Map, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Badge, Card, EmptyState, IconBtn, PageHeader, SearchInput, Select, Table, Td, Th, Toggle, useConfirm } from '@/components/admin/ui';
import { useToast } from '@/components/admin/Toast';
import { cn, formatPrice, todayISO } from '@/lib/format';
import type { Trek } from '@/lib/cms/types';

export default function TreksAdmin() {
  const { data, update, remove, create } = useCMS();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return data.treks.filter(
      (t) =>
        (!s || `${t.name} ${t.region} ${t.country}`.toLowerCase().includes(s)) &&
        (!status || t.status === status) &&
        (!difficulty || t.difficulty === difficulty)
    );
  }, [data.treks, q, status, difficulty]);

  const currency = data.settings.currency;
  const today = todayISO();

  const togglePublish = async (t: Trek) => {
    await update('treks', t.id, { status: t.status === 'published' ? 'draft' : 'published' });
    toast(t.status === 'published' ? `"${t.name}" unpublished` : `"${t.name}" is live`);
  };

  const toggleFeatured = async (t: Trek) => {
    await update('treks', t.id, { featured: !t.featured });
    toast(t.featured ? 'Removed from homepage' : 'Featured on homepage');
  };

  const duplicate = async (t: Trek) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...rest } = t;
    let slug = `${t.slug}-copy`;
    let n = 2;
    while (data.treks.some((x) => x.slug === slug)) slug = `${t.slug}-copy-${n++}`;
    const copy = await create('treks', { ...rest, name: `${t.name} (copy)`, slug, status: 'draft', featured: false });
    toast('Trek duplicated as draft');
    router.push(`/admin/treks/${copy.id}`);
  };

  const del = async (t: Trek) => {
    const ok = await confirm({ title: 'Delete trek?', message: `"${t.name}" will be permanently removed from the website.`, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    await remove('treks', t.id);
    toast('Trek deleted');
  };

  return (
    <>
      <PageHeader
        title="Treks"
        description={`${data.treks.length} treks · ${data.treks.filter((t) => t.status === 'published').length} published`}
        actions={
          <Link href="/admin/treks/new" className="inline-flex items-center gap-2 rounded-lg bg-pine-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-pine-800">
            <Plus className="h-4 w-4" /> New trek
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <div className="-m-6">
          <div className="flex flex-col gap-2 border-b border-pine-900/5 p-4 sm:flex-row">
            <SearchInput value={q} onChange={setQ} placeholder="Search treks…" className="flex-1" />
            <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-40">
              <option value="">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </Select>
            <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="sm:w-44">
              <option value="">All difficulties</option>
              {['Easy', 'Moderate', 'Challenging', 'Expert'].map((d) => <option key={d}>{d}</option>)}
            </Select>
          </div>

          {rows.length === 0 ? (
            <EmptyState
              icon={Map}
              title={data.treks.length ? 'No treks match your filters' : 'No treks yet'}
              description={data.treks.length ? 'Try a different search.' : 'Create your first trek to show it on the website.'}
              action={!data.treks.length && <Link href="/admin/treks/new" className="rounded-lg bg-pine-900 px-4 py-2.5 text-sm font-medium text-white">Create trek</Link>}
            />
          ) : (
            <Table head={<><Th>Trek</Th><Th>Difficulty</Th><Th>Price</Th><Th>Departures</Th><Th className="text-center">Featured</Th><Th>Published</Th><Th className="text-right">Actions</Th></>}>
              {rows.map((t) => {
                const upcoming = t.departures.filter((d) => d >= today).length;
                return (
                  <tr key={t.id} className="group hover:bg-sand-50">
                    <Td>
                      <Link href={`/admin/treks/${t.id}`} className="flex items-center gap-3">
                        <img src={t.image} alt="" className="h-11 w-14 shrink-0 rounded-md object-cover ring-1 ring-pine-900/10" />
                        <div className="min-w-0">
                          <div className="truncate font-medium text-pine-950 group-hover:underline">{t.name}</div>
                          <div className="text-xs text-pine-800/50">{t.region} · {t.durationDays} days</div>
                        </div>
                      </Link>
                    </Td>
                    <Td><Badge>{t.difficulty}</Badge></Td>
                    <Td className="whitespace-nowrap font-medium">{formatPrice(t.price, currency)}</Td>
                    <Td>
                      <span className={cn('text-sm', upcoming === 0 && 'font-medium text-amber-700')}>{upcoming === 0 ? 'None upcoming' : `${upcoming} upcoming`}</span>
                    </Td>
                    <Td className="text-center">
                      <IconBtn label={t.featured ? 'Unfeature' : 'Feature on homepage'} onClick={() => toggleFeatured(t)}>
                        <Star className={cn('h-4 w-4', t.featured ? 'fill-ember-500 text-ember-500' : '')} />
                      </IconBtn>
                    </Td>
                    <Td><Toggle checked={t.status === 'published'} onChange={() => togglePublish(t)} /></Td>
                    <Td>
                      <div className="flex justify-end gap-0.5">
                        <Link href={`/admin/treks/${t.id}`} aria-label="Edit" title="Edit" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-pine-800/60 hover:bg-pine-900/5 hover:text-pine-950"><Pencil className="h-4 w-4" /></Link>
                        {t.status === 'published' && (
                          <a href={`/trips/${t.slug}`} target="_blank" rel="noreferrer" aria-label="View on site" title="View on site" className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-pine-800/60 hover:bg-pine-900/5 hover:text-pine-950"><ExternalLink className="h-4 w-4" /></a>
                        )}
                        <IconBtn label="Duplicate" onClick={() => duplicate(t)}><Copy className="h-4 w-4" /></IconBtn>
                        <IconBtn label="Delete" className="hover:bg-rose-50 hover:text-rose-600" onClick={() => del(t)}><Trash2 className="h-4 w-4" /></IconBtn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </Table>
          )}
        </div>
      </Card>
    </>
  );
}
