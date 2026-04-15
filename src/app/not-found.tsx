import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 text-center">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.45em] text-bone/40">404</p>
        <h1 className="mt-4 font-display text-5xl font-light tracking-tightest md:text-6xl">
          fuera de la lista
        </h1>
        <Link
          href="/"
          className="mt-10 inline-block font-mono text-[10px] uppercase tracking-[0.4em] text-bone/60 hover:text-ember"
        >
          → volver
        </Link>
      </div>
    </main>
  );
}
