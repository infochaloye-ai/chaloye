import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, Field, Input, PageHeader, Textarea } from '@/components/admin/ui';
import { ImageField, StringList } from '@/components/admin/fields';
import { FeatureListField, StatListField } from '@/components/admin/FeatureListField';
import { FormGrid, SaveBar, useSingletonDraft } from '@/components/admin/useSingletonDraft';
import type { HomeContent } from '@/lib/cms/types';

export default function HomepageAdmin() {
  const { draft, setDraft, dirty, saving, save, discard } = useSingletonDraft('home');
  const hero = draft.hero;
  const setHero = (patch: Partial<HomeContent['hero']>) => setDraft({ ...draft, hero: { ...hero, ...patch } });
  const setCta = (patch: Partial<HomeContent['cta']>) => setDraft({ ...draft, cta: { ...draft.cta, ...patch } });

  return (
    <div className="pb-24">
      <PageHeader
        title="Homepage"
        description="Edit the text, images and sections on your homepage. Featured treks are chosen from each trek's settings."
        actions={<a href="/" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-pine-900 shadow-sm ring-1 ring-pine-900/10 hover:bg-sand-50">Preview <ExternalLink className="h-3.5 w-3.5" /></a>}
      />

      <div className="space-y-6">
        <Card title="Hero" description="The first thing visitors see.">
          <FormGrid>
            <Field label="Eyebrow" hint="Small label above the headline" className="sm:col-span-2"><Input value={hero.eyebrow} onChange={(e) => setHero({ eyebrow: e.target.value })} /></Field>
            <Field label="Headline"><Input value={hero.title} onChange={(e) => setHero({ title: e.target.value })} /></Field>
            <Field label="Headline highlight" hint="Shown on a second line in orange"><Input value={hero.highlight} onChange={(e) => setHero({ highlight: e.target.value })} /></Field>
            <Field label="Subtitle" className="sm:col-span-2"><Textarea rows={3} value={hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} /></Field>
            <Field label="Primary button"><Input value={hero.primaryCta} onChange={(e) => setHero({ primaryCta: e.target.value })} /></Field>
            <Field label="Secondary button"><Input value={hero.secondaryCta} onChange={(e) => setHero({ secondaryCta: e.target.value })} /></Field>
            <Field label="Background video URL" hint="MP4 link. Leave empty to use the image only." className="sm:col-span-2"><Input value={hero.videoUrl} onChange={(e) => setHero({ videoUrl: e.target.value })} /></Field>
            <div className="sm:col-span-2"><ImageField label="Fallback / poster image" value={hero.posterImage} onChange={(v) => setHero({ posterImage: v })} /></div>
          </FormGrid>
        </Card>

        <Card title="Regions strip" description="Scrolling list of destinations below the hero.">
          <StringList label="Regions" items={draft.regions} onChange={(regions) => setDraft({ ...draft, regions })} placeholder="e.g. Uttarakhand" />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Stats" description="Up to 4 numbers shown in the green band.">
            <StatListField label="Stats" items={draft.stats} onChange={(stats) => setDraft({ ...draft, stats })} />
          </Card>
          <Card title="Why us · intro">
            <div className="space-y-4">
              <Field label="Section title"><Input value={draft.featuresTitle} onChange={(e) => setDraft({ ...draft, featuresTitle: e.target.value })} /></Field>
              <Field label="Section subtitle"><Textarea rows={3} value={draft.featuresSubtitle} onChange={(e) => setDraft({ ...draft, featuresSubtitle: e.target.value })} /></Field>
              <ImageField label="Section image" value={draft.featuresImage} onChange={(featuresImage) => setDraft({ ...draft, featuresImage })} aspect="aspect-[4/5]" />
            </div>
          </Card>
        </div>

        <Card title="Why us · features">
          <FeatureListField label="Features" items={draft.features} onChange={(features) => setDraft({ ...draft, features })} max={6} />
        </Card>

        <Card title="Bottom call-to-action">
          <FormGrid>
            <Field label="Title" className="sm:col-span-2"><Input value={draft.cta.title} onChange={(e) => setCta({ title: e.target.value })} /></Field>
            <Field label="Subtitle" className="sm:col-span-2"><Textarea rows={2} value={draft.cta.subtitle} onChange={(e) => setCta({ subtitle: e.target.value })} /></Field>
            <Field label="Button label"><Input value={draft.cta.buttonLabel} onChange={(e) => setCta({ buttonLabel: e.target.value })} /></Field>
            <div className="sm:col-span-2"><ImageField label="Background image" value={draft.cta.image} onChange={(image) => setCta({ image })} /></div>
          </FormGrid>
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
