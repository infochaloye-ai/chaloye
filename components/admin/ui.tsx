import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Search, X } from 'lucide-react';
import { cn } from '@/lib/format';

// ───────── Buttons ─────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
const btnVariants: Record<BtnVariant, string> = {
  primary: 'bg-pine-900 text-white hover:bg-pine-800 shadow-sm',
  secondary: 'bg-white text-pine-900 ring-1 ring-pine-900/10 hover:bg-sand-50 shadow-sm',
  ghost: 'text-pine-800/70 hover:bg-pine-900/5 hover:text-pine-950',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm',
};

export function Btn({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: 'sm' | 'md' }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-2.5 text-sm',
        btnVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function IconBtn({ label, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn('inline-flex h-8 w-8 items-center justify-center rounded-lg text-pine-800/60 transition-colors hover:bg-pine-900/5 hover:text-pine-950 disabled:opacity-30', className)}
      {...props}
    />
  );
}

// ───────── Layout ─────────

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-pine-950">{title}</h1>
        {description && <p className="mt-1 text-sm text-pine-800/60">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ title, description, actions, className, children }: { title?: string; description?: string; actions?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={cn('rounded-2xl bg-white shadow-sm ring-1 ring-pine-900/5', className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 border-b border-pine-900/5 px-6 py-4">
          <div>
            {title && <h2 className="font-semibold text-pine-950">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-pine-800/55">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: React.ElementType; title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-pine-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 font-semibold text-pine-950">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-pine-800/60">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ───────── Form controls ─────────

export const inputCls =
  'w-full rounded-lg bg-white px-3 py-2.5 text-sm text-pine-950 ring-1 ring-pine-900/15 outline-none transition placeholder:text-pine-800/35 focus:ring-2 focus:ring-ember-500 disabled:bg-sand-50';

export function Field({ label, hint, error, required, className, children }: { label: string; hint?: string; error?: string; required?: boolean; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-sm font-medium text-pine-900">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span> : hint ? <span className="mt-1 block text-xs text-pine-800/50">{hint}</span> : null}
    </label>
  );
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputCls, className)} {...p} />;
});

export function Textarea({ className, ...p }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputCls, 'min-h-[90px] resize-y leading-relaxed', className)} {...p} />;
}

export function Select({ className, children, ...p }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(inputCls, 'pr-8', className)} {...p}>
      {children}
    </select>
  );
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label?: string; description?: string }) {
  const btn = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn('relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors', checked ? 'bg-pine-700' : 'bg-pine-900/15')}
    >
      <span className={cn('inline-block h-5 w-5 rounded-full bg-white shadow transition-transform', checked ? 'translate-x-[22px]' : 'translate-x-0.5')} />
    </button>
  );
  if (!label) return btn;
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-pine-900">{label}</div>
        {description && <div className="text-xs text-pine-800/55">{description}</div>}
      </div>
      {btn}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pine-800/40" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cn(inputCls, 'pl-9')} />
    </div>
  );
}

// ───────── Badges ─────────

const tones = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  red: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  blue: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  gray: 'bg-pine-900/5 text-pine-800 ring-pine-900/10',
  orange: 'bg-ember-50 text-ember-700 ring-ember-600/20',
};
export type Tone = keyof typeof tones;

export function Badge({ tone = 'gray', children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset', tones[tone], className)}>{children}</span>;
}

/** A <select> styled as a status badge, for inline status changes in tables. */
export function StatusSelect<T extends string>({ value, options, tone, onChange }: { value: T; options: T[]; tone: Record<T, Tone>; onChange: (v: T) => void }) {
  return (
    <select
      value={value}
      aria-label="Change status"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => onChange(e.target.value as T)}
      className={cn('cursor-pointer rounded-md py-0.5 pl-2 pr-6 text-xs font-medium capitalize ring-1 ring-inset outline-none', tones[tone[value]])}
    >
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

// ───────── Modal ─────────

export function Modal({ open, onClose, title, children, footer, size = 'md' }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-pine-950/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={cn('relative flex max-h-[92vh] w-full animate-pop-in flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl', { sm: 'sm:max-w-md', md: 'sm:max-w-xl', lg: 'sm:max-w-3xl' }[size])}>
        <header className="flex items-center justify-between border-b border-pine-900/5 px-6 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <IconBtn label="Close" onClick={onClose}><X className="h-4 w-4" /></IconBtn>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-pine-900/5 bg-sand-50 px-6 py-4 sm:rounded-b-2xl">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
}

// ───────── Confirm dialog (promise-based) ─────────

type ConfirmOpts = { title: string; message?: string; confirmLabel?: string; danger?: boolean };
const ConfirmContext = createContext<(o: ConfirmOpts) => Promise<boolean>>(async () => false);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [opts, setOpts] = useState<ConfirmOpts | null>(null);
  const resolver = useRef<(v: boolean) => void>(undefined);

  const confirm = useCallback((o: ConfirmOpts) => {
    setOpts(o);
    return new Promise<boolean>((res) => (resolver.current = res));
  }, []);

  const close = (v: boolean) => {
    resolver.current?.(v);
    setOpts(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Modal
        open={!!opts}
        onClose={() => close(false)}
        title={opts?.title ?? ''}
        size="sm"
        footer={
          <>
            <Btn variant="secondary" onClick={() => close(false)}>Cancel</Btn>
            <Btn variant={opts?.danger ? 'danger' : 'primary'} onClick={() => close(true)} autoFocus>
              {opts?.confirmLabel ?? 'Confirm'}
            </Btn>
          </>
        }
      >
        <div className="flex gap-4">
          {opts?.danger && (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <p className="text-sm leading-relaxed text-pine-800/75">{opts?.message}</p>
        </div>
      </Modal>
    </ConfirmContext.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmContext);

// ───────── Table ─────────

export function Table({ head, children }: { head: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-pine-900/5 bg-sand-50 text-xs font-medium uppercase tracking-wide text-pine-800/55">
          <tr>{head}</tr>
        </thead>
        <tbody className="divide-y divide-pine-900/5">{children}</tbody>
      </table>
    </div>
  );
}

export const Th = ({ children, className }: { children?: React.ReactNode; className?: string }) => <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>;
export const Td = ({ children, className }: { children?: React.ReactNode; className?: string }) => <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>;
