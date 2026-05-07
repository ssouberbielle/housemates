import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getAdminUser } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { TabLinkClient } from '@/components/admin/tab-link'

export default async function EventLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')

  const db = createAdminClient()
  const { data: event } = await db
    .from('events')
    .select('id, title, status')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  const tabs = [
    { href: `/admin/events/${params.id}`, label: 'Overview', exact: true },
    { href: `/admin/events/${params.id}/tickets`, label: 'Tickets' },
    { href: `/admin/events/${params.id}/invitations`, label: 'Invitaciones' },
    { href: `/admin/events/${params.id}/scan`, label: 'Scanner' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/events"
          className="text-xs text-bone/30 hover:text-bone/60 tracking-widest uppercase"
        >
          ← Eventos
        </Link>
        <h1 className="mt-2 font-display text-2xl font-light text-bone">{event.title}</h1>
      </div>

      <nav className="flex gap-1 border-b border-white/8">
        {tabs.map((tab) => (
          <TabLinkClient key={tab.href} href={tab.href} label={tab.label} exact={tab.exact} />
        ))}
      </nav>

      {children}
    </div>
  )
}
