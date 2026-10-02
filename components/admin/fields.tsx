import React, { useState } from 'react';
import { ArrowDown, ArrowUp, ImageOff, Plus, Trash2, Upload } from 'lucide-react';
import { Btn, IconBtn, inputCls } from './ui';
import { useToast } from './Toast';
import { cn } from '@/lib/format';
import { supabase } from '@/lib/supabase';

export function FieldLabel({ label, hint, required }: { label: string; hint?: string; required?: boolean }) {
  return (
    <div className="mb-1.5">
      <div className="text-sm font-medium text-pine-900">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </div>
      {hint && <div className="text-xs text-pine-800/50">{hint}</div>}
    </div>
  );
}

// Uploads go to the public `media` bucket in Supabase Storage (admins only, see RLS).
const MAX_UPLOAD_MB = 5;

async function uploadImage(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw new Error(error.message);
  return supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  required,
  aspect = 'aspect-video',
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  aspect?: string;
}) {
  const toast = useToast();
  const [broken, setBroken] = useState(false);
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      toast(`Image is over ${MAX_UPLOAD_MB} MB. Compress it first, or paste a URL.`, 'error');
      return;
    }
    setBroken(false);
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      toast(err instanceof Error ? `Upload failed: ${err.message}` : 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <FieldLabel label={label} hint={hint ?? 'Paste an image URL or upload a file.'} required={required} />
      <div className="flex gap-3">
        <div className={cn('relative w-28 shrink-0 overflow-hidden rounded-lg bg-sand-100 ring-1 ring-pine-900/10', aspect)}>
          {value && !broken ? (
            <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" onError={() => setBroken(true)} onLoad={() => setBroken(false)} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-pine-800/30">
              <ImageOff className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            className={inputCls}
            placeholder="https://…"
            value={value}
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
          />
          <div className="flex gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-pine-900 ring-1 ring-pine-900/10 hover:bg-sand-50">
              <Upload className="h-3.5 w-3.5" /> {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*" className="sr-only" onChange={onFile} disabled={uploading} />
            </label>
            {value && (
              <button type="button" onClick={() => onChange('')} className="text-xs font-medium text-pine-800/50 hover:text-rose-600">
                Remove
              </button>
            )}
            {broken && <span className="text-xs font-medium text-rose-600">Image failed to load</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic repeater: add / remove / reorder rows of any shape. */
export function Repeater<T>({
  label,
  hint,
  items,
  onChange,
  newItem,
  renderItem,
  addLabel = 'Add item',
  itemLabel,
  max,
}: {
  label: string;
  hint?: string;
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  itemLabel?: (item: T, index: number) => string;
  max?: number;
}) {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [x] = next.splice(from, 1);
    next.splice(to, 0, x);
    onChange(next);
  };

  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-xl bg-sand-50 ring-1 ring-pine-900/10">
            <div className="flex items-center justify-between border-b border-pine-900/5 px-3 py-1.5">
              <span className="truncate text-xs font-semibold text-pine-800/60">{itemLabel ? itemLabel(item, i) : `#${i + 1}`}</span>
              <div className="flex shrink-0">
                <IconBtn type="button" label="Move up" disabled={i === 0} onClick={() => move(i, i - 1)}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn type="button" label="Move down" disabled={i === items.length - 1} onClick={() => move(i, i + 1)}><ArrowDown className="h-3.5 w-3.5" /></IconBtn>
                <IconBtn type="button" label="Remove" className="hover:bg-rose-50 hover:text-rose-600" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
              </div>
            </div>
            <div className="p-3">{renderItem(item, (patch) => onChange(items.map((x, j) => (j === i ? { ...x, ...patch } : x))), i)}</div>
          </div>
        ))}
      </div>
      {(!max || items.length < max) && (
        <Btn type="button" variant="secondary" size="sm" className="mt-2" onClick={() => onChange([...items, newItem()])}>
          <Plus className="h-3.5 w-3.5" /> {addLabel}
        </Btn>
      )}
    </div>
  );
}

/** Simple list of strings, one input per row. */
export function StringList({
  label,
  hint,
  items,
  onChange,
  placeholder,
  addLabel = 'Add',
  type = 'text',
}: {
  label: string;
  hint?: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  addLabel?: string;
  type?: 'text' | 'date';
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft('');
  };

  return (
    <div>
      <FieldLabel label={label} hint={hint} />
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="group flex items-center gap-1.5">
            <input type={type} className={cn(inputCls, 'py-2')} value={item} onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))} />
            <IconBtn type="button" label="Move up" disabled={i === 0} onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}><ArrowUp className="h-3.5 w-3.5" /></IconBtn>
            <IconBtn type="button" label="Remove" className="hover:bg-rose-50 hover:text-rose-600" onClick={() => onChange(items.filter((_, j) => j !== i))}><Trash2 className="h-3.5 w-3.5" /></IconBtn>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex gap-2">
        <input
          type={type}
          className={cn(inputCls, 'py-2')}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <Btn type="button" variant="secondary" onClick={add} disabled={!draft.trim()}>
          <Plus className="h-4 w-4" /> {addLabel}
        </Btn>
      </div>
    </div>
  );
}

/** Gallery of image URLs with thumbnails. */
export function GalleryField({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  const [draft, setDraft] = useState('');
  return (
    <div>
      <FieldLabel label={label} hint="First image is used as the cover in the gallery grid." />
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map((src, i) => (
          <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-sand-100 ring-1 ring-pine-900/10">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-pine-950/60 opacity-0 transition-opacity group-hover:opacity-100">
              <IconBtn type="button" label="Move left" disabled={i === 0} className="bg-white/90 text-pine-900 hover:bg-white" onClick={() => { const n = [...items]; [n[i - 1], n[i]] = [n[i], n[i - 1]]; onChange(n); }}>
                <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
              </IconBtn>
              <IconBtn type="button" label="Remove image" className="bg-white/90 text-rose-600 hover:bg-white" onClick={() => onChange(items.filter((_, j) => j !== i))}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className={cn(inputCls, 'py-2')} placeholder="Paste image URL and press Add" value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (draft.trim()) { onChange([...items, draft.trim()]); setDraft(''); } } }} />
        <Btn type="button" variant="secondary" disabled={!draft.trim()} onClick={() => { onChange([...items, draft.trim()]); setDraft(''); }}>
          <Plus className="h-4 w-4" /> Add
        </Btn>
      </div>
    </div>
  );
}
