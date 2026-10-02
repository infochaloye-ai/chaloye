import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/format';

type Toast = { id: number; type: 'success' | 'error'; message: string };

const ToastContext = createContext<(message: string, type?: Toast['type']) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const push = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => dismiss(id), 3500);
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex animate-pop-in items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg ring-1',
              t.type === 'success' ? 'bg-pine-900 text-white ring-pine-800' : 'bg-rose-600 text-white ring-rose-500'
            )}
          >
            {t.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-ember-400" /> : <AlertCircle className="h-4 w-4" />}
            {t.message}
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="ml-2 opacity-60 hover:opacity-100">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
