import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Compass, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCMS, usePublishedTreks, useSettings } from '@/context/CMSContext';
import TrekCard from '@/components/site/TrekCard';
import Reveal from '@/components/site/Reveal';
import { Button, Highlighted } from '@/components/site/ui';
import { cn } from '@/lib/format';
import type { Difficulty } from '@/lib/cms/types';

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging', 'Expert'];
const DURATIONS = [
  { id: 'short', label: 'Up to 5 days', test: (d: number) => d <= 5 },
  { id: 'mid', label: '6 – 8 days', test: (d: number) => d >= 6 && d <= 8 },
  { id: 'long', label: '9+ days', test: (d: number) => d >= 9 },
];
const SORTS = [
  { id: 'popular', label: 'Most popular' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'duration', label: 'Shortest first' },
];

type Filters = { q: string; region: string; difficulty: string; duration: string; sort: string };
const EMPTY: Filters = { q: '', region: '', difficulty: '', duration: '', sort: 'popular' };

export default function TreksPage() {
  const router = useRouter();
  const treks = usePublishedTreks();
  const settings = useSettings();
  const page = useCMS().data.pages.trips;
  const [f, setF] = useState<Filters>(EMPTY);

  // Hydrate filters from the URL once the router is ready (supports links like /trips?difficulty=Easy).
  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query;
    setF({
      q: (q.q as string) || '',
      region: (q.region as string) || '',
      difficulty: (q.difficulty as string) || '',
      duration: (q.duration as string) || '',
      sort: (q.sort as string) || 'popular',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const update = (patch: Partial<Filters>) => {
    const next = { ...f, ...patch };
    setF(next);
    const query = Object.fromEntries(Object.entries(next).filter(([k, v]) => v && !(k === 'sort' && v === 'popular')));
    router.replace({ pathname: '/trips', query }, undefined, { shallow: true, scroll: false });
  };

  const regions = useMemo(() => Array.from(new Set(treks.map((t) => t.region))).sort(), [treks]);

  const results = useMemo(() => {
    const q = f.q.trim().toLowerCase();
    const dur = DURATIONS.find((d) => d.id === f.duration);
    const list = treks.filter(
      (t) =>
        (!q || [t.name, t.region, t.country, t.summary].join(' ').toLowerCase().includes(q)) &&
        (!f.region || t.region === f.region) &&
        (!f.difficulty || t.difficulty === f.difficulty) &&
        (!dur || dur.test(t.durationDays))
    );
    const sorted = [...list];
    if (f.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
    else if (f.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
    else if (f.sort === 'duration') sorted.sort((a, b) => a.durationDays - b.durationDays);
    else sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || b.reviewCount - a.reviewCount);
    return sorted;
  }, [treks, f]);

  const activeCount = [f.q, f.region, f.difficulty, f.duration].filter(Boolean).length;

  const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
        active ? 'bg-pine-900 text-white' : 'bg-white text-pine-900 ring-1 ring-pine-900/10 hover:ring-pine-900/30'
      )}
    >
      {children}
    </button>
  );

  return (
    <>
      <Head>
        <title>{`All treks · ${settings.siteName}`}</title>
      </Head>

      <section className="grain relative overflow-hidden bg-pine-950 pb-20 pt-40 text-white sm:pb-24 sm:pt-48">
        <img src={page.image} alt="" className="absolute inset-0 h-full w-full animate-ken-burns object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/60 to-pine-950/30" />
        <div className="container-x relative">
          <div className="eyebrow mb-5 text-ember-300 animate-fade-up">
            <Compass className="h-4 w-4" /> {treks.length} {page.eyebrow}
          </div>
          <h1 className="max-w-3xl animate-fade-up font-display text-5xl font-bold leading-[1] [animation-delay:100ms] sm:text-7xl">
            <Highlighted title={page.title} highlight={page.highlight} className="text-ember-400" />
          </h1>
          <div className="mt-10 flex max-w-2xl animate-fade-up items-center gap-3 rounded-full bg-white p-2 pl-6 text-pine-950 shadow-2xl [animation-delay:200ms]">
            <Search className="h-5 w-5 shrink-0 text-pine-800/40" />
            <input
              value={f.q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder="Search by trek name or region…"
              aria-label="Search treks"
              className="min-w-0 flex-1 bg-transparent py-3 outline-none placeholder:text-pine-800/40"
            />
            {f.q && (
              <button onClick={() => update({ q: '' })} aria-label="Clear search" className="rounded-full p-2 hover:bg-sand-100">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[72px] z-30 border-b border-pine-900/5 bg-sand-50/90 backdrop-blur-xl">
        <div className="container-x flex items-center gap-3 overflow-x-auto py-4 no-scrollbar">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-pine-800/50" />
          <Chip active={!f.difficulty} onClick={() => update({ difficulty: '' })}>All levels</Chip>
          {DIFFICULTIES.map((d) => (
            <Chip key={d} active={f.difficulty === d} onClick={() => update({ difficulty: f.difficulty === d ? '' : d })}>{d}</Chip>
          ))}
          <span className="mx-1 h-6 w-px shrink-0 bg-pine-900/10" />
          <select
            value={f.region}
            onChange={(e) => update({ region: e.target.value })}
            aria-label="Region"
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-pine-900 outline-none ring-1 ring-pine-900/10"
          >
            <option value="">All regions</option>
            {regions.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select
            value={f.duration}
            onChange={(e) => update({ duration: e.target.value })}
            aria-label="Duration"
            className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-pine-900 outline-none ring-1 ring-pine-900/10"
          >
            <option value="">Any duration</option>
            {DURATIONS.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <select
            value={f.sort}
            onChange={(e) => update({ sort: e.target.value })}
            aria-label="Sort by"
            className="ml-auto shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-pine-900 outline-none ring-1 ring-pine-900/10"
          >
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <section className="container-x py-12 sm:py-16">
        <div className="mb-8 flex items-center justify-between text-sm text-pine-800/60">
          <span>
            Showing <strong className="text-pine-950">{results.length}</strong> of {treks.length} treks
          </span>
          {activeCount > 0 && (
            <button onClick={() => update({ ...EMPTY, sort: f.sort })} className="font-semibold text-ember-600 hover:underline">
              Clear filters ({activeCount})
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="rounded-[2rem] bg-white px-6 py-24 text-center ring-1 ring-pine-900/[0.04] shadow-soft">
            <Compass className="mx-auto h-12 w-12 text-pine-300" />
            <h2 className="mt-6 text-2xl font-bold">No treks match those filters</h2>
            <p className="mt-2 text-pine-800/60">Try a different region or difficulty, or clear all filters.</p>
            <Button variant="dark" className="mt-8" onClick={() => update(EMPTY)}>Clear all filters</Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 80} className="flex">
                <TrekCard trek={t} className="w-full" />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
