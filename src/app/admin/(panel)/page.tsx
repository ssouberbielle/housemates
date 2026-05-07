import { getAdminUser } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function AdminDashboard() {
  const admin = await getAdminUser();
  const db = createAdminClient();

  const [{ count: totalTickets }, { count: totalWhitelist }, { data: nextEvent }] =
    await Promise.all([
      db.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'paid'),
      db.from('whitelist').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      db
        .from('events')
        .select('id, title, date_start, sales_active, capacity')
        .eq('status', 'published')
        .gte('date_start', new Date().toISOString())
        .order('date_start', { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-light text-bone">
          Bienvenido, {admin?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-bone/40">Panel de administración</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Tickets vendidos"
          value={totalTickets ?? 0}
          sub="estado paid"
        />
        <StatCard
          label="Whitelist"
          value={totalWhitelist ?? 0}
          sub="emails activos"
        />
        <StatCard
          label="Próximo evento"
          value={nextEvent?.title ?? '—'}
          sub={
            nextEvent
              ? new Date(nextEvent.date_start).toLocaleDateString('es-UY', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })
              : 'Sin evento publicado'
          }
          wide
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  wide,
}: {
  label: string;
  value: string | number;
  sub: string;
  wide?: boolean;
}) {
  return (
    <div className="border border-white/8 bg-white/3 p-5">
      <p className="text-xs tracking-widest text-bone/40 uppercase">{label}</p>
      <p className={`mt-2 font-display font-light text-bone ${wide ? 'text-xl' : 'text-3xl'}`}>
        {value}
      </p>
      <p className="mt-1 text-xs text-bone/30">{sub}</p>
    </div>
  );
}
