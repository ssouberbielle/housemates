import { requireAdmin } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { GatePasswordForm } from './gate-password-form'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const metadata = { title: 'Configuración — Admin HOUSE MATES' }

export default async function ConfigPage() {
  const admin = await requireAdmin()
  const db = createAdminClient()

  const { data: gateConfig } = await db
    .from('site_config')
    .select('value, updated_at, updated_by')
    .eq('key', 'gate_password')
    .maybeSingle()

  const isOwner = admin.role === 'owner'

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-light text-bone">Configuración</h1>
        <p className="mt-1 text-sm text-bone/40">Ajustes generales del sitio</p>
      </div>

      {/* Gate password */}
      <section className="space-y-4">
        <div className="border-b border-white/8 pb-3">
          <h2 className="text-xs tracking-widest text-bone/50 uppercase">Contraseña del gate</h2>
          <p className="mt-1 text-xs text-bone/30">
            Contraseña que los usuarios ingresan en la landing para acceder al sitio.
          </p>
        </div>

        {gateConfig ? (
          <div className="flex items-center gap-4 border border-white/8 bg-white/3 px-4 py-3">
            <span className="font-mono text-sm text-bone/50 tracking-widest">••••••••</span>
            {gateConfig.updated_at && (
              <span className="text-xs text-bone/25">
                Actualizada el{' '}
                {format(new Date(gateConfig.updated_at), "d MMM yyyy 'a las' HH:mm", { locale: es })}
              </span>
            )}
          </div>
        ) : (
          <p className="border border-white/8 bg-white/3 px-4 py-3 text-xs text-bone/40">
            Sin contraseña configurada — se usa la variable de entorno <code className="font-mono">GATE_PASSWORD</code>.
          </p>
        )}

        {isOwner ? (
          <GatePasswordForm />
        ) : (
          <p className="text-xs text-bone/30">Solo los owners pueden cambiar la contraseña.</p>
        )}
      </section>
    </div>
  )
}
