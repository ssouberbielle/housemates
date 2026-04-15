'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AccessPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading || password.length === 0) return;
    setLoading(true);
    setInvalid(false);

    const res = await fetch('/api/gate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.replace('/');
      router.refresh();
      return;
    }

    setInvalid(true);
    setPassword('');
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col justify-between px-6 py-6 md:px-10">
      <header className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-bone/50">
        <span className="flex items-center gap-2">
          <span className="heartbeat inline-block h-1.5 w-1.5 rounded-full bg-ember" />
          Private entry
        </span>
        <span>No.001 / MVD</span>
      </header>

      <section className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md">
          <p className="reveal text-center font-mono text-[10px] uppercase tracking-[0.5em] text-bone/40">
            Ingresá la palabra
          </p>
          <h1
            className="reveal mt-6 text-center font-display text-5xl font-light leading-none tracking-tightest md:text-6xl"
            style={{ animationDelay: '0.1s' }}
          >
            HOUSE MATES
          </h1>

          <form
            onSubmit={handleSubmit}
            className="reveal mt-14 flex flex-col items-center gap-8"
            style={{ animationDelay: '0.3s' }}
          >
            <Input
              type="password"
              inputMode="text"
              autoComplete="current-password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              invalid={invalid}
              disabled={loading}
              aria-label="Password"
              aria-invalid={invalid}
              className="text-center"
              placeholder="· · · · · ·"
            />

            <Button type="submit" disabled={loading || password.length === 0}>
              {loading ? 'Verificando' : 'Entrar'}
            </Button>

            <p
              className="h-4 font-mono text-[10px] uppercase tracking-[0.4em] text-ember"
              role="status"
              aria-live="polite"
            >
              {invalid ? 'Palabra incorrecta' : '\u00a0'}
            </p>
          </form>
        </div>
      </section>

      <footer className="flex items-end justify-between font-mono text-[10px] uppercase tracking-[0.35em] text-bone/40">
        <span>Solo miembros</span>
        <a
          href="https://instagram.com/house__mates"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ember"
        >
          → @house__mates
        </a>
      </footer>
    </main>
  );
}
