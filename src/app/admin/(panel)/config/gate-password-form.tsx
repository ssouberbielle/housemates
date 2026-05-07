'use client'

import { useState, useTransition } from 'react'
import { updateGatePasswordAction } from './actions'

export function GatePasswordForm() {
  const [pending, startTransition] = useTransition()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('idle')
    startTransition(async () => {
      const result = await updateGatePasswordAction(password)
      if ('error' in result) {
        setErrorMsg(result.error)
        setStatus('error')
      } else {
        setPassword('')
        setStatus('ok')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="mb-1.5 block text-xs tracking-widest text-bone/50 uppercase">
          Nueva contraseña del gate
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Mínimo 6 caracteres"
          className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-bone placeholder-bone/20 outline-none transition focus:border-bone/30"
        />
      </div>

      {status === 'error' && (
        <p className="text-xs text-ember">{errorMsg}</p>
      )}
      {status === 'ok' && (
        <p className="text-xs text-green-400/70">Contraseña actualizada correctamente.</p>
      )}

      <button
        type="submit"
        disabled={pending || password.length < 6}
        className="border border-bone/20 px-5 py-2.5 text-xs tracking-widest text-bone uppercase transition hover:border-bone/50 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {pending ? 'Guardando...' : 'Guardar contraseña'}
      </button>
    </form>
  )
}
