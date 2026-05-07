import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { Users } from 'lucide-react'

export const metadata = { title: 'Whitelist — Admin HOUSE MATES' }

export default async function WhitelistPage() {
  await requireAdmin()
  const db = createAdminClient()
  const { count } = await db
    .from('whitelist')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-bone">Whitelist</h1>
          <p className="mt-1 text-sm text-bone/40">
            {count ?? 0} email{count !== 1 ? 's' : ''} activo{count !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 border border-bone/10 px-4 py-2 text-xs tracking-widest text-bone/30 uppercase cursor-not-allowed"
        >
          Agregar emails
        </button>
      </div>

      <div className="border border-white/8 bg-white/3 p-12 text-center">
        <Users size={32} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">La gestión de whitelist estará disponible próximamente.</p>
      </div>
    </div>
  )
}
