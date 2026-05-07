import { requireAdmin } from '@/lib/auth/admin'
import { ScanLine } from 'lucide-react'

export default async function EventScanPage() {
  await requireAdmin()

  return (
    <div className="max-w-sm mx-auto space-y-6 text-center">
      <div className="border border-white/8 bg-white/3 p-12">
        <ScanLine size={48} strokeWidth={1} className="mx-auto mb-4 text-bone/20" />
        <p className="text-sm text-bone/40">
          El scanner QR estará disponible próximamente.
        </p>
        <p className="mt-2 text-xs text-bone/25">
          Requiere cámara — optimizado para móvil
        </p>
      </div>
    </div>
  )
}
