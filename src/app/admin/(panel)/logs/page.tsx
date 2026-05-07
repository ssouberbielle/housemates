import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { ScrollText } from 'lucide-react'

export const metadata = { title: 'Logs — Admin HOUSE MATES' }

export default async function LogsPage() {
  const admin = await getAdminUser()
  if (!admin) redirect('/admin/login')
  if (admin.role !== 'owner') redirect('/admin')

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-light text-bone">Historial de acciones</h1>
        <p className="mt-1 text-sm text-bone/40">Auditoría de cambios del panel</p>
      </div>

      <div className="border border-white/8 bg-white/3 p-12 text-center">
        <ScrollText size={32} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">El historial de acciones estará disponible próximamente.</p>
      </div>
    </div>
  )
}
