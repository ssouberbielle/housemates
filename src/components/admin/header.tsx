import type { Admin } from '@/types/database';
import { clsx } from 'clsx';

interface HeaderProps {
  admin: Admin;
}

export function Header({ admin }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-end border-b border-white/8 bg-ink px-6">
      <div className="flex items-center gap-3">
        <span
          className={clsx(
            'rounded px-2 py-0.5 text-[10px] tracking-widest uppercase',
            admin.role === 'owner'
              ? 'bg-ember/15 text-ember'
              : 'bg-white/8 text-bone/50'
          )}
        >
          {admin.role}
        </span>
        <span className="text-sm text-bone/70">{admin.name}</span>
      </div>
    </header>
  );
}
