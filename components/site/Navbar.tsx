import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowRight, Menu, Search, User, X } from 'lucide-react';
import Logo from './Logo';
import SearchModal from './SearchModal';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/CMSContext';
import { cn, initials } from '@/lib/format';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/trips', label: 'Treks' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// Routes that open with a full-bleed dark hero, so the bar starts transparent.
const OVERLAY_ROUTES = ['/', '/trips', '/trips/[slug]', '/about', '/contact'];

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const settings = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const overlay = OVERLAY_ROUTES.includes(router.pathname) && !scrolled && !menuOpen;
  const isActive = (href: string) => (href === '/' ? router.pathname === '/' : router.pathname.startsWith(href));
  const ann = settings.announcement;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {ann.enabled && ann.text && (
          <div
            className={cn(
              'overflow-hidden bg-pine-950 text-center text-xs font-medium text-white/90 transition-all duration-500 ease-out-expo',
              scrolled ? 'max-h-0' : 'max-h-12'
            )}
          >
            <Link href={ann.link || '/trips'} className="container-x flex items-center justify-center gap-2 py-2.5 hover:text-white">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember-400" />
              <span className="truncate">{ann.text}</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </Link>
          </div>
        )}

        <nav
          className={cn(
            'transition-all duration-500 ease-out-expo',
            overlay ? 'bg-transparent' : 'border-b border-pine-900/5 bg-sand-50/85 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-xl'
          )}
        >
          <div className="container-x flex h-[72px] items-center justify-between gap-4">
            <Link href="/" aria-label={`${settings.siteName} home`} className="shrink-0">
              <Logo tone={overlay ? 'light' : 'dark'} />
            </Link>

            <div className={cn('hidden items-center gap-1 rounded-full p-1 md:flex', overlay ? 'bg-white/10 ring-1 ring-white/15 backdrop-blur-md' : 'bg-pine-900/[0.04]')}>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
                    isActive(item.href)
                      ? overlay
                        ? 'bg-white text-pine-950'
                        : 'bg-pine-900 text-white'
                      : overlay
                        ? 'text-white/85 hover:text-white'
                        : 'text-pine-900/70 hover:text-pine-950'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search treks"
                className={cn(
                  'flex h-10 items-center gap-2 rounded-full px-3 text-sm transition-colors',
                  overlay ? 'text-white hover:bg-white/10' : 'text-pine-900 hover:bg-pine-900/5'
                )}
              >
                <Search className="h-[18px] w-[18px]" />
                <kbd className={cn('hidden rounded-md px-1.5 py-0.5 font-sans text-[10px] font-semibold lg:inline', overlay ? 'bg-white/15' : 'bg-pine-900/5 text-pine-900/60')}>⌘K</kbd>
              </button>

              <Link
                href={user ? '/account' : '/login'}
                aria-label={user ? 'My account' : 'Sign in'}
                className={cn(
                  'hidden h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors sm:flex',
                  overlay ? 'text-white hover:bg-white/10' : 'text-pine-900 hover:bg-pine-900/5'
                )}
              >
                {user ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ember-500 text-[11px] font-bold text-pine-950">
                    {initials(`${user.firstName} ${user.lastName}`)}
                  </span>
                ) : (
                  <>
                    <User className="h-[18px] w-[18px]" />
                    <span className="hidden lg:inline">Sign in</span>
                  </>
                )}
              </Link>

              <Link
                href="/trips"
                className="hidden rounded-full bg-ember-500 px-5 py-2.5 text-sm font-semibold text-pine-950 transition-all hover:bg-ember-400 md:inline-flex"
              >
                Book a trek
              </Link>

              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full md:hidden',
                  overlay ? 'bg-white/10 text-white' : 'bg-pine-900 text-white'
                )}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'topo fixed inset-0 z-40 flex flex-col bg-pine-950 px-6 pb-10 pt-32 transition-all duration-500 ease-out-expo md:hidden',
          menuOpen ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <nav className="flex flex-col gap-1">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'font-display text-5xl font-bold tracking-tight transition-all duration-500 ease-out-expo',
                isActive(item.href) ? 'text-ember-400' : 'text-white',
                menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: menuOpen ? `${80 + i * 60}ms` : '0ms' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <Link href={user ? '/account' : '/login'} className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-3.5 font-semibold text-white">
            <User className="h-4 w-4" /> {user ? 'My account' : 'Sign in'}
          </Link>
          <Link href="/trips" className="flex items-center justify-center gap-2 rounded-full bg-ember-500 py-3.5 font-semibold text-pine-950">
            Book a trek <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
