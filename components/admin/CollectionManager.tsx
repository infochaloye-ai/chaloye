import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import { useCMS } from '@/context/CMSContext';
import type { Collections, NewItem } from '@/lib/cms/types';
import { cn } from '@/lib/format';
import { Btn, Card, EmptyState, Field, IconBtn, Input, Modal, PageHeader, SearchInput, Select, Table, Td, Textarea, Th, Toggle, useConfirm } from './ui';
import { ImageField } from './fields';
import { useToast } from './Toast';

type SimpleKey = 'testimonials' | 'team' | 'faqs';
type Item<K extends SimpleKey> = Collections[K];
type Values = Record<string, unknown>;

export type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'image' | 'toggle' | 'select' | 'rating';
  required?: boolean;
  hint?: string;
  options?: string[];
  full?: boolean;
};

export type Column<K extends SimpleKey> = {
  label: string;
  className?: string;
  render: (item: Item<K>) => React.ReactNode;
};

function FormField({ def, value, onChange }: { def: FieldDef; value: unknown; onChange: (v: unknown) => void }) {
  switch (def.type) {
    case 'image':
      return <ImageField label={def.label} hint={def.hint} value={(value as string) ?? ''} onChange={onChange} aspect="aspect-square" />;
    case 'toggle':
      return <Toggle label={def.label} description={def.hint} checked={!!value} onChange={onChange} />;
    case 'rating':
      return (
        <Field label={def.label}>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`} className="p-0.5">
                <Star className={cn('h-6 w-6', n <= Number(value) ? 'fill-ember-500 text-ember-500' : 'text-pine-900/20')} />
              </button>
            ))}
          </div>
        </Field>
      );
    case 'textarea':
      return (
        <Field label={def.label} required={def.required} hint={def.hint}>
          <Textarea required={def.required} rows={4} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
    case 'select':
      return (
        <Field label={def.label} required={def.required} hint={def.hint}>
          <Select value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)}>
            {def.options?.map((o) => <option key={o}>{o}</option>)}
          </Select>
        </Field>
      );
    case 'number':
      return (
        <Field label={def.label} required={def.required} hint={def.hint}>
          <Input type="number" required={def.required} value={(value as number) ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
        </Field>
      );
    default:
      return (
        <Field label={def.label} required={def.required} hint={def.hint}>
          <Input required={def.required} value={(value as string) ?? ''} onChange={(e) => onChange(e.target.value)} />
        </Field>
      );
  }
}

export default function CollectionManager<K extends SimpleKey>({
  collection,
  title,
  description,
  singular,
  icon,
  fields,
  columns,
  newItem,
  searchText,
  sort,
  publishKey,
}: {
  collection: K;
  title: string;
  description: string;
  singular: string;
  icon: React.ElementType;
  fields: FieldDef[];
  columns: Column<K>[];
  newItem: () => NewItem<K>;
  searchText: (item: Item<K>) => string;
  sort?: (a: Item<K>, b: Item<K>) => number;
  /** Boolean field toggled inline from the table, e.g. "published". */
  publishKey?: string;
}) {
  const { data, create, update, remove } = useCMS();
  const toast = useToast();
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState<{ id?: string; values: Values } | null>(null);
  const [saving, setSaving] = useState(false);

  const items = data[collection] as Item<K>[];
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = items.filter((i) => !s || searchText(i).toLowerCase().includes(s));
    return sort ? [...list].sort(sort) : list;
  }, [items, q, searchText, sort]);

  const openEdit = (item?: Item<K>) => {
    if (item) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, updatedAt, ...values } = item as Item<K> & Values;
      setEditing({ id, values });
    } else {
      setEditing({ values: newItem() as Values });
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) await update(collection, editing.id, editing.values as Partial<NewItem<K>>);
      else await create(collection, editing.values as NewItem<K>);
      toast(editing.id ? `${singular} updated` : `${singular} added`);
      setEditing(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Could not save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const del = async (item: Item<K>) => {
    if (!(await confirm({ title: `Delete ${singular.toLowerCase()}?`, message: 'This cannot be undone.', confirmLabel: 'Delete', danger: true }))) return;
    await remove(collection, item.id);
    toast(`${singular} deleted`);
  };

  return (
    <>
      <PageHeader title={title} description={description} actions={<Btn onClick={() => openEdit()}><Plus className="h-4 w-4" /> Add {singular.toLowerCase()}</Btn>} />

      <Card className="overflow-hidden">
        <div className="-m-6">
          <div className="border-b border-pine-900/5 p-4">
            <SearchInput value={q} onChange={setQ} placeholder={`Search ${title.toLowerCase()}…`} />
          </div>
          {rows.length === 0 ? (
            <EmptyState icon={icon} title={items.length ? 'Nothing matches your search' : `No ${title.toLowerCase()} yet`} action={!items.length && <Btn onClick={() => openEdit()}><Plus className="h-4 w-4" /> Add {singular.toLowerCase()}</Btn>} />
          ) : (
            <Table head={<>{columns.map((c) => <Th key={c.label} className={c.className}>{c.label}</Th>)}{publishKey && <Th>Visible</Th>}<Th className="text-right">Actions</Th></>}>
              {rows.map((item) => (
                <tr key={item.id} className="hover:bg-sand-50">
                  {columns.map((c) => <Td key={c.label} className={c.className}>{c.render(item)}</Td>)}
                  {publishKey && (
                    <Td>
                      <Toggle
                        checked={!!(item as unknown as Values)[publishKey]}
                        onChange={async (v) => {
                          await update(collection, item.id, { [publishKey]: v } as Partial<NewItem<K>>);
                          toast(v ? 'Now visible on site' : 'Hidden from site');
                        }}
                      />
                    </Td>
                  )}
                  <Td>
                    <div className="flex justify-end gap-0.5">
                      <IconBtn label="Edit" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></IconBtn>
                      <IconBtn label="Delete" className="hover:bg-rose-50 hover:text-rose-600" onClick={() => del(item)}><Trash2 className="h-4 w-4" /></IconBtn>
                    </div>
                  </Td>
                </tr>
              ))}
            </Table>
          )}
        </div>
      </Card>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
        footer={
          <>
            <Btn type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Btn>
            <Btn type="submit" form="collection-form" disabled={saving}>{editing?.id ? 'Save changes' : `Add ${singular.toLowerCase()}`}</Btn>
          </>
        }
      >
        {editing && (
          <form id="collection-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            {fields.map((def) => (
              <div key={def.key} className={def.full || def.type === 'textarea' || def.type === 'image' || def.type === 'toggle' ? 'sm:col-span-2' : ''}>
                <FormField def={def} value={editing.values[def.key]} onChange={(v) => setEditing((e) => (e ? { ...e, values: { ...e.values, [def.key]: v } } : e))} />
              </div>
            ))}
          </form>
        )}
      </Modal>
    </>
  );
}
