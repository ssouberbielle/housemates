import { notFound } from 'next/navigation'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default async function EventOverviewPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const db = createAdminClient()

  const { data: event } = await db
    .from('events')
    .select('*, ticket_tiers(*)')
    .eq('id', params.id)
    .single()

  if (!event) notFound()

  const { count: ticketCount } = await db
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', params.id)
    .eq('status', 'paid')

  return (
    <div className="max-w-3xl space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Tickets vendidos"
          value={ticketCount ?? 0}
          sub={`de ${event.capacity} lugares`}
        />
        <StatCard
          label="Fecha"
          value={format(new Date(event.date_start), "d MMM yyyy", { locale: es })}
          sub={event.location_name ?? '—'}
        />
        <StatCard
          label="Estado"
          value={event.status}
          sub={event.sales_active ? 'ventas activas' : 'ventas pausadas'}
        />
      </div>

      {event.ticket_tiers && event.ticket_tiers.length > 0 && (
        <div className="border border-white/8 divide-y divide-white/8">
          <p className="px-5 py-3 text-xs tracking-widest text-bone/40 uppercase">Tiers</p>
          {event.ticket_tiers.map((tier: { id: string; name: string; price_uyu: number; quantity_total: number }) => (
            <div key={tier.id} className="flex items-center justify-between px-5 py-3">
              <p className="text-sm text-bone">{tier.name}</p>
              <p className="text-sm text-bone/50">
                ${tier.price_uyu.toLocaleString('es-UY')} · {tier.quantity_total} lugares
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Link
          href={`/admin/events/${params.id}/edit`}
          className="border border-bone/20 px-4 py-2 text-xs tracking-widest text-bone/60 uppercase hover:border-bone/40 hover:text-bone transition-colors"
        >
          Editar
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="border border-white/8 bg-white/3 p-5">
      <p className="text-xs tracking-widest text-bone/40 uppercase">{label}</p>
      <p className="mt-2 font-display text-2xl font-light text-bone">{value}</p>
      <p className="mt-1 text-xs text-bone/30">{sub}</p>
    </div>
  )
}
