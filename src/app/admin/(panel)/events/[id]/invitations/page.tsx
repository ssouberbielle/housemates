import { requireAdmin } from '@/lib/auth/admin'
import { Mail } from 'lucide-react'

export default async function EventInvitationsPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-bone/40">Guest list (bypass whitelist)</p>
        <button
          disabled
          className="border border-bone/10 px-4 py-2 text-xs tracking-widest text-bone/30 uppercase cursor-not-allowed"
        >
          Nueva invitación
        </button>
      </div>

      <div className="border border-white/8 bg-white/3 p-12 text-center">
        <Mail size={32} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">Las invitaciones estarán disponibles próximamente.</p>
      </div>
    </div>
  )
}
