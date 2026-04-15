export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.35em] text-bone/50 md:px-10">
        <span className="flex items-center gap-2">
          <span className="heartbeat inline-block h-1.5 w-1.5 rounded-full bg-ember" />
          Live · MVD
        </span>
        <span className="hidden sm:inline">34°54′S · 56°11′W</span>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 md:px-10">
        <div className="w-full max-w-6xl text-center">
          <h1 className="reveal font-display text-[22vw] font-light leading-[0.82] tracking-tightest md:text-[14vw]">
            <span className="block">house</span>
            <span className="block">mates</span>
          </h1>
          <div
            className="reveal mt-10 flex items-center justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.45em] text-bone/55 md:text-[11px]"
            style={{ animationDelay: '0.25s' }}
          >
            <span className="h-px w-10 bg-bone/25" />
            <span>Fiesta privada · Montevideo</span>
            <span className="h-px w-10 bg-bone/25" />
          </div>
        </div>
      </section>

      <footer className="flex items-end justify-between px-6 py-6 font-mono text-[10px] uppercase tracking-[0.35em] text-bone/50 md:px-10">
        <a
          href="https://instagram.com/housemates.uy"
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-ember"
        >
          → @housemates.uy
        </a>
        <span>© {new Date().getFullYear()} · No.001</span>
      </footer>
    </main>
  );
}
