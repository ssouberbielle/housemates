'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Settings,
  ScrollText,
  UserCog,
  LogOut,
} from 'lucide-react';
import { logoutAction } from '@/app/admin/login/actions';
import { clsx } from 'clsx';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/events', label: 'Eventos', icon: CalendarDays },
  { href: '/admin/whitelist', label: 'Whitelist', icon: Users },
  { href: '/admin/admins', label: 'Admins', icon: UserCog },
  { href: '/admin/config', label: 'Config', icon: Settings },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

export function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <aside className="flex h-screen w-56 flex-col border-r border-white/8 bg-ink">
      {/* Brand */}
      <div className="px-6 py-6">
        <p className="font-display text-lg font-light tracking-widest text-bone">
          HOUSE MATES
        </p>
        <p className="mt-0.5 text-[10px] tracking-widest text-bone/30 uppercase">
          Admin
        </p>
      </div>

      <div className="mx-4 h-px bg-white/8" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors',
              isActive(href, exact)
                ? 'bg-white/8 text-bone'
                : 'text-bone/45 hover:bg-white/5 hover:text-bone/80'
            )}
          >
            <Icon size={15} strokeWidth={1.5} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-5">
        <div className="mx-1 mb-3 h-px bg-white/8" />
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-sm text-bone/35 transition-colors hover:bg-white/5 hover:text-bone/60"
          >
            <LogOut size={15} strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
