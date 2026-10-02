import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Calendar, Clock, MapPin, Mountain, Star } from 'lucide-react';
import type { Trek } from '@/lib/cms/types';
import { cn, formatPrice } from '@/lib/format';
import { useSettings } from '@/context/CMSContext';
import { DifficultyBadge } from './ui';

export default function TrekCard({ trek, className, size = 'md' }: { trek: Trek; className?: string; size?: 'md' | 'lg' }) {
  const { currency } = useSettings();
  const discount = trek.originalPrice && trek.originalPrice > trek.price ? Math.round((1 - trek.price / trek.originalPrice) * 100) : 0;

  return (
    <Link
      href={`/trips/${trek.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-pine-900/[0.04] shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-24px_rgba(14,28,21,0.35)]',
        className
      )}
    >
      <div className={cn('relative overflow-hidden', size === 'lg' ? 'aspect-[4/3] lg:aspect-auto lg:flex-1' : 'aspect-[4/3]')}>
        <img
          src={trek.image}
          alt={trek.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950/70 via-pine-950/0 to-pine-950/10" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <DifficultyBadge level={trek.difficulty} className="bg-white/95 ring-0 backdrop-blur" />
          {discount > 0 && <span className="rounded-full bg-ember-500 px-2.5 py-1 text-xs font-bold text-pine-950">{discount}% off</span>}
        </div>

        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-pine-900 opacity-0 backdrop-blur transition-all duration-500 ease-out-expo group-hover:opacity-100 group-hover:rotate-45">
          <ArrowUpRight className="h-5 w-5 -rotate-45 transition-transform group-hover:rotate-0" />
        </span>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium">
            <MapPin className="h-4 w-4 text-ember-300" />
            {trek.region}, {trek.country}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-ember-400 text-ember-400" />
            {trek.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 className={cn('font-bold leading-tight text-pine-950 transition-colors group-hover:text-pine-700', size === 'lg' ? 'text-2xl sm:text-3xl' : 'text-xl')}>
            {trek.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-pine-800/65">{trek.summary}</p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-pine-800/70">
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{trek.durationDays} days</span>
          <span className="inline-flex items-center gap-1.5"><Mountain className="h-3.5 w-3.5" />{trek.maxAltitude}</span>
          <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{trek.bestTime}</span>
        </div>

        <div className="mt-auto flex items-end justify-between border-t border-pine-900/5 pt-4">
          <div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-pine-800/50">Starting from</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-pine-950">{formatPrice(trek.price, currency)}</span>
              {discount > 0 && <span className="text-sm text-pine-800/40 line-through">{formatPrice(trek.originalPrice!, currency)}</span>}
            </div>
          </div>
          <span className="text-sm font-semibold text-ember-600 underline-offset-4 group-hover:underline">View trek</span>
        </div>
      </div>
    </Link>
  );
}
