import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Faq } from '@/lib/cms/types';
import { cn } from '@/lib/format';

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <div className="divide-y divide-pine-900/10 border-y border-pine-900/10">
      {faqs.map((f) => {
        const isOpen = open === f.id;
        return (
          <div key={f.id}>
            <button
              onClick={() => setOpen(isOpen ? null : f.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="font-display text-lg font-semibold text-pine-950 sm:text-xl">{f.question}</span>
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-out-expo',
                  isOpen ? 'rotate-45 bg-ember-500 text-pine-950' : 'bg-pine-900/5 text-pine-900'
                )}
              >
                <Plus className="h-4 w-4" />
              </span>
            </button>
            <div className={cn('grid transition-all duration-500 ease-out-expo', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 leading-relaxed text-pine-800/70">{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
