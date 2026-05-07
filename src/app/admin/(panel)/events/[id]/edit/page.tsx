import { requireAdmin } from '@/lib/auth/admin'

export default async function EditEventPage() {
  await requireAdmin()

  return (
    <div className="max-w-2xl space-y-6">
      <p className="text-sm text-bone/40">La edición de eventos estará disponible próximamente.</p>
    </div>
  )
}
