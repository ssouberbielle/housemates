import { requireAdmin } from '@/lib/auth/admin'
import { CalendarDays } from 'lucide-react'

export const metadata = { title: 'Eventos — Admin HOUSE MATES' }

export default async function EventsPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-bone">Eventos</h1>
          <p className="mt-1 text-sm text-bone/40">Gestión de eventos</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 border border-bone/10 px-4 py-2 text-xs tracking-widest text-bone/30 uppercase cursor-not-allowed"
        >
          Nuevo evento
        </button>
      </div>

      <div className="border border-white/8 bg-white/3 p-12 text-center">
        <CalendarDays size={32} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">La gestión de eventos estará disponible próximamente.</p>
      </div>
    </div>
  )
}
