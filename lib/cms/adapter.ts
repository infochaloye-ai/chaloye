import { supabase } from '../supabase';
import { COLLECTION_KEYS, fromRow, SINGLETON_KEYS, snapshotFromRpc, TABLES, toRow } from './rows';
import type {
  CMSSnapshot,
  CollectionKey,
  Collections,
  NewItem,
  SingletonKey,
  Singletons,
} from './types';

/**
 * Storage contract for the CMS. The UI only ever talks to this interface; the
 * implementation below stores everything in Supabase (one table per collection,
 * one `site_content` row per singleton) and relies on RLS for access control.
 */
export interface CMSAdapter {
  load(): Promise<CMSSnapshot>;
  create<K extends CollectionKey>(collection: K, data: NewItem<K>): Promise<Collections[K]>;
  update<K extends CollectionKey>(collection: K, id: string, patch: Partial<NewItem<K>>): Promise<Collections[K]>;
  remove(collection: CollectionKey, id: string): Promise<void>;
  saveSingleton<K extends SingletonKey>(key: K, value: Singletons[K]): Promise<Singletons[K]>;
  replaceAll(snapshot: CMSSnapshot): Promise<CMSSnapshot>;
}

function check<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(error.message);
  return data;
}

// Callers sometimes pass a whole item back; the database owns these columns.
function withoutMeta(item: object) {
  const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = item as Record<string, unknown>;
  return rest;
}

const supabaseAdapter: CMSAdapter = {
  async load() {
    return snapshotFromRpc(check(await supabase.rpc('cms_snapshot')));
  },

  async create(collection, data) {
    // The id is made here, and the row isn't read back, because visitors may
    // insert bookings and inquiries but not select them.
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    check(await supabase.from(TABLES[collection]).insert({ ...toRow(withoutMeta(data)), id }));
    return { ...data, id, createdAt: now, updatedAt: now } as Collections[typeof collection];
  },

  async update(collection, id, patch) {
    const row = check(
      await supabase.from(TABLES[collection]).update(toRow(withoutMeta(patch))).eq('id', id).select().maybeSingle()
    );
    if (!row) throw new Error('Item not found. It may have been deleted, or you no longer have access.');
    return fromRow(row);
  },

  async remove(collection, id) {
    check(await supabase.from(TABLES[collection]).delete().eq('id', id));
  },

  async saveSingleton(key, value) {
    check(await supabase.from('site_content').upsert({ key, value }));
    return value;
  },

  async replaceAll(snapshot) {
    for (const key of COLLECTION_KEYS) {
      check(await supabase.from(TABLES[key]).delete().not('id', 'is', null));
      const rows = (snapshot[key] ?? []).map((item) => toRow(item as unknown as Record<string, unknown>));
      if (rows.length) check(await supabase.from(TABLES[key]).insert(rows));
    }
    const singletons = SINGLETON_KEYS.filter((k) => snapshot[k]).map((key) => ({ key, value: snapshot[key] }));
    if (singletons.length) check(await supabase.from('site_content').upsert(singletons));
    return this.load();
  },
};

export function getAdapter(): CMSAdapter {
  return supabaseAdapter;
}
