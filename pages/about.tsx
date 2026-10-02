import React from 'react';
import Head from 'next/head';
import { ArrowRight } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import PageHero from '@/components/site/PageHero';
import Reveal from '@/components/site/Reveal';
import { Avatar, ButtonLink, SectionHeading } from '@/components/site/ui';
import { getIcon } from '@/lib/icons';

export default function AboutPage() {
  const { data } = useCMS();
  const a = data.about;
  const team = [...data.team].sort((x, y) => x.order - y.order);

  return (
    <>
      <Head>
        <title>{`About us · ${data.settings.siteName}`}</title>
      </Head>

      <PageHero eyebrow="Our story" title={a.heroTitle} subtitle={a.heroSubtitle} image={a.heroImage} />

      {/* Stats */}
      <section className="container-x relative z-10 -mt-12">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-sand-200 shadow-xl ring-1 ring-pine-900/[0.04] shadow-soft lg:grid-cols-4">
          {a.stats.map((s, i) => (
            <div key={i} className="bg-white p-6 text-center sm:p-8">
              <div className="font-display text-4xl font-bold text-pine-900 sm:text-5xl">{s.value}</div>
              <div className="mt-1 text-sm text-pine-800/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="container-x grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <SectionHeading eyebrow="How it began" title={a.storyTitle} />
            </Reveal>
            <div className="mt-8 space-y-5">
              {a.storyParagraphs.map((p, i) => (
                <Reveal key={i} delay={i * 80}>
                  <p className="text-lg leading-relaxed text-pine-900/75">{p}</p>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[2rem]">
              <img src={a.storyImage} alt="" className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -left-4 rounded-3xl bg-ember-500 p-6 text-pine-950 shadow-xl sm:-left-8">
              <div className="font-display text-5xl font-bold">{a.stats[0]?.value}</div>
              <div className="text-sm font-semibold">{a.stats[0]?.label}</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="topo relative bg-pine-900 py-24 text-white sm:py-32">
        <div className="container-x">
          <Reveal>
            <SectionHeading tone="light" eyebrow="What we stand for" title="Values we carry up every mountain" />
          </Reveal>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.values.map((v, i) => {
              const Icon = getIcon(v.icon);
              return (
                <Reveal key={i} delay={i * 80} className="rounded-3xl bg-white/5 p-7 ring-1 ring-white/10 transition-colors hover:bg-white/10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ember-500 text-pine-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{v.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section className="py-24 sm:py-32">
          <div className="container-x">
            <Reveal>
              <SectionHeading align="center" eyebrow="The crew" title="People who'll walk beside you" />
            </Reveal>
            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((m, i) => (
                <Reveal key={m.id} delay={i * 80} className="group">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-pine-100">
                    {m.photo ? (
                      <img src={m.photo} alt={m.name} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:grayscale-0" />
                    ) : (
                      <div className="flex h-full items-center justify-center"><Avatar name={m.name} className="h-28 w-28 text-3xl" /></div>
                    )}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{m.name}</h3>
                  <div className="text-sm font-semibold text-ember-600">{m.role}</div>
                  <p className="mt-3 text-sm leading-relaxed text-pine-800/65">{m.bio}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <Reveal className="mx-auto flex max-w-[1224px] flex-col items-start justify-between gap-8 rounded-[2.5rem] bg-sand-100 p-10 sm:p-14 lg:flex-row lg:items-center">
          <h2 className="max-w-xl text-4xl font-bold leading-tight">Ready to walk with us?</h2>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/trips">Explore treks <ArrowRight className="h-4 w-4" /></ButtonLink>
            <ButtonLink href="/contact" variant="outline">Get in touch</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
