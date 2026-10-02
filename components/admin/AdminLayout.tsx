import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  CalendarCheck,
  ExternalLink,
  FileText,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LogOut,
  Mail,
  Map,
  Menu,
  MessageSquareQuote,
  Inbox,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { LogoMark } from '@/components/site/Logo';
import { useCMS } from '@/context/CMSContext';
import { adminSignOut, getAdmin, type AdminUser } from '@/lib/adminAuth';
import { cn } from '@/lib/format';
import { ConfirmProvider } from './ui';

type NavItem = { href: string; label: string; icon: React.ElementType; badge?: number };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data } = useCMS();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    let live = true;
    getAdmin().then((a) => {
      if (!live) return;
      setAdmin(a);
      if (!a) router.replace(`/admin/login?next=${encodeURIComponent(router.asPath)}`);
    });
    return () => {
      live = false;
    };
    // Only re-check when the admin area is entered, not on every in-admin navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setDrawer(false), [router.asPath]);

  const pendingBookings = data.bookings.filter((b) => b.status === 'pending').length;
  const newInquiries = data.inquiries.filter((i) => i.status === 'new').length;

  const groups: { title: string; items: NavItem[] }[] = [
    { title: 'Overview', items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }] },
    {
      title: 'Sales',
      items: [
        { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck, badge: pendingBookings },
        { href: '/admin/inquiries', label: 'Inquiries', icon: Inbox, badge: newInquiries },
        { href: '/admin/subscribers', label: 'Subscribers', icon: Mail },
      ],
    },
    {
      title: 'Content',
      items: [
        { href: '/admin/treks', label: 'Treks', icon: Map },
        { href: '/admin/homepage', label: 'Homepage', icon: Home },
        { href: '/admin/about', label: 'About page', icon: Info },
        { href: '/admin/pages', label: 'Other pages', icon: FileText },
        { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
        { href: '/admin/team', label: 'Team', icon: Users },
        { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      ],
    },
    { title: 'System', items: [{ href: '/admin/settings', label: 'Settings', icon: Settings }] },
  ];

  const isActive = (href: string) => (href === '/admin' ? router.pathname === '/admin' : router.pathname.startsWith(href));

  if (!admin) {
    return <div className="min-h-screen bg-sand-50" />;
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10"><LogoMark tone="light" className="h-5 w-auto" /></span>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-bold text-white">{data.settings.siteName}</div>
          <div className="text-[11px] text-white/50">Content studio</div>
        </div>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-white/35">{g.title}</div>
            <div className="space-y-0.5">
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href) ? 'bg-white text-pine-950' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <item.icon className={cn('h-4 w-4', isActive(item.href) ? 'text-ember-600' : '')} />
                  <span className="flex-1">{item.label}</span>
                  {!!item.badge && (
                    <span className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-bold', isActive(item.href) ? 'bg-ember-500 text-pine-950' : 'bg-ember-500/90 text-pine-950')}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ember-500 text-xs font-bold text-pine-950">CO</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">Admin</div>
            <div className="truncate text-xs text-white/50">{admin.email}</div>
          </div>
          <button
            onClick={async () => {
              await adminSignOut();
              router.push('/admin/login');
            }}
            aria-label="Sign out"
            title="Sign out"
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <ConfirmProvider>
      <Head>
        <title>{`Admin · ${data.settings.siteName}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="min-h-screen bg-sand-50">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 bg-pine-950 lg:block">{sidebar}</aside>

        {/* Mobile drawer */}
        <div className={cn('fixed inset-0 z-50 lg:hidden', drawer ? 'visible' : 'invisible')}>
          <div className={cn('absolute inset-0 bg-pine-950/50 transition-opacity', drawer ? 'opacity-100' : 'opacity-0')} onClick={() => setDrawer(false)} />
          <aside className={cn('absolute inset-y-0 left-0 w-72 bg-pine-950 transition-transform duration-300 ease-out-expo', drawer ? 'translate-x-0' : '-translate-x-full')}>
            <button onClick={() => setDrawer(false)} aria-label="Close menu" className="absolute right-3 top-4 rounded-lg p-2 text-white/60 hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
            {sidebar}
          </aside>
        </div>

        <div className="lg:pl-64">
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-pine-900/5 bg-sand-50/85 px-4 backdrop-blur-xl sm:px-8">
            <button onClick={() => setDrawer(true)} aria-label="Open menu" className="rounded-lg p-2 text-pine-900 hover:bg-pine-900/5 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" target="_blank" className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-pine-900 ring-1 ring-pine-900/10 hover:bg-white">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</main>
        </div>
      </div>
    </ConfirmProvider>
  );
}
