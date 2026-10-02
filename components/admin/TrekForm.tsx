import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import type { Difficulty, NewItem, Trek } from '@/lib/cms/types';
import { cn, slugify } from '@/lib/format';
import { Badge, Btn, Card, Field, Input, Select, Textarea, Toggle, useConfirm } from './ui';
import { GalleryField, ImageField, Repeater, StringList } from './fields';
import { useToast } from './Toast';
import { useUnsavedGuard } from './useUnsavedGuard';

type TrekDraft = NewItem<'treks'>;

const DIFFICULTIES: Difficulty[] = ['Easy', 'Moderate', 'Challenging', 'Expert'];

export const emptyTrek = (): TrekDraft => ({
  slug: '',
  name: '',
  region: '',
  country: 'India',
  durationDays: 5,
  price: 0,
  originalPrice: undefined,
  difficulty: 'Moderate',
  maxAltitude: '',
  bestTime: '',
  groupSize: '8 – 15 trekkers',
  summary: '',
  description: '',
  image: '',
  gallery: [],
  highlights: [],
  itinerary: [],
  inclusions: [],
  exclusions: [],
  departures: [],
  rating: 4.8,
  reviewCount: 0,
  featured: false,
  status: 'draft',
});

const toDraft = (t: Trek): TrekDraft => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, createdAt, updatedAt, ...rest } = t;
  return rest;
};

export default function TrekForm({ trek }: { trek?: Trek }) {
  const { data, create, update, remove } = useCMS();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const initial = useMemo(() => (trek ? toDraft(trek) : emptyTrek()), [trek]);
  const [draft, setDraft] = useState<TrekDraft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!trek);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const bypassGuard = useUnsavedGuard(dirty && !saving);

  const set = <K extends keyof TrekDraft>(key: K, value: TrekDraft[K]) => setDraft((d) => ({ ...d, [key]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!draft.name.trim()) e.name = 'Name is required';
    if (!draft.slug.trim()) e.slug = 'URL slug is required';
    else if (data.treks.some((t) => t.slug === draft.slug && t.id !== trek?.id)) e.slug = 'Another trek already uses this URL';
    if (!draft.region.trim()) e.region = 'Region is required';
    if (!(draft.price > 0)) e.price = 'Enter a price greater than 0';
    if (draft.originalPrice && draft.originalPrice <= draft.price) e.originalPrice = 'Must be higher than the price to show a discount';
    if (!(draft.durationDays > 0)) e.durationDays = 'Enter the number of days';
    if (!draft.image.trim()) e.image = 'Cover image is required';
    if (!draft.summary.trim()) e.summary = 'A short summary is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async (statusOverride?: Trek['status']) => {
    const payload = { ...draft, ...(statusOverride ? { status: statusOverride } : {}) };
    payload.departures = [...new Set(payload.departures)].sort();
    setDraft(payload);
    if (!validate()) {
      toast('Please fix the highlighted fields', 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSaving(true);
    try {
      if (trek) {
        await update('treks', trek.id, payload);
        toast('Trek saved');
      } else {
        const created = await create('treks', payload);
        toast('Trek created');
        bypassGuard.current = true;
        router.replace(`/admin/treks/${created.id}`);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!trek) return;
    const ok = await confirm({ title: 'Delete trek?', message: `"${trek.name}" will be removed from the website. Existing bookings are kept.`, confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    setSaving(true);
    await remove('treks', trek.id);
    toast('Trek deleted');
    bypassGuard.current = true;
    router.push('/admin/treks');
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
      className="pb-24"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link href="/admin/treks" className="mb-2 inline-flex items-center gap-1.5 text-sm text-pine-800/60 hover:text-pine-950"><ArrowLeft className="h-4 w-4" /> Treks</Link>
          <div className="flex items-center gap-3">
            <h1 className="truncate font-display text-3xl font-bold tracking-tight">{trek ? draft.name || 'Untitled trek' : 'New trek'}</h1>
            <Badge tone={draft.status === 'published' ? 'green' : 'gray'}>{draft.status}</Badge>
          </div>
        </div>
        {trek && trek.status === 'published' && (
          <Link href={`/trips/${trek.slug}`} target="_blank" className="inline-flex items-center gap-1.5 self-start text-sm font-medium text-pine-900 hover:underline sm:self-auto">
            View on site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Trek name" required error={errors.name} className="sm:col-span-2">
                <Input
                  value={draft.name}
                  placeholder="e.g. Kedarkantha Winter Trek"
                  onChange={(e) => {
                    const name = e.target.value;
                    setDraft((d) => ({ ...d, name, slug: slugTouched ? d.slug : slugify(name) }));
                  }}
                />
              </Field>
              <Field label="URL slug" required error={errors.slug} hint={`/trips/${draft.slug || 'your-trek'}`} className="sm:col-span-2">
                <Input
                  value={draft.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set('slug', slugify(e.target.value));
                  }}
                />
              </Field>
              <Field label="Region / state" required error={errors.region}>
                <Input value={draft.region} placeholder="Uttarakhand" onChange={(e) => set('region', e.target.value)} />
              </Field>
              <Field label="Country">
                <Input value={draft.country} onChange={(e) => set('country', e.target.value)} />
              </Field>
              <Field label="Summary" required error={errors.summary} hint="One or two sentences shown on cards and in search." className="sm:col-span-2">
                <Textarea rows={2} value={draft.summary} maxLength={220} onChange={(e) => set('summary', e.target.value)} />
              </Field>
              <Field label="Full description" className="sm:col-span-2">
                <Textarea rows={5} value={draft.description} onChange={(e) => set('description', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Trek details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Duration (days)" required error={errors.durationDays}>
                <Input type="number" min={1} value={draft.durationDays || ''} onChange={(e) => set('durationDays', Number(e.target.value))} />
              </Field>
              <Field label="Difficulty">
                <Select value={draft.difficulty} onChange={(e) => set('difficulty', e.target.value as Difficulty)}>
                  {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
                </Select>
              </Field>
              <Field label="Max altitude">
                <Input value={draft.maxAltitude} placeholder="3,810 m" onChange={(e) => set('maxAltitude', e.target.value)} />
              </Field>
              <Field label="Best time">
                <Input value={draft.bestTime} placeholder="Dec – Apr" onChange={(e) => set('bestTime', e.target.value)} />
              </Field>
              <Field label="Group size" className="sm:col-span-2">
                <Input value={draft.groupSize} onChange={(e) => set('groupSize', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Highlights" description="Short bullet points shown near the top of the trek page.">
            <StringList label="Highlights" items={draft.highlights} onChange={(v) => set('highlights', v)} placeholder="e.g. Summit at sunrise with 360° views" />
          </Card>

          <Card title="Itinerary" description="One entry per day, in order.">
            <Repeater
              label="Days"
              items={draft.itinerary}
              onChange={(v) => set('itinerary', v)}
              newItem={() => ({ title: '', description: '', distance: '', altitude: '' })}
              addLabel="Add day"
              itemLabel={(d, i) => `Day ${i + 1}${d.title ? ` · ${d.title}` : ''}`}
              renderItem={(day, upd) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Input className="sm:col-span-2" placeholder="Title, e.g. Sankri to Juda ka Talab" value={day.title} onChange={(e) => upd({ title: e.target.value })} />
                  <Textarea className="min-h-[70px] sm:col-span-2" rows={2} placeholder="What happens on this day" value={day.description} onChange={(e) => upd({ description: e.target.value })} />
                  <Input placeholder="Distance (optional)" value={day.distance ?? ''} onChange={(e) => upd({ distance: e.target.value })} />
                  <Input placeholder="Altitude (optional)" value={day.altitude ?? ''} onChange={(e) => upd({ altitude: e.target.value })} />
                </div>
              )}
            />
          </Card>

          <Card title="Inclusions & exclusions">
            <div className="grid gap-6 sm:grid-cols-2">
              <StringList label="Included" items={draft.inclusions} onChange={(v) => set('inclusions', v)} placeholder="e.g. All meals" />
              <StringList label="Not included" items={draft.exclusions} onChange={(v) => set('exclusions', v)} placeholder="e.g. Travel insurance" />
            </div>
          </Card>

          <Card title="Media">
            <div className="space-y-6">
              <div>
                <ImageField label="Cover image" required value={draft.image} onChange={(v) => set('image', v)} aspect="aspect-[4/3]" />
                {errors.image && <p className="mt-1 text-xs font-medium text-rose-600">{errors.image}</p>}
              </div>
              <GalleryField label="Gallery" items={draft.gallery} onChange={(v) => set('gallery', v)} />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Visibility">
            <div className="space-y-5">
              <Toggle label="Published" description="Visible on the public website" checked={draft.status === 'published'} onChange={(v) => set('status', v ? 'published' : 'draft')} />
              <Toggle label="Featured" description="Shown on the homepage" checked={draft.featured} onChange={(v) => set('featured', v)} />
            </div>
          </Card>

          <Card title="Pricing">
            <div className="space-y-4">
              <Field label={`Price per person (${data.settings.currency})`} required error={errors.price}>
                <Input type="number" min={0} value={draft.price || ''} onChange={(e) => set('price', Number(e.target.value))} />
              </Field>
              <Field label="Original price" hint="Optional. Shown struck through to highlight a discount." error={errors.originalPrice}>
                <Input type="number" min={0} value={draft.originalPrice ?? ''} onChange={(e) => set('originalPrice', e.target.value ? Number(e.target.value) : undefined)} />
              </Field>
            </div>
          </Card>

          <Card title="Departure dates" description="Customers can only book these dates.">
            <StringList label="Dates" type="date" items={draft.departures} onChange={(v) => set('departures', v)} addLabel="Add" />
          </Card>

          <Card title="Social proof">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating">
                <Input type="number" step="0.1" min={0} max={5} value={draft.rating} onChange={(e) => set('rating', Number(e.target.value))} />
              </Field>
              <Field label="Reviews">
                <Input type="number" min={0} value={draft.reviewCount} onChange={(e) => set('reviewCount', Number(e.target.value))} />
              </Field>
            </div>
          </Card>

          {trek && (
            <Card title="Danger zone">
              <Btn type="button" variant="secondary" className="w-full text-rose-600" onClick={del}>
                <Trash2 className="h-4 w-4" /> Delete trek
              </Btn>
            </Card>
          )}
        </div>
      </div>

      {/* Save bar */}
      <div className={cn('fixed inset-x-0 bottom-0 z-30 border-t border-pine-900/10 bg-white/95 backdrop-blur-xl transition-transform lg:left-64', dirty || !trek ? 'translate-y-0' : 'invisible translate-y-full')}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
          <span className="text-sm text-pine-800/60">{dirty ? 'You have unsaved changes' : 'Fill in the details to create this trek'}</span>
          <div className="flex gap-2">
            {dirty && trek && (
              <Btn type="button" variant="ghost" onClick={() => { setDraft(initial); setErrors({}); }}>
                Discard
              </Btn>
            )}
            {!trek && (
              <Btn type="button" variant="secondary" disabled={saving} onClick={() => save('draft')}>Save as draft</Btn>
            )}
            <Btn type="submit" disabled={saving} onClick={(e) => { if (!trek) { e.preventDefault(); save('published'); } }}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {trek ? 'Save changes' : 'Publish trek'}
            </Btn>
          </div>
        </div>
      </div>
    </form>
  );
}
