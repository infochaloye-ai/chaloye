import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAdapter, STORAGE_KEY } from '@/lib/cms/adapter';
import { seed } from '@/lib/cms/seed';
import type {
  CMSSnapshot,
  CollectionKey,
  Collections,
  NewItem,
  SingletonKey,
  Singletons,
} from '@/lib/cms/types';

interface CMSContextValue {
  data: CMSSnapshot;
  /** True once browser-stored content has been loaded (always false during SSR). */
  ready: boolean;
  create: <K extends CollectionKey>(collection: K, item: NewItem<K>) => Promise<Collections[K]>;
  update: <K extends CollectionKey>(collection: K, id: string, patch: Partial<NewItem<K>>) => Promise<Collections[K]>;
  remove: (collection: CollectionKey, id: string) => Promise<void>;
  saveSingleton: <K extends SingletonKey>(key: K, value: Singletons[K]) => Promise<void>;
  replaceAll: (snapshot: CMSSnapshot) => Promise<void>;
  reset: () => Promise<void>;
}

const CMSContext = createContext<CMSContextValue | undefined>(undefined);

export function CMSProvider({ children }: { children: React.ReactNode }) {
  // Server render and first client render use the seed so markup matches; stored edits load right after.
  const [data, setData] = useState<CMSSnapshot>(seed);
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    setData(await getAdapter().load());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
    // Keep other open tabs (e.g. the public site while editing in /admin) in sync.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) reload();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [reload]);

  const create = useCallback<CMSContextValue['create']>(async (collection, item) => {
    const created = await getAdapter().create(collection, item);
    setData((prev) => ({ ...prev, [collection]: [created, ...prev[collection]] }));
    return created;
  }, []);

  const update = useCallback<CMSContextValue['update']>(async (collection, id, patch) => {
    const updated = await getAdapter().update(collection, id, patch);
    setData((prev) => ({
      ...prev,
      [collection]: (prev[collection] as { id: string }[]).map((i) => (i.id === id ? updated : i)),
    }));
    return updated;
  }, []);

  const remove = useCallback<CMSContextValue['remove']>(async (collection, id) => {
    await getAdapter().remove(collection, id);
    setData((prev) => ({ ...prev, [collection]: (prev[collection] as { id: string }[]).filter((i) => i.id !== id) }));
  }, []);

  const saveSingleton = useCallback<CMSContextValue['saveSingleton']>(async (key, value) => {
    await getAdapter().saveSingleton(key, value);
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const replaceAll = useCallback(async (snapshot: CMSSnapshot) => {
    setData(await getAdapter().replaceAll(snapshot));
  }, []);

  const reset = useCallback(async () => {
    setData(await getAdapter().reset());
  }, []);

  const value = useMemo(
    () => ({ data, ready, create, update, remove, saveSingleton, replaceAll, reset }),
    [data, ready, create, update, remove, saveSingleton, replaceAll, reset]
  );

  return <CMSContext.Provider value={value}>{children}</CMSContext.Provider>;
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error('useCMS must be used within a CMSProvider');
  return ctx;
}

// ---- Public-site selectors ----

export function usePublishedTreks() {
  const { data } = useCMS();
  return useMemo(() => data.treks.filter((t) => t.status === 'published'), [data.treks]);
}

export function useSettings() {
  return useCMS().data.settings;
}
