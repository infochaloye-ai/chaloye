import { seed } from './seed';
import type {
  CMSSnapshot,
  CollectionKey,
  Collections,
  NewItem,
  SingletonKey,
  Singletons,
} from './types';
import { uid } from '../format';

/**
 * Storage contract for the CMS. The UI only ever talks to this interface, so moving to
 * Supabase means writing a `supabaseAdapter` with the same methods (one table per
 * collection, one `site_content` row per singleton) and swapping it in `getAdapter()`.
 */
export interface CMSAdapter {
  load(): Promise<CMSSnapshot>;
  create<K extends CollectionKey>(collection: K, data: NewItem<K>): Promise<Collections[K]>;
  update<K extends CollectionKey>(collection: K, id: string, patch: Partial<NewItem<K>>): Promise<Collections[K]>;
  remove(collection: CollectionKey, id: string): Promise<void>;
  saveSingleton<K extends SingletonKey>(key: K, value: Singletons[K]): Promise<Singletons[K]>;
  replaceAll(snapshot: CMSSnapshot): Promise<CMSSnapshot>;
  reset(): Promise<CMSSnapshot>;
}

export const STORAGE_KEY = 'chaloye-cms-v1';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

// Fills in keys added to the content model after a snapshot was saved, so old
// browser data never crashes newer code.
function withDefaults(stored: Partial<CMSSnapshot>): CMSSnapshot {
  const base = clone(seed);
  return {
    ...base,
    ...stored,
    home: { ...base.home, ...stored.home, hero: { ...base.home.hero, ...stored.home?.hero }, cta: { ...base.home.cta, ...stored.home?.cta } },
    about: { ...base.about, ...stored.about },
    settings: {
      ...base.settings,
      ...stored.settings,
      socials: { ...base.settings.socials, ...stored.settings?.socials },
      announcement: { ...base.settings.announcement, ...stored.settings?.announcement },
    },
  };
}

function createLocalAdapter(): CMSAdapter {
  const read = (): CMSSnapshot => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? withDefaults(JSON.parse(raw)) : clone(seed);
    } catch {
      return clone(seed);
    }
  };

  const write = (snapshot: CMSSnapshot) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (err) {
      throw new Error('Could not save. Browser storage may be full (try smaller images).');
    }
  };

  return {
    async load() {
      return read();
    },

    async create(collection, data) {
      const snap = read();
      const now = new Date().toISOString();
      const item = { ...data, id: uid(), createdAt: now, updatedAt: now } as Collections[typeof collection];
      (snap[collection] as Collections[typeof collection][]).unshift(item);
      write(snap);
      return item;
    },

    async update(collection, id, patch) {
      const snap = read();
      const list = snap[collection] as Collections[typeof collection][];
      const idx = list.findIndex((i) => i.id === id);
      if (idx === -1) throw new Error('Item not found. It may have been deleted.');
      const updated = { ...list[idx], ...patch, updatedAt: new Date().toISOString() };
      list[idx] = updated;
      write(snap);
      return updated;
    },

    async remove(collection, id) {
      const snap = read();
      (snap as Record<CollectionKey, { id: string }[]>)[collection] = snap[collection].filter((i) => i.id !== id);
      write(snap);
    },

    async saveSingleton(key, value) {
      const snap = read();
      snap[key] = value as CMSSnapshot[typeof key];
      write(snap);
      return value;
    },

    async replaceAll(snapshot) {
      const next = withDefaults(snapshot);
      write(next);
      return next;
    },

    async reset() {
      window.localStorage.removeItem(STORAGE_KEY);
      return clone(seed);
    },
  };
}

let adapter: CMSAdapter | null = null;

export function getAdapter(): CMSAdapter {
  if (!adapter) adapter = createLocalAdapter();
  return adapter;
}
