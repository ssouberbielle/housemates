'use client';

import { useState, useTransition } from 'react';
import { loginAction } from './actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await loginAction(
        formData.get('email') as string,
        formData.get('password') as string
      );
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl font-light tracking-widest text-bone">
            HOUSE MATES
          </p>
          <p className="mt-1 text-xs tracking-widest text-bone/40 uppercase">Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs tracking-widest text-bone/50 uppercase">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-bone placeholder-bone/20 outline-none transition focus:border-bone/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs tracking-widest text-bone/50 uppercase">
              Contraseña
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-bone placeholder-bone/20 outline-none transition focus:border-bone/30"
            />
          </div>

          {error && <p className="text-xs text-ember">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full border border-bone/20 bg-transparent px-4 py-3 text-xs tracking-widest text-bone uppercase transition hover:border-bone/50 hover:bg-white/5 disabled:opacity-40"
          >
            {pending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
