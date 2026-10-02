import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

// Warns before leaving a form with unsaved changes (tab close and in-app navigation).
// Returns a ref; set `.current = true` right before navigating away after a successful save,
// since the "not dirty" re-render may not have committed yet.
export function useUnsavedGuard(dirty: boolean) {
  const router = useRouter();
  const bypass = useRef(false);

  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    const onRouteChange = (url: string) => {
      if (bypass.current || url === router.asPath) return;
      if (!window.confirm('You have unsaved changes. Leave without saving?')) {
        router.events.emit('routeChangeError');
        // Aborting a Next.js route change requires throwing.
        throw 'Route change aborted: unsaved changes';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    router.events.on('routeChangeStart', onRouteChange);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      router.events.off('routeChangeStart', onRouteChange);
    };
  }, [dirty, router]);

  return bypass;
}
