import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { Ticket } from 'lucide-react'

export default async function EventTicketsPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const db = createAdminClient()

  const { count } = await db
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', params.id)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-bone/40">{count ?? 0} tickets</p>
        <button
          disabled
          className="border border-bone/10 px-4 py-2 text-xs tracking-widest text-bone/30 uppercase cursor-not-allowed"
        >
          Ticket manual
        </button>
      </div>

      <div className="border border-white/8 bg-white/3 p-12 text-center">
        <Ticket size={32} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">La gestión de tickets estará disponible próximamente.</p>
      </div>
    </div>
  )
}
