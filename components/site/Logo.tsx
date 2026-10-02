import React from 'react';
import { cn } from '@/lib/format';

// Vector redraw of /public/Chaloye.in.png so the mark stays crisp and works on dark backgrounds.
export function LogoMark({ className, tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  const stroke = tone === 'dark' ? '#1b3127' : '#ffffff';
  const id = React.useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true" fill="none">
      <defs>
        <mask id={`m${id}`}>
          <rect width="64" height="48" fill="white" />
          <path d="M3 45 L19 27 L24 32 L35 12 L46 27 L50.5 23 L61 45" stroke="black" strokeWidth="9" strokeLinejoin="round" strokeLinecap="round" />
        </mask>
      </defs>
      <circle cx="47.5" cy="14" r="9.5" fill="#e8892f" mask={`url(#m${id})`} />
      <path d="M3 45 L19 27 L24 32 L35 12 L46 27 L50.5 23 L61 45" stroke={stroke} strokeWidth="3.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M28 45 C37 41 40 37.5 33.5 35.5 C27 33.5 29 29.5 38 27.5" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({
  className,
  tone = 'dark',
  showTagline = false,
}: {
  className?: string;
  tone?: 'dark' | 'light';
  showTagline?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark tone={tone} className="h-9 w-auto shrink-0" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[1.45rem] font-extrabold tracking-tight', tone === 'dark' ? 'text-pine-900' : 'text-white')}>
          chaloye<span className="text-ember-500">.in</span>
        </span>
        {showTagline && (
          <span className={cn('mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.32em]', tone === 'dark' ? 'text-pine-700' : 'text-white/70')}>
            Trek · Travel · Explore
          </span>
        )}
      </span>
    </span>
  );
}
