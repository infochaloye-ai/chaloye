import React from 'react';
import { Card, Field, Input, PageHeader, Textarea } from '@/components/admin/ui';
import { ImageField } from '@/components/admin/fields';
import { SectionCopyFields } from '@/components/admin/SectionCopyField';
import { FormGrid, SaveBar, useSingletonDraft } from '@/components/admin/useSingletonDraft';
import type { PagesContent } from '@/lib/cms/types';

export default function OtherPagesAdmin() {
  const { draft, setDraft, dirty, saving, save, discard } = useSingletonDraft('pages');
  const setTrips = (patch: Partial<PagesContent['trips']>) => setDraft({ ...draft, trips: { ...draft.trips, ...patch } });
  const setContact = (patch: Partial<PagesContent['contact']>) => setDraft({ ...draft, contact: { ...draft.contact, ...patch } });

  return (
    <div className="pb-24">
      <PageHeader title="Other pages" description="Banners and images for the treks list, contact page and sign-in screens." />

      <div className="space-y-6">
        <Card title="All treks page" description="The banner on /trips.">
          <FormGrid>
            <Field label="Eyebrow" hint="Shown after the number of treks, e.g. “9 handpicked trails”"><Input value={draft.trips.eyebrow} onChange={(e) => setTrips({ eyebrow: e.target.value })} /></Field>
            <Field label="Highlight" hint="Words from the title to show in orange"><Input value={draft.trips.highlight} onChange={(e) => setTrips({ highlight: e.target.value })} /></Field>
            <Field label="Title" className="sm:col-span-2"><Input value={draft.trips.title} onChange={(e) => setTrips({ title: e.target.value })} /></Field>
            <div className="sm:col-span-2"><ImageField label="Background image" value={draft.trips.image} onChange={(image) => setTrips({ image })} /></div>
          </FormGrid>
        </Card>

        <Card title="Contact page">
          <div className="space-y-4">
            <SectionCopyFields value={draft.contact} onChange={(v) => setContact(v)} />
            <ImageField label="Banner image" value={draft.contact.image} onChange={(image) => setContact({ image })} />
            <FormGrid>
              <Field label="Form title"><Input value={draft.contact.formTitle} onChange={(e) => setContact({ formTitle: e.target.value })} /></Field>
              <Field label="Form subtitle"><Textarea rows={1} value={draft.contact.formSubtitle} onChange={(e) => setContact({ formSubtitle: e.target.value })} /></Field>
            </FormGrid>
          </div>
        </Card>

        <Card title="Sign in & sign up" description="Image beside the customer login, sign-up and password screens.">
          <ImageField label="Side image" value={draft.auth.image} onChange={(image) => setDraft({ ...draft, auth: { image } })} aspect="aspect-[4/5]" />
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
