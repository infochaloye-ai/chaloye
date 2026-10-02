import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/router';
import { ArrowRight, CornerDownLeft, MapPin, Search, X } from 'lucide-react';
import { usePublishedTreks, useSettings } from '@/context/CMSContext';
import { cn, formatPrice } from '@/lib/format';

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const treks = usePublishedTreks();
  const { currency } = useSettings();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return treks.filter((t) => t.featured).slice(0, 5);
    return treks
      .filter((t) => [t.name, t.region, t.country, t.difficulty, t.summary].join(' ').toLowerCase().includes(q))
      .slice(0, 8);
  }, [query, treks]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActive(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open || typeof document === 'undefined') return null;

  const go = (slug?: string) => {
    onClose();
    router.push(slug ? `/trips/${slug}` : `/trips?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === 'Enter') go(results[active]?.slug);
  };

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Search treks">
      <div className="absolute inset-0 bg-pine-950/60 backdrop-blur-sm" onClick={onClose} style={{ animation: 'fade-up .25s both' }} />
      <div className="relative w-full max-w-xl animate-pop-in overflow-hidden rounded-3xl bg-white shadow-2xl" onKeyDown={onKeyDown}>
        <div className="flex items-center gap-3 border-b border-pine-900/5 px-5">
          <Search className="h-5 w-5 shrink-0 text-pine-800/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search treks, regions, difficulty…"
            className="h-16 flex-1 bg-transparent text-base text-pine-950 outline-none placeholder:text-pine-800/40"
          />
          <button onClick={onClose} aria-label="Close search" className="rounded-full p-2 text-pine-800/50 hover:bg-pine-900/5">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-2">
          <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-pine-800/40">
            {query ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'Popular treks'}
          </div>
          {results.length === 0 ? (
            <div className="px-3 py-10 text-center text-sm text-pine-800/60">No treks match “{query}”.</div>
          ) : (
            results.map((t, i) => (
              <button
                key={t.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.slug)}
                className={cn('flex w-full items-center gap-4 rounded-2xl p-2.5 text-left transition-colors', i === active && 'bg-sand-100')}
              >
                <img src={t.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-pine-950">{t.name}</div>
                  <div className="flex items-center gap-1 text-xs text-pine-800/60">
                    <MapPin className="h-3 w-3" /> {t.region} · {t.durationDays} days · {t.difficulty}
                  </div>
                </div>
                <div className="text-right text-sm font-semibold text-pine-900">{formatPrice(t.price, currency)}</div>
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-pine-900/5 bg-sand-50 px-5 py-3 text-xs text-pine-800/50">
          <span className="inline-flex items-center gap-1.5"><CornerDownLeft className="h-3.5 w-3.5" /> to open</span>
          <button onClick={() => go()} className="inline-flex items-center gap-1 font-semibold text-pine-900 hover:text-ember-600">
            View all treks <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
