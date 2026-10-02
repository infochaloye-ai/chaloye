import React, { useRef } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import { Btn, Card, Field, Input, PageHeader, Select, Textarea, Toggle, useConfirm } from '@/components/admin/ui';
import { FormGrid, SaveBar, useSingletonDraft } from '@/components/admin/useSingletonDraft';
import { useToast } from '@/components/admin/Toast';
import { downloadBlob } from '@/lib/csv';
import { todayISO } from '@/lib/format';
import type { CMSSnapshot, SiteSettings } from '@/lib/cms/types';

export default function SettingsAdmin() {
  const { data, replaceAll, reset } = useCMS();
  const { draft, setDraft, dirty, saving, save, discard } = useSingletonDraft('settings');
  const toast = useToast();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<SiteSettings>) => setDraft({ ...draft, ...patch });

  const exportJson = () => {
    downloadBlob(`chaloye-content-${todayISO()}.json`, new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    toast('Content exported');
  };

  const importJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as CMSSnapshot;
      if (!Array.isArray(parsed.treks) || !parsed.settings) throw new Error('Not a Chal Oye content export');
      if (!(await confirm({ title: 'Replace all content?', message: `This replaces everything with "${file.name}". Export a backup first if you're unsure.`, confirmLabel: 'Import', danger: true }))) return;
      await replaceAll(parsed);
      toast('Content imported');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Invalid file', 'error');
    }
  };

  const resetAll = async () => {
    if (!(await confirm({ title: 'Reset to demo content?', message: 'All treks, bookings, inquiries and page edits will be replaced with the original demo data. This cannot be undone.', confirmLabel: 'Reset everything', danger: true }))) return;
    await reset();
    toast('Demo content restored');
  };

  return (
    <div className="pb-24">
      <PageHeader title="Settings" description="Business details, contact info and site-wide options." />

      <div className="space-y-6">
        <Card title="Brand">
          <FormGrid>
            <Field label="Site name"><Input value={draft.siteName} onChange={(e) => set({ siteName: e.target.value })} /></Field>
            <Field label="Tagline"><Input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field>
            <Field label="Description" hint="Used in the footer and for search engines." className="sm:col-span-2"><Textarea rows={2} value={draft.description} onChange={(e) => set({ description: e.target.value })} /></Field>
            <Field label="Currency" hint="Applies to all prices on the site.">
              <Select value={draft.currency} onChange={(e) => set({ currency: e.target.value as SiteSettings['currency'] })}>
                <option value="INR">INR · Indian Rupee (₹)</option>
                <option value="USD">USD · US Dollar ($)</option>
                <option value="EUR">EUR · Euro (€)</option>
              </Select>
            </Field>
          </FormGrid>
        </Card>

        <Card title="Announcement bar" description="A thin banner at the very top of every page.">
          <div className="space-y-4">
            <Toggle label="Show announcement" checked={draft.announcement.enabled} onChange={(enabled) => set({ announcement: { ...draft.announcement, enabled } })} />
            <FormGrid>
              <Field label="Text"><Input value={draft.announcement.text} onChange={(e) => set({ announcement: { ...draft.announcement, text: e.target.value } })} /></Field>
              <Field label="Link" hint="e.g. /trips or /trips/kedarkantha-trek"><Input value={draft.announcement.link} onChange={(e) => set({ announcement: { ...draft.announcement, link: e.target.value } })} /></Field>
            </FormGrid>
          </div>
        </Card>

        <Card title="Contact details">
          <FormGrid>
            <Field label="Email"><Input type="email" value={draft.email} onChange={(e) => set({ email: e.target.value })} /></Field>
            <Field label="Phone"><Input value={draft.phone} onChange={(e) => set({ phone: e.target.value })} /></Field>
            <Field label="WhatsApp number" hint="Country code + number, digits only (e.g. 919876543210). Empty hides the chat button."><Input value={draft.whatsapp} onChange={(e) => set({ whatsapp: e.target.value.replace(/\D/g, '') })} /></Field>
            <Field label="Office hours"><Input value={draft.officeHours} onChange={(e) => set({ officeHours: e.target.value })} /></Field>
            <Field label="Address" className="sm:col-span-2"><Textarea rows={2} value={draft.address} onChange={(e) => set({ address: e.target.value })} /></Field>
          </FormGrid>
        </Card>

        <Card title="Social links" description="Leave empty to hide an icon.">
          <FormGrid>
            {(['instagram', 'youtube', 'facebook', 'twitter'] as const).map((k) => (
              <Field key={k} label={k === 'twitter' ? 'X / Twitter' : k[0].toUpperCase() + k.slice(1)}>
                <Input value={draft.socials[k]} placeholder="https://" onChange={(e) => set({ socials: { ...draft.socials, [k]: e.target.value } })} />
              </Field>
            ))}
          </FormGrid>
        </Card>

        <Card title="Data" description="Content is stored in this browser until the database is connected. Use export/import to move it between browsers.">
          <div className="flex flex-wrap gap-2">
            <Btn variant="secondary" onClick={exportJson}><Download className="h-4 w-4" /> Export JSON</Btn>
            <Btn variant="secondary" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Import JSON</Btn>
            <input ref={fileRef} type="file" accept="application/json" className="sr-only" onChange={importJson} />
            <Btn variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 sm:ml-auto" onClick={resetAll}><RotateCcw className="h-4 w-4" /> Reset demo data</Btn>
          </div>
        </Card>
      </div>

      <SaveBar dirty={dirty} saving={saving} onSave={save} onDiscard={discard} />
    </div>
  );
}
