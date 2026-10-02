import React from 'react';
import type { FeatureItem, StatItem } from '@/lib/cms/types';
import { getIcon, ICON_OPTIONS } from '@/lib/icons';
import { cn } from '@/lib/format';
import { Repeater } from './fields';
import { Input, Textarea } from './ui';

export function FeatureListField({ label, items, onChange, max }: { label: string; items: FeatureItem[]; onChange: (v: FeatureItem[]) => void; max?: number }) {
  return (
    <Repeater
      label={label}
      items={items}
      onChange={onChange}
      max={max}
      addLabel="Add item"
      newItem={() => ({ icon: 'compass', title: '', description: '' })}
      itemLabel={(f, i) => f.title || `Item ${i + 1}`}
      renderItem={(f, upd) => (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1" role="radiogroup" aria-label="Icon">
            {ICON_OPTIONS.map((name) => {
              const Icon = getIcon(name);
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={f.icon === name}
                  aria-label={name}
                  title={name}
                  onClick={() => upd({ icon: name })}
                  className={cn('flex h-8 w-8 items-center justify-center rounded-md transition-colors', f.icon === name ? 'bg-pine-900 text-white' : 'bg-white text-pine-800/60 ring-1 ring-pine-900/10 hover:text-pine-950')}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          <Input placeholder="Title" value={f.title} onChange={(e) => upd({ title: e.target.value })} />
          <Textarea className="min-h-[60px]" rows={2} placeholder="Description" value={f.description} onChange={(e) => upd({ description: e.target.value })} />
        </div>
      )}
    />
  );
}

export function StatListField({ label, items, onChange }: { label: string; items: StatItem[]; onChange: (v: StatItem[]) => void }) {
  return (
    <Repeater
      label={label}
      items={items}
      onChange={onChange}
      max={4}
      addLabel="Add stat"
      newItem={() => ({ value: '', label: '' })}
      itemLabel={(s, i) => (s.value ? `${s.value} · ${s.label}` : `Stat ${i + 1}`)}
      renderItem={(s, upd) => (
        <div className="grid grid-cols-[1fr_2fr] gap-2">
          <Input placeholder="18,000+" value={s.value} onChange={(e) => upd({ value: e.target.value })} />
          <Input placeholder="Happy trekkers" value={s.label} onChange={(e) => upd({ label: e.target.value })} />
        </div>
      )}
    />
  );
}
