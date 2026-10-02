import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, Field, Input, PageHeader, Textarea } from '@/components/admin/ui';
import { ImageField, Repeater } from '@/components/admin/fields';
import { FeatureListField, StatListField } from '@/components/admin/FeatureListField';
import { SectionCopyFields } from '@/components/admin/SectionCopyField';
import { FormGrid, SaveBar, useSingletonDraft } from '@/components/admin/useSingletonDraft';
import type { AboutContent, SectionCopy } from '@/lib/cms/types';

export default function AboutAdmin() {
  const { draft, setDraft, dirty, saving, save, discard } = useSingletonDraft('about');
  const setSection = (key: keyof AboutContent['sections']) => (v: SectionCopy) => setDraft({ ...draft, sections: { ...draft.sections, [key]: v } });

  return (
    <div className="pb-24">
      <PageHeader
        title="About page"
        description="Your story, values and numbers. Team members are managed under Team."
        actions={<a href="/about" target="_blank" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-pine-900 shadow-sm ring-1 ring-pine-900/10 hover:bg-sand-50">Preview <ExternalLink className="h-3.5 w-3.5" /></a>}
      />

      <div className="space-y-6">
        <Card title="Hero">
          <FormGrid>
            <Field label="Eyebrow" className="sm:col-span-2"><Input value={draft.heroEyebrow} onChange={(e) => setDraft({ ...draft, heroEyebrow: e.target.value })} /></Field>
            <Field label="Title"><Input value={draft.heroTitle} onChange={(e) => setDraft({ ...draft, heroTitle: e.target.value })} /></Field>
            <Field label="Subtitle"><Input value={draft.heroSubtitle} onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })} /></Field>
            <div className="sm:col-span-2"><ImageField label="Background image" value={draft.heroImage} onChange={(heroImage) => setDraft({ ...draft, heroImage })} /></div>
          </FormGrid>
        </Card>

        <Card title="Our story">
          <div className="space-y-4">
            <Field label="Eyebrow"><Input value={draft.storyEyebrow} onChange={(e) => setDraft({ ...draft, storyEyebrow: e.target.value })} /></Field>
            <Field label="Heading"><Input value={draft.storyTitle} onChange={(e) => setDraft({ ...draft, storyTitle: e.target.value })} /></Field>
            <Repeater
              label="Paragraphs"
              items={draft.storyParagraphs}
              onChange={(storyParagraphs) => setDraft({ ...draft, storyParagraphs })}
              newItem={() => ''}
              addLabel="Add paragraph"
              itemLabel={(_, i) => `Paragraph ${i + 1}`}
              renderItem={(p, _upd, i) => (
                <Textarea rows={3} value={p} onChange={(e) => setDraft({ ...draft, storyParagraphs: draft.storyParagraphs.map((x, j) => (j === i ? e.target.value : x)) })} />
              )}
            />
            <ImageField label="Story image" value={draft.storyImage} onChange={(storyImage) => setDraft({ ...draft, storyImage })} aspect="aspect-[4/5]" />
          </div>
        </Card>

        <Card title="Values · heading">
          <SectionCopyFields value={draft.sections.values} onChange={setSection('values')} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Values">
            <FeatureListField label="Values" items={draft.values} onChange={(values) => setDraft({ ...draft, values })} max={8} />
          </Card>
          <Card title="Stats" description="The first stat is also shown on the story image.">
            <StatListField label="Stats" items={draft.stats} onChange={(stats) => setDraft({ ...draft, stats })} />
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Team · heading" description="Team members are managed under Team.">
            <SectionCopyFields value={draft.sections.team} onChange={setSection('team')} />
          </Card>
          <Card title="Bottom call-to-action">
            <SectionCopyFields value={draft.sections.cta} onChange={setSection('cta')} subtitle={false} />
          </Card>
        </div>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
