import { redirect } from 'next/navigation'
import { getAdminUser } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const metadata = { title: 'Administradores — Admin HOUSE MATES' }

export default async function AdminsPage() {
  const currentAdmin = await getAdminUser()
  if (!currentAdmin) redirect('/admin/login')
  if (currentAdmin.role !== 'owner') redirect('/admin')

  const db = createAdminClient()
  const { data: admins } = await db
    .from('admins')
    .select('id, name, email, role, active, last_login_at, created_at')
    .order('created_at', { ascending: true })

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-light text-bone">Administradores</h1>
          <p className="mt-1 text-sm text-bone/40">{admins?.length ?? 0} usuarios</p>
        </div>
        <button
          disabled
          className="flex items-center gap-2 border border-bone/10 px-4 py-2 text-xs tracking-widest text-bone/30 uppercase cursor-not-allowed"
        >
          Nuevo admin
        </button>
      </div>

      <div className="border border-white/8 divide-y divide-white/8">
        {admins?.map((a) => (
          <div key={a.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm text-bone">{a.name}</p>
              <p className="mt-0.5 text-xs text-bone/40">{a.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`text-xs tracking-widest uppercase ${
                  a.role === 'owner' ? 'text-ember' : 'text-bone/40'
                }`}
              >
                {a.role}
              </span>
              <span
                className={`text-xs ${a.active ? 'text-bone/40' : 'text-red-400/60'}`}
              >
                {a.active ? 'activo' : 'inactivo'}
              </span>
              {a.last_login_at && (
                <span className="text-xs text-bone/25">
                  último acceso{' '}
                  {format(new Date(a.last_login_at), "d MMM yyyy", { locale: es })}
                </span>
              )}
            </div>
          </div>
        ))}
        {(!admins || admins.length === 0) && (
          <p className="px-5 py-4 text-sm text-bone/40">Sin administradores registrados.</p>
        )}
      </div>
    </div>
  )
}
