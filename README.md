# HOUSE MATES

Web oficial de la fiesta privada **HOUSE MATES** (Montevideo).
Landing + ticketera con Mercado Pago + panel admin.

---

## Estado

En desarrollo inicial. Arquitectura definida, scaffold pendiente.

---

## Documentación

- **[.claude/CLAUDE.md](.claude/CLAUDE.md)** — instrucciones del proyecto para Claude Code (leerlo primero)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — arquitectura completa: stack, rutas, modelo de datos, flujos, seguridad, roadmap
- **[docs/API.md](docs/API.md)** — especificación de endpoints (públicos + admin + cron)
- **[docs/SCAFFOLD.md](docs/SCAFFOLD.md)** — plan de la base del proyecto: estructura, deps, configs, checklist
- **[docs/EXTERNAL_SERVICES.md](docs/EXTERNAL_SERVICES.md)** — servicios de terceros (Supabase, MP, Resend, Vercel, 1Password, etc.), setup, costos, manejo de secrets
- **[docs/database.excalidraw](docs/database.excalidraw)** — diagrama de base de datos (abrir con [excalidraw.com](https://excalidraw.com))

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Framer Motion
- Supabase (Postgres + Auth + Storage)
- Mercado Pago Checkout Pro
- Resend (emails)
- Vercel (hosting)

---

## Branches

```
main       → producción
develop    → integración
feature/*  → trabajo individual, PR contra develop
```

Cada colaborador trabaja en su propia `feature/*` desde `develop`.

---

## Setup local

> Pendiente hasta scaffold inicial.

```bash
# TODO: npm install, variables de entorno, supabase local, etc.
```

---

## Team

- **José Duró** (@joseeduro) — director creativo, dev
- **Sebastián "Tato" Souverbielle** (@ssouberbielle) — owner, dev
- **Facu** — owner
