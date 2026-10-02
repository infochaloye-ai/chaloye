import React from 'react';
import type { SectionCopy } from '@/lib/cms/types';
import { Field, Input, Textarea } from './ui';

/** Editor for a section heading: eyebrow, title (+ orange highlight) and optional subtitle. */
export function SectionCopyFields({ value, onChange, subtitle = true }: { value: SectionCopy; onChange: (v: SectionCopy) => void; subtitle?: boolean }) {
  const set = (patch: Partial<SectionCopy>) => onChange({ ...value, ...patch });
  const highlightMissing = value.highlight && !value.title.includes(value.highlight);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Eyebrow" hint="Small label above the title"><Input value={value.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
      <Field label="Highlight" hint="Words from the title to show in orange" error={highlightMissing ? 'Not found in the title' : undefined}>
        <Input value={value.highlight} onChange={(e) => set({ highlight: e.target.value })} />
      </Field>
      <Field label="Title" className="sm:col-span-2"><Input value={value.title} onChange={(e) => set({ title: e.target.value })} /></Field>
      {subtitle && (
        <Field label="Subtitle" className="sm:col-span-2"><Textarea rows={2} value={value.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
      )}
    </div>
  );
}
