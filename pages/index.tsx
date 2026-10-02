import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Mountain, Play, Quote, Search, Star } from 'lucide-react';
import { useCMS, usePublishedTreks } from '@/context/CMSContext';
import TrekCard from '@/components/site/TrekCard';
import Reveal from '@/components/site/Reveal';
import FaqList from '@/components/site/Faq';
import { Avatar, ButtonLink, Highlighted, SectionHeading, Stars } from '@/components/site/ui';
import { getIcon } from '@/lib/icons';
import { formatDate, formatPrice, todayISO } from '@/lib/format';
import type { Difficulty, SectionCopy } from '@/lib/cms/types';

const LEVELS: Difficulty[] = ['Easy', 'Moderate', 'Challenging', 'Expert'];

function Heading({ copy, align }: { copy: SectionCopy; align?: 'left' | 'center' }) {
  return <SectionHeading align={align} eyebrow={copy.eyebrow} title={<Highlighted title={copy.title} highlight={copy.highlight} />} subtitle={copy.subtitle} />;
}

export default function HomePage() {
  const { data } = useCMS();
  const treks = usePublishedTreks();
  const router = useRouter();
  const { hero, stats, features, cta, regions, sections, levelBlurbs } = data.home;
  const currency = data.settings.currency;

  const featured = useMemo(() => {
    const f = treks.filter((t) => t.featured);
    return (f.length >= 3 ? f : treks).slice(0, 5);
  }, [treks]);

  const spotlight = useMemo(() => {
    const today = todayISO();
    const withDate = featured
      .map((t) => ({ trek: t, date: [...t.departures].sort().find((d) => d >= today) }))
      .filter((x) => x.date)
      .sort((a, b) => a.date!.localeCompare(b.date!));
    return withDate[0];
  }, [featured]);

  const testimonials = data.testimonials.filter((t) => t.published);
  const faqs = [...data.faqs].filter((f) => f.published).sort((a, b) => a.order - b.order);

  const [finder, setFinder] = useState({ region: '', difficulty: '' });
  const allRegions = useMemo(() => Array.from(new Set(treks.map((t) => t.region))).sort(), [treks]);

  const countByDifficulty = (d: Difficulty) => treks.filter((t) => t.difficulty === d).length;

  return (
    <>
      <Head>
        <title>{`${data.settings.siteName} · ${hero.title} ${hero.highlight}`}</title>
      </Head>

      {/* ───────── Hero ───────── */}
      <section className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-pine-950 text-white">
        <div className="absolute inset-0 animate-ken-burns">
          {hero.videoUrl ? (
            <video className="h-full w-full object-cover" src={hero.videoUrl} poster={hero.posterImage} autoPlay muted loop playsInline />
          ) : (
            <img src={hero.posterImage} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/40 to-pine-950/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-pine-950/70 via-transparent to-transparent" />

        <div className="container-x relative z-10 flex flex-1 flex-col justify-end pb-10 pt-40 sm:pb-14">
          <div className="grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="mb-6 inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium ring-1 ring-white/20 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
                {hero.eyebrow}
              </div>
              <h1 className="animate-fade-up font-display text-[3.2rem] font-bold leading-[0.95] tracking-tight [animation-delay:120ms] sm:text-7xl lg:text-[6.5rem]">
                {hero.title}
                <br />
                <span className="bg-gradient-to-r from-ember-300 via-ember-400 to-ember-500 bg-clip-text text-transparent">{hero.highlight}</span>
              </h1>
              <p className="mt-7 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:240ms] sm:text-lg">{hero.subtitle}</p>
              <div className="mt-9 flex animate-fade-up flex-wrap gap-3 [animation-delay:360ms]">
                <ButtonLink href="/trips">
                  {hero.primaryCta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </ButtonLink>
                <ButtonLink href="/contact" variant="ghost-light">
                  <Play className="h-4 w-4 fill-current" />
                  {hero.secondaryCta}
                </ButtonLink>
              </div>
            </div>

            {spotlight && (
              <Link
                href={`/trips/${spotlight.trek.slug}`}
                className="group hidden animate-fade-up rounded-3xl bg-white/10 p-3 ring-1 ring-white/20 backdrop-blur-xl transition-colors [animation-delay:480ms] hover:bg-white/15 lg:col-span-4 lg:block"
              >
                <div className="flex gap-4">
                  <img src={spotlight.trek.image} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-ember-300">Next departure</div>
                      <div className="mt-1 truncate font-display text-lg font-semibold">{spotlight.trek.name}</div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{formatDate(spotlight.date!, { day: 'numeric', month: 'short' })}</span>
                      <span className="font-semibold text-white">{formatPrice(spotlight.trek.price, currency)}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-white/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </Link>
            )}
          </div>

          {/* Trek finder */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const q = new URLSearchParams();
              if (finder.region) q.set('region', finder.region);
              if (finder.difficulty) q.set('difficulty', finder.difficulty);
              router.push(`/trips${q.toString() ? `?${q}` : ''}`);
            }}
            className="mt-12 grid animate-fade-up gap-2 rounded-3xl bg-white p-2 text-pine-950 shadow-2xl [animation-delay:600ms] sm:grid-cols-[1fr_1fr_auto] sm:rounded-full"
          >
            <label className="flex items-center gap-3 rounded-full px-5 py-3 hover:bg-sand-100">
              <MapPin className="h-5 w-5 shrink-0 text-ember-600" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-pine-800/50">Where</span>
                <select value={finder.region} onChange={(e) => setFinder({ ...finder, region: e.target.value })} className="-ml-1 w-full bg-transparent text-sm font-semibold outline-none">
                  <option value="">Any region</option>
                  {allRegions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-full px-5 py-3 hover:bg-sand-100 sm:border-l sm:border-pine-900/10">
              <Mountain className="h-5 w-5 shrink-0 text-ember-600" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-pine-800/50">Difficulty</span>
                <select value={finder.difficulty} onChange={(e) => setFinder({ ...finder, difficulty: e.target.value })} className="-ml-1 w-full bg-transparent text-sm font-semibold outline-none">
                  <option value="">Any level</option>
                  {LEVELS.map((level) => <option key={level}>{level}</option>)}
                </select>
              </span>
            </label>
            <button className="flex items-center justify-center gap-2 rounded-full bg-pine-900 px-8 py-4 font-semibold text-white transition-colors hover:bg-pine-800">
              <Search className="h-4 w-4" /> Find treks
            </button>
          </form>
        </div>
      </section>

      {/* ───────── Region marquee ───────── */}
      {regions.length > 0 && (
        <section className="overflow-hidden border-b border-pine-900/5 bg-sand-50 py-6">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
            {[...regions, ...regions, ...regions, ...regions].map((r, i) => (
              <span key={i} className="inline-flex items-center gap-12 font-display text-2xl font-semibold text-pine-900/25 sm:text-3xl">
                {r}
                <span className="h-2 w-2 rounded-full bg-ember-500/60" />
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ───────── Featured treks ───────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <Reveal className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Heading copy={sections.featured} />
            <ButtonLink href="/trips" variant="outline" className="self-start md:self-auto">
              View all {treks.length} treks <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </ButtonLink>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((t, i) => (
              <Reveal key={t.id} delay={i * 80} className={i === 0 ? 'md:col-span-2 lg:col-span-1 lg:row-span-2 flex' : 'flex'}>
                <TrekCard trek={t} size={i === 0 ? 'lg' : 'md'} className="w-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Why us ───────── */}
      <section className="relative bg-gradient-to-b from-pine-50/80 via-sand-50/60 to-transparent py-24 sm:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <img src={data.home.featuresImage} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-pine-950/40 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-2 w-60 rounded-3xl bg-pine-900 p-6 text-white shadow-2xl sm:-right-8">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-ember-400 text-ember-400" />)}
              </div>
              <div className="mt-3 font-display text-4xl font-bold">{stats[2]?.value ?? '4.9/5'}</div>
              <div className="mt-1 text-sm text-white/70">from {treks.reduce((n, t) => n + t.reviewCount, 0).toLocaleString('en-IN')} verified reviews</div>
            </div>
            <div className="absolute -left-3 top-8 hidden rounded-2xl bg-ember-500 px-5 py-4 text-pine-950 shadow-xl sm:block">
              <div className="font-display text-3xl font-bold">1:8</div>
              <div className="text-xs font-semibold">leader to trekker ratio</div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <SectionHeading eyebrow="Why Chal Oye" title={data.home.featuresTitle} subtitle={data.home.featuresSubtitle} />
            </Reveal>
            <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {features.map((f, i) => {
                const Icon = getIcon(f.icon);
                return (
                  <Reveal key={i} delay={i * 90}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-50 text-pine-700 ring-1 ring-pine-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-lg font-semibold text-pine-950">{f.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-pine-800/65">{f.description}</p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Stats band ───────── */}
      <section className="topo relative overflow-hidden bg-pine-900 py-20 text-white">
        <div className="container-x grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 80} className="border-l border-white/15 pl-6">
              <div className="font-display text-5xl font-bold tracking-tight sm:text-6xl">{s.value}</div>
              <div className="mt-2 text-sm text-white/60">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── By difficulty ───────── */}
      <section className="py-24 sm:py-32">
        <div className="container-x">
          <Reveal>
            <Heading align="center" copy={sections.levels} />
          </Reveal>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LEVELS.map((level) => ({ level, blurb: levelBlurbs[level] })).map((d, i) => (
              <Reveal key={d.level} delay={i * 80}>
                <Link
                  href={`/trips?difficulty=${d.level}`}
                  className="group flex h-full flex-col rounded-3xl bg-white p-7 ring-1 ring-pine-900/[0.04] shadow-soft transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:bg-pine-900 hover:text-white hover:shadow-2xl"
                >
                  <div className="flex items-end gap-1" aria-hidden>
                    {[1, 2, 3, 4].map((b) => (
                      <span key={b} className={`w-2 rounded-full transition-colors ${b <= i + 1 ? 'bg-ember-500' : 'bg-pine-900/10 group-hover:bg-white/15'}`} style={{ height: 8 + b * 7 }} />
                    ))}
                  </div>
                  <h3 className="mt-8 text-2xl font-bold">{d.level}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-pine-800/65 group-hover:text-white/70">{d.blurb}</p>
                  <div className="mt-8 flex items-center justify-between text-sm font-semibold">
                    <span>{countByDifficulty(d.level)} treks</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      {testimonials.length > 0 && (
        <section className="bg-sand-100 py-24 sm:py-32">
          <div className="container-x">
            <Reveal>
              <Heading copy={sections.testimonials} />
            </Reveal>
            <div className="mt-14 grid gap-6 lg:grid-cols-12">
              <Reveal className="relative overflow-hidden rounded-[2rem] bg-pine-900 p-8 text-white sm:p-12 lg:col-span-7 lg:row-span-2">
                <Quote className="h-12 w-12 text-ember-400" />
                <p className="mt-8 font-display text-2xl font-medium leading-snug sm:text-3xl">“{testimonials[0].quote}”</p>
                <div className="mt-10 flex items-center gap-4">
                  <Avatar src={testimonials[0].avatar} name={testimonials[0].name} className="h-14 w-14 text-base ring-2 ring-white/20" />
                  <div>
                    <div className="font-semibold">{testimonials[0].name}</div>
                    <div className="text-sm text-white/60">{testimonials[0].location} · {testimonials[0].trekName}</div>
                  </div>
                </div>
                <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-ember-500/20 blur-3xl" />
              </Reveal>
              {testimonials.slice(1, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 90} className="rounded-[2rem] bg-white p-7 ring-1 ring-pine-900/[0.04] shadow-soft lg:col-span-5">
                  <Stars rating={t.rating} />
                  <p className="mt-4 leading-relaxed text-pine-900/80">“{t.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <Avatar src={t.avatar} name={t.name} className="h-10 w-10 text-sm" />
                    <div className="text-sm">
                      <div className="font-semibold text-pine-950">{t.name}</div>
                      <div className="text-pine-800/55">{t.trekName}</div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── FAQ ───────── */}
      {faqs.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-4">
              <Heading copy={sections.faq} />
              <ButtonLink href="/contact" variant="dark" className="mt-8">
                Ask us anything <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
            <Reveal delay={100} className="lg:col-span-8">
              <FaqList faqs={faqs} />
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────── CTA ───────── */}
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <Reveal className="grain relative mx-auto max-w-[1224px] overflow-hidden rounded-[2.5rem] bg-pine-950">
          <img src={cta.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-pine-950 via-pine-950/70 to-transparent" />
          <div className="relative px-8 py-20 sm:px-14 sm:py-28">
            <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] text-white sm:text-6xl">{cta.title}</h2>
            <p className="mt-6 max-w-lg text-lg text-white/70">{cta.subtitle}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact">
                {cta.buttonLabel} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/trips" variant="ghost-light">Browse treks</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
