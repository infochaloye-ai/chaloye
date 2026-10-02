import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Images,
  MapPin,
  Mountain,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react';
import { useCMS, usePublishedTreks } from '@/context/CMSContext';
import BookingCard from '@/components/site/BookingCard';
import TrekCard from '@/components/site/TrekCard';
import Reveal from '@/components/site/Reveal';
import { ButtonLink, DifficultyBadge } from '@/components/site/ui';
import { cn, formatPrice } from '@/lib/format';

function Lightbox({ images, index, onClose, onIndex }: { images: string[]; index: number; onClose: () => void; onIndex: (i: number) => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onIndex((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, images.length, onClose, onIndex]);

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-pine-950/95 p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <img src={images[index]} alt="" className="max-h-[85vh] max-w-full animate-pop-in rounded-2xl object-contain" onClick={(e) => e.stopPropagation()} />
      <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + images.length) % images.length); }} aria-label="Previous" className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % images.length); }} aria-label="Next" className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-6 text-sm text-white/70">{index + 1} / {images.length}</div>
        </>
      )}
    </div>,
    document.body
  );
}

export default function TrekDetailPage() {
  const router = useRouter();
  const { data, ready } = useCMS();
  const treks = usePublishedTreks();
  const slug = router.query.slug as string | undefined;
  const trek = treks.find((t) => t.slug === slug);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [openDay, setOpenDay] = useState<number | null>(0);

  const related = useMemo(
    () => (trek ? treks.filter((t) => t.id !== trek.id).sort((a, b) => Number(b.region === trek.region) - Number(a.region === trek.region)).slice(0, 3) : []),
    [trek, treks]
  );

  if (!trek) {
    // Wait for stored CMS content before deciding the trek doesn't exist.
    if (!router.isReady || !ready) return <div className="min-h-screen bg-pine-950" />;
    return (
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 pt-24 text-center">
        <Mountain className="h-14 w-14 text-pine-300" />
        <h1 className="mt-6 text-4xl font-bold">Trek not found</h1>
        <p className="mt-3 text-pine-800/60">This trail may have been retired or renamed.</p>
        <ButtonLink href="/trips" variant="dark" className="mt-8">Browse all treks</ButtonLink>
      </section>
    );
  }

  const gallery = trek.gallery.length ? trek.gallery : [trek.image];
  const currency = data.settings.currency;
  const facts = [
    { icon: Clock, label: 'Duration', value: `${trek.durationDays} days` },
    { icon: Mountain, label: 'Max altitude', value: trek.maxAltitude },
    { icon: Calendar, label: 'Best time', value: trek.bestTime },
    { icon: Users, label: 'Group size', value: trek.groupSize },
  ];

  return (
    <>
      <Head>
        <title>{`${trek.name} · ${data.settings.siteName}`}</title>
        <meta name="description" content={trek.summary} />
        <meta property="og:image" content={trek.image} />
      </Head>

      {/* Hero */}
      <section className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-pine-950 text-white">
        <img src={trek.image} alt={trek.name} className="absolute inset-0 h-full w-full animate-ken-burns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/30 to-pine-950/40" />
        <div className="container-x relative pb-28 pt-40">
          <Link href="/trips" className="mb-8 inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20">
            <ArrowLeft className="h-4 w-4" /> All treks
          </Link>
          <div className="flex animate-fade-up flex-wrap items-center gap-3 text-sm [animation-delay:80ms]">
            <DifficultyBadge level={trek.difficulty} className="bg-white/95 ring-0" />
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-ember-300" />{trek.region}, {trek.country}</span>
            <span className="inline-flex items-center gap-1.5"><Star className="h-4 w-4 fill-ember-400 text-ember-400" />{trek.rating.toFixed(1)} <span className="text-white/60">({trek.reviewCount.toLocaleString('en-IN')} reviews)</span></span>
          </div>
          <h1 className="mt-5 max-w-4xl animate-fade-up font-display text-5xl font-bold leading-[0.95] [animation-delay:160ms] sm:text-7xl lg:text-8xl">{trek.name}</h1>
          <p className="mt-6 max-w-2xl animate-fade-up text-lg text-white/75 [animation-delay:240ms]">{trek.summary}</p>
        </div>
      </section>

      {/* Facts strip */}
      <div className="container-x relative z-10 -mt-14">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-sand-200 shadow-xl ring-1 ring-pine-900/[0.04] shadow-soft lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex items-center gap-4 bg-white p-5 sm:p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-ember-50 text-ember-600"><f.icon className="h-5 w-5" /></div>
              <div className="min-w-0">
                <div className="text-xs text-pine-800/55">{f.label}</div>
                <div className="truncate font-semibold text-pine-950">{f.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
        <div className="space-y-16 lg:col-span-7 xl:col-span-8">
          {/* Overview */}
          <Reveal as="section">
            <div className="eyebrow mb-4">Overview</div>
            <p className="text-lg leading-relaxed text-pine-900/80 sm:text-xl">{trek.description}</p>
          </Reveal>

          {/* Highlights */}
          {trek.highlights.length > 0 && (
            <Reveal as="section">
              <h2 className="text-3xl font-bold">Highlights</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {trek.highlights.map((h, i) => (
                  <li key={i} className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-pine-900/[0.04] shadow-soft">
                    <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-ember-500" />
                    <span className="text-sm leading-relaxed text-pine-900/80">{h}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Gallery */}
          {gallery.length > 1 && (
            <Reveal as="section">
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-bold">Gallery</h2>
                <button onClick={() => setLightbox(0)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600 hover:underline">
                  <Images className="h-4 w-4" /> View all {gallery.length}
                </button>
              </div>
              <div className="mt-6 grid h-80 grid-cols-4 grid-rows-2 gap-3 sm:h-96">
                {gallery.slice(0, 4).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox(i)}
                    className={cn('group relative overflow-hidden rounded-2xl', i === 0 ? 'col-span-2 row-span-2' : i === 1 ? 'col-span-2' : 'col-span-1')}
                  >
                    <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105" />
                    {i === 3 && gallery.length > 4 && (
                      <span className="absolute inset-0 flex items-center justify-center bg-pine-950/60 font-semibold text-white">+{gallery.length - 4}</span>
                    )}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {/* Itinerary */}
          {trek.itinerary.length > 0 && (
            <Reveal as="section">
              <h2 className="text-3xl font-bold">Day-by-day itinerary</h2>
              <ol className="relative mt-8 space-y-3 before:absolute before:bottom-6 before:left-[22px] before:top-6 before:w-px before:bg-pine-900/10">
                {trek.itinerary.map((day, i) => {
                  const open = openDay === i;
                  return (
                    <li key={i} className="relative">
                      <button onClick={() => setOpenDay(open ? null : i)} aria-expanded={open} className="flex w-full items-start gap-5 text-left">
                        <span className={cn('relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold transition-colors', open ? 'bg-ember-500 text-pine-950' : 'bg-white text-pine-900 ring-1 ring-pine-900/10')}>
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className={cn('flex-1 rounded-2xl p-5 transition-colors', open ? 'bg-white shadow-sm ring-1 ring-pine-900/[0.04] shadow-soft' : 'hover:bg-white/60')}>
                          <span className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-display text-lg font-semibold text-pine-950">{day.title}</span>
                            <span className="flex gap-2 text-xs font-medium text-pine-800/55">
                              {day.distance && <span className="rounded-full bg-sand-100 px-2.5 py-1">{day.distance}</span>}
                              {day.altitude && <span className="rounded-full bg-sand-100 px-2.5 py-1">{day.altitude}</span>}
                            </span>
                          </span>
                          <span className={cn('grid transition-all duration-500 ease-out-expo', open ? 'mt-2 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                            <span className="overflow-hidden text-sm leading-relaxed text-pine-800/70">{day.description}</span>
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
          )}

          {/* Inclusions */}
          <Reveal as="section" className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl bg-pine-50 p-7 ring-1 ring-pine-100">
              <h3 className="text-xl font-bold text-pine-900">What's included</h3>
              <ul className="mt-5 space-y-3">
                {trek.inclusions.map((x, i) => (
                  <li key={i} className="flex gap-3 text-sm text-pine-900/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-pine-600" />{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl bg-white p-7 ring-1 ring-pine-900/[0.04] shadow-soft">
              <h3 className="text-xl font-bold text-pine-900">Not included</h3>
              <ul className="mt-5 space-y-3">
                {trek.exclusions.map((x, i) => (
                  <li key={i} className="flex gap-3 text-sm text-pine-800/70"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />{x}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4">
          <div className="lg:sticky lg:top-28">
            <BookingCard trek={trek} id="book" />
          </div>
        </aside>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-pine-900/5 bg-sand-100 py-20">
          <div className="container-x">
            <h2 className="text-3xl font-bold sm:text-4xl">You might also like</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => <TrekCard key={t.id} trek={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-pine-900/10 bg-white/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div>
          <div className="text-[11px] text-pine-800/55">From</div>
          <div className="font-display text-xl font-bold">{formatPrice(trek.price, currency)}</div>
        </div>
        <a href="#book" className="rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-pine-950">Book now</a>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />

      {lightbox !== null && <Lightbox images={gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />}
    </>
  );
}
