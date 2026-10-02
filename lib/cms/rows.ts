import type { CMSSnapshot, CollectionKey, Collections, SingletonKey } from './types';

// Collection key → Supabase table. Columns are the snake_case form of each field.
export const TABLES: Record<CollectionKey, string> = {
  treks: 'treks',
  bookings: 'bookings',
  inquiries: 'inquiries',
  testimonials: 'testimonials',
  team: 'team_members',
  faqs: 'faqs',
  subscribers: 'newsletter_subscribers',
};

export const COLLECTION_KEYS = Object.keys(TABLES) as CollectionKey[];
export const SINGLETON_KEYS: SingletonKey[] = ['home', 'about', 'pages', 'settings'];

// Fields whose column name isn't plain snake_case (`order` is reserved in SQL).
const RENAMED: Record<string, string> = { order: 'sort_order' };
const RENAMED_BACK = Object.fromEntries(Object.entries(RENAMED).map(([k, v]) => [v, k]));

// Columns that exist in the database but not in the app's content model.
const HIDDEN = new Set(['user_id']);

const toSnake = (k: string) => RENAMED[k] ?? k.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (k: string) => RENAMED_BACK[k] ?? k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());

/** App object → row. `undefined` becomes `null` so clearing an optional field clears the column. */
export function toRow(item: Record<string, unknown>) {
  const row: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item)) row[toSnake(k)] = v === undefined ? null : v;
  return row;
}

/** Row → app object. `null` columns are dropped so optional fields read as `undefined`. */
export function fromRow<K extends CollectionKey>(row: Record<string, unknown>): Collections[K] {
  const item: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v !== null && !HIDDEN.has(k)) item[toCamel(k)] = v;
  }
  return item as unknown as Collections[K];
}

type RawSnapshot = Record<CollectionKey, Record<string, unknown>[]> & {
  singletons: Partial<Record<SingletonKey, unknown>>;
};

export function snapshotFromRpc(raw: RawSnapshot): CMSSnapshot {
  const missing = SINGLETON_KEYS.filter((k) => !raw.singletons[k]);
  if (missing.length) throw new Error(`Site content is missing (${missing.join(', ')}). Run the seed script.`);
  const snapshot = { ...raw.singletons } as Record<string, unknown>;
  for (const key of COLLECTION_KEYS) snapshot[key] = raw[key].map((r) => fromRow(r));
  return snapshot as CMSSnapshot;
}
