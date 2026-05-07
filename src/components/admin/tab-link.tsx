'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

export function TabLinkClient({
  href,
  label,
  exact,
}: {
  href: string
  label: string
  exact?: boolean
}) {
  const pathname = usePathname()
  const isActive = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={clsx(
        'px-4 py-2.5 text-xs tracking-widest uppercase border-b-2 -mb-px transition-colors',
        isActive
          ? 'border-bone text-bone'
          : 'border-transparent text-bone/40 hover:text-bone/70'
      )}
    >
      {label}
    </Link>
  )
}
