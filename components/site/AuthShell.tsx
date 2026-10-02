import React from 'react';
import Head from 'next/head';
import { Quote } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { IMAGES } from '@/lib/cms/seed';

export const authInput =
  'w-full rounded-2xl bg-white px-5 py-4 text-pine-950 ring-1 ring-pine-900/10 outline-none transition placeholder:text-pine-800/40 focus:ring-2 focus:ring-ember-500';

export default function AuthShell({ title, subtitle, children }: { title: string; subtitle: React.ReactNode; children: React.ReactNode }) {
  const { data } = useCMS();
  const t = data.testimonials.find((x) => x.published);
  return (
    <>
      <Head>
        <title>{`${title} · ${data.settings.siteName}`}</title>
      </Head>
      <section className="grid min-h-screen pt-[72px] lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-16 sm:px-8">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
            <p className="mt-3 text-pine-800/65">{subtitle}</p>
            <div className="mt-10">{children}</div>
          </div>
        </div>
        <div className="grain relative hidden overflow-hidden bg-pine-950 lg:block">
          <img src={IMAGES.lonePeak} alt="" className="absolute inset-0 h-full w-full animate-ken-burns object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-pine-950 via-pine-950/20 to-transparent" />
          {t && (
            <figure className="absolute bottom-12 left-12 right-12 rounded-3xl bg-white/10 p-8 text-white ring-1 ring-white/20 backdrop-blur-xl">
              <Quote className="h-8 w-8 text-ember-400" />
              <blockquote className="mt-4 font-display text-xl leading-snug">“{t.quote}”</blockquote>
              <figcaption className="mt-5 text-sm text-white/70">{t.name} · {t.trekName}</figcaption>
            </figure>
          )}
        </div>
      </section>
    </>
  );
}
