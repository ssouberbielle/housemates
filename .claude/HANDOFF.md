# HANDOFF — HOUSE MATES

> Estado actual del proyecto. Este archivo se reescribe en cada PR que mergea a `develop`.
> Última actualización: 2026-04-15 por José (branch `feature/landing-gate`)

---

## Dónde estamos

**Fase:** Diseño + docs ✅ → Scaffold + gate ✅ → Deploy a Vercel ⏳

Segunda feature completa. El repo ahora tiene **código ejecutable**: scaffold Next.js 14 con App Router, gate de password universal funcional (middleware + iron-session), y una landing placeholder con dirección estética definida (serif editorial Fraunces + mono JetBrains + paleta ink/bone/ember + grain overlay + heartbeat). Build production limpio: `/` 141B estático, `/access` 8.8 kB, middleware 30.9 kB.

---

## Branch activa

- `feature/landing-gate` (pendiente de abrir PR contra `develop`)

---

## Qué está hecho

### Feature `landing-gate`

**Infra Next.js:**
- Next.js 14.2 + React 18.3 + TypeScript strict + Tailwind 3.4
- Config: `next.config.mjs` con headers de seguridad globales (X-Frame-Options, HSTS, Permissions-Policy, etc.), `tailwind.config.ts` con paleta ink/bone/ember + fuentes variable, `tsconfig.json` con alias `@/*`, ESLint + Prettier con plugin tailwind
- Deps runtime: iron-session, zod, cva, clsx, tailwind-merge, lucide-react
- `.env.example` commiteado con template de vars del gate

**Gate funcional:**
- `src/lib/auth/gate.ts` — helpers iron-session (cookie `hm_access`, TTL 24h, httpOnly + secure en prod + sameSite lax)
- `src/middleware.ts` — bouncer global con matcher. Ruteo público: `/access` + `/api/gate`. Falla cerrado si falta `GATE_COOKIE_SECRET`
- `src/app/api/gate/route.ts` — POST con zod + `timingSafeEqual` + delay 500ms en fallo
- `src/app/access/page.tsx` — client component con input + shake/ember feedback en password incorrecto
- Cookie firmada end-to-end validado via curl (redirect 307, POST 401/200, cookie persiste)

**UI + dirección estética:**
- Serif editorial **Fraunces** + mono **JetBrains Mono** vía `next/font/google`
- Paleta: ink `#0a0a0a`, bone `#f4f1ea`, ember `#ff3b1f` (acento puntual)
- Grain SVG overlay `mix-blend-mode: overlay` sobre todo el body
- Micro-interacción: heartbeat pulsante ember + reveal staggered
- `/` landing: título `20vw` tracking negativo + metadata mono + coords MVD + link IG
- `/access`: input tipo signature-line (subrayado fino), shake en error
- Primitivos `button.tsx` + `input.tsx` con CVA variants
- `not-found.tsx` en la misma línea estética

**Skills compartidas al repo:**
- `frontend-design/`, `shannon/`, `code-reviewer/`, `browser-use/`, `claude-md-improver/` copiadas de los sistemas locales
- `.claude/skills/README.md` actualizado con descripción de cada skill

**Docs nuevas (persisten post-merge):**
- `docs/DEPLOY.md` — Vercel, DNS, rotación de secrets, troubleshooting
- `docs/NEXT_STEPS.md` — action items humanos post-deploy
- `README.md` actualizado con setup local + scripts

---

## Qué está pendiente

### Deploy (humano, no código — ver `docs/NEXT_STEPS.md`)

- [ ] Crear cuenta 1Password Teams y vault HOUSE MATES
- [ ] Crear cuenta Vercel + conectar repo
- [ ] Generar `GATE_COOKIE_SECRET` único por entorno + `GATE_PASSWORD` inicial
- [ ] Setear env vars en Vercel (dev/preview/prod)
- [ ] Primer preview deploy
- [ ] Decidir + registrar dominio
- [ ] Configurar DNS + SSL

### Próxima feature (código)

`feature/supabase-setup` — conectar Supabase, crear migrations iniciales, RLS policies base.

---

## Bloqueos / Dudas abiertas

- **Dominio final** aún sin decidir.
- **Handle de Instagram**: asumido `@housemates.uy` en la landing. Verificar antes del deploy público o cambiarlo.
- **`GATE_PASSWORD` inicial de production**: lo define el equipo al momento del primer deploy.

---

## Decisiones recientes relevantes

Ver `memoria/DECISIONS.md`. Nuevas en esta feature:

- **#008** — `GATE_PASSWORD` en env var temporalmente (migra a `site_config` cuando entre Supabase)
- **#009** — Rate limit del gate con delay artificial 500ms en v0 (sin infra extra tipo Upstash)
- **#010** — 5 skills copiadas al repo para compartir con Tato y Facu (valyu descartada)

Previas siguen vigentes: whitelist 100% manual, cookie 1 día, UYU único, 1Password, scanner sin offline v1, webhook MP idempotente.

---

## Quién hizo qué en la última sesión

- **José** (2026-04-15): scaffold Next.js, implementación del gate, dirección estética (Fraunces + grain + heartbeat), creación de docs de deploy, setup del vault 1Password queda pendiente de acción humana.
- **Tato**: pendiente de review del PR.
- **Facu**: owner, sin contribución de código en esta fase.

---

## Próximos pasos concretos

1. Abrir PR `feature/landing-gate` → `develop`
2. Tato review + merge con squash
3. José: completar `docs/NEXT_STEPS.md` (cuentas Vercel + 1Password + env vars + primer deploy)
4. Decidir dominio + comprarlo + DNS
5. Abrir `feature/supabase-setup` desde develop
