import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAdapter } from '@/lib/cms/adapter';
import { supabase } from '@/lib/supabase';
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
  /** True once content has been re-read with the visitor's session (admin drafts, own bookings). */
  ready: boolean;
  refresh: () => Promise<void>;
  create: <K extends CollectionKey>(collection: K, item: NewItem<K>) => Promise<Collections[K]>;
  update: <K extends CollectionKey>(collection: K, id: string, patch: Partial<NewItem<K>>) => Promise<Collections[K]>;
  remove: (collection: CollectionKey, id: string) => Promise<void>;
  saveSingleton: <K extends SingletonKey>(key: K, value: Singletons[K]) => Promise<void>;
  replaceAll: (snapshot: CMSSnapshot) => Promise<void>;
}

const CMSContext = createContext<CMSContextValue | undefined>(undefined);

export function CMSProvider({ initialData, children }: { initialData: CMSSnapshot; children: React.ReactNode }) {
  // The server renders with public content (see _app getInitialProps); the client
  // re-reads once the Supabase session is known, since RLS may then reveal more.
  const [data, setData] = useState<CMSSnapshot>(initialData);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setData(await getAdapter().load());
    } catch (err) {
      console.error('Could not load content from Supabase', err);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
        // Deferred: Supabase must not be called from inside this callback.
        setTimeout(refresh, 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [refresh]);

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

  const value = useMemo(
    () => ({ data, ready, refresh, create, update, remove, saveSingleton, replaceAll }),
    [data, ready, refresh, create, update, remove, saveSingleton, replaceAll]
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
