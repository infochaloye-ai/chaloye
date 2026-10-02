import React, { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import type { SingletonKey, Singletons } from '@/lib/cms/types';
import { cn } from '@/lib/format';
import { Btn } from './ui';
import { useToast } from './Toast';
import { useUnsavedGuard } from './useUnsavedGuard';

/** Local editable copy of a singleton (homepage, about, settings) with save/discard. */
export function useSingletonDraft<K extends SingletonKey>(key: K) {
  const { data, ready, saveSingleton } = useCMS();
  const toast = useToast();
  const saved = data[key];
  const [draft, setDraft] = useState<Singletons[K]>(saved);
  const [saving, setSaving] = useState(false);

  // Pick up stored content once it loads (and after a reset/import elsewhere).
  useEffect(() => {
    setDraft(saved);
  }, [saved, ready]);

  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useUnsavedGuard(dirty && !saving);

  const save = async () => {
    setSaving(true);
    try {
      await saveSingleton(key, draft);
      toast('Changes published');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const discard = () => setDraft(saved);

  return { draft, setDraft, dirty, saving, save, discard };
}

export function SaveBar({ dirty, saving, onSave, onDiscard }: { dirty: boolean; saving: boolean; onSave: () => void; onDiscard: () => void }) {
  return (
    <div className={cn('fixed inset-x-0 bottom-0 z-30 border-t border-pine-900/10 bg-white/95 backdrop-blur-xl transition-transform duration-300 lg:left-64', dirty ? 'translate-y-0' : 'invisible translate-y-full')}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <span className="text-sm text-pine-800/60">You have unsaved changes</span>
        <div className="flex gap-2">
          <Btn type="button" variant="ghost" onClick={onDiscard}>Discard</Btn>
          <Btn type="button" disabled={saving} onClick={onSave}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Publish changes
          </Btn>
        </div>
      </div>
    </div>
  );
}

export function FormGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('grid gap-4 sm:grid-cols-2', className)}>{children}</div>;
}
