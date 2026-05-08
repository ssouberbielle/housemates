'use client'

import { useState, useTransition } from 'react'
import { updateEventAction } from '../actions'
import type { EventInput, TierInput } from '@/lib/validation/schemas'
import { Plus, Trash2 } from 'lucide-react'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

const emptyTier = (): TierInput => ({ name: '', price_uyu: 0, quantity_total: 0, description: '' })

export function EventEditForm({
  id,
  initial,
}: {
  id: string
  initial: EventInput
}) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState('')
  const [event, setEvent] = useState<EventInput>(initial)
  const [newTiers, setNewTiers] = useState<TierInput[]>([])
  const [showAddTier, setShowAddTier] = useState(false)

  function handleChange(field: keyof EventInput, value: string | number) {
    setEvent((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'title') next.slug = slugify(String(value))
      return next
    })
  }

  function handleTierChange(i: number, field: keyof TierInput, value: string | number) {
    setNewTiers((prev) => prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t)))
  }

  function handleSubmit() {
    setError('')
    startTransition(async () => {
      const result = await updateEventAction(id, event, newTiers)
      if (result?.error) setError(result.error)
    })
  }

  const inputClass =
    'w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-bone placeholder-bone/20 outline-none transition focus:border-bone/30'
  const labelClass = 'mb-1.5 block text-xs tracking-widest text-bone/50 uppercase'

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Título</label>
        <input className={inputClass} value={event.title} onChange={(e) => handleChange('title', e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>Slug</label>
        <input className={inputClass} value={event.slug} onChange={(e) => handleChange('slug', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Inicio</label>
          <input type="datetime-local" className={inputClass} value={event.date_start} onChange={(e) => handleChange('date_start', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Fin</label>
          <input type="datetime-local" className={inputClass} value={event.date_end} onChange={(e) => handleChange('date_end', e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Lugar</label>
        <input className={inputClass} value={event.location_name} onChange={(e) => handleChange('location_name', e.target.value)} />
      </div>

      <div>
        <label className={labelClass}>URL del lugar (opcional)</label>
        <input type="url" className={inputClass} value={event.location_url ?? ''} onChange={(e) => handleChange('location_url', e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Capacidad</label>
          <input type="number" min={1} className={inputClass} value={event.capacity} onChange={(e) => handleChange('capacity', e.target.value)} />
        </div>
        <div>
          <label className={labelClass}>Estado</label>
          <select className={inputClass} value={event.status} onChange={(e) => handleChange('status', e.target.value)}>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Descripción (opcional)</label>
        <textarea rows={3} className={inputClass} value={event.description_md ?? ''} onChange={(e) => handleChange('description_md', e.target.value)} />
      </div>

      {/* Agregar tiers nuevos */}
      <div className="border-t border-white/8 pt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs tracking-widest text-bone/40 uppercase">Nuevos tiers</p>
          <button
            type="button"
            onClick={() => { setShowAddTier(true); setNewTiers([emptyTier()]) }}
            className="flex items-center gap-1.5 text-xs text-bone/40 hover:text-bone/70 transition-colors"
          >
            <Plus size={13} /> Agregar tier
          </button>
        </div>

        {showAddTier && newTiers.map((tier, i) => (
          <div key={i} className="border border-white/8 bg-white/3 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-bone/30">Tier nuevo {i + 1}</p>
              <button type="button" onClick={() => setNewTiers((p) => p.filter((_, idx) => idx !== i))} className="text-bone/25 hover:text-ember">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nombre</label>
                <input className={inputClass} value={tier.name} onChange={(e) => handleTierChange(i, 'name', e.target.value)} placeholder="General" />
              </div>
              <div>
                <label className={labelClass}>Precio (UYU)</label>
                <input type="number" min={1} className={inputClass} value={tier.price_uyu || ''} onChange={(e) => handleTierChange(i, 'price_uyu', e.target.value)} placeholder="1200" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Cantidad</label>
              <input type="number" min={1} className={inputClass} value={tier.quantity_total || ''} onChange={(e) => handleTierChange(i, 'quantity_total', e.target.value)} placeholder="200" />
            </div>
          </div>
        ))}

        {showAddTier && (
          <button type="button" onClick={() => setNewTiers((p) => [...p, emptyTier()])} className="flex items-center gap-1.5 text-xs text-bone/30 hover:text-bone/60 transition-colors">
            <Plus size={12} /> Otro tier
          </button>
        )}
      </div>

      {error && <p className="text-xs text-ember">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={pending}
        className="border border-bone/20 px-5 py-2.5 text-xs tracking-widest text-bone uppercase hover:border-bone/50 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {pending ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  )
}
