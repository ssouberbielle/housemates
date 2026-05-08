'use server'

import { requireAdmin, requireOwner, logAdminAction } from '@/lib/auth/admin'
import { createAdminClient } from '@/lib/supabase/admin'
import { eventSchema, tiersSchema, type EventInput, type TierInput } from '@/lib/validation/schemas'
import { fromZonedTime } from 'date-fns-tz'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const TZ = 'America/Montevideo'

function toUTC(localDatetime: string): string {
  return fromZonedTime(new Date(localDatetime), TZ).toISOString()
}

export async function updateEventAction(
  id: string,
  eventData: EventInput,
  newTiers: TierInput[]
): Promise<{ error: string } | void> {
  const admin = await requireAdmin()

  const eventParsed = eventSchema.safeParse(eventData)
  if (!eventParsed.success) return { error: eventParsed.error.issues[0].message }

  const db = createAdminClient()

  const { error: updateError } = await db
    .from('events')
    .update({
      ...eventParsed.data,
      location_url: eventParsed.data.location_url || null,
      description_md: eventParsed.data.description_md || null,
      date_start: toUTC(eventParsed.data.date_start),
      date_end: toUTC(eventParsed.data.date_end),
    })
    .eq('id', id)

  if (updateError) {
    if (updateError.code === '23505') return { error: 'El slug ya está en uso. Elegí otro.' }
    return { error: 'Error al actualizar el evento.' }
  }

  if (newTiers.length > 0) {
    const tiersParsed = tiersSchema.safeParse(newTiers)
    if (!tiersParsed.success) return { error: tiersParsed.error.issues[0].message }

    const { data: existing } = await db
      .from('ticket_tiers')
      .select('sort_order')
      .eq('event_id', id)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = (existing?.[0]?.sort_order ?? 0) + 1

    await db.from('ticket_tiers').insert(
      tiersParsed.data.map((t, i) => ({
        ...t,
        description: t.description || null,
        event_id: id,
        sort_order: nextOrder + i,
      }))
    )
  }

  await logAdminAction(admin.id, 'update', 'event', id)
  revalidatePath(`/admin/events/${id}`)
  revalidatePath(`/admin/events/${id}/edit`)
  redirect(`/admin/events/${id}`)
}

export async function toggleSalesAction(id: string, current: boolean): Promise<void> {
  const admin = await requireAdmin()
  const db = createAdminClient()
  await db.from('events').update({ sales_active: !current }).eq('id', id)
  await logAdminAction(admin.id, !current ? 'enable_sales' : 'disable_sales', 'event', id)
  revalidatePath(`/admin/events/${id}`)
}

export async function archiveEventAction(id: string): Promise<void> {
  const admin = await requireOwner()
  const db = createAdminClient()
  await db.from('events').update({ status: 'archived', sales_active: false }).eq('id', id)
  await logAdminAction(admin.id, 'archive', 'event', id)
  redirect('/admin/events')
}
