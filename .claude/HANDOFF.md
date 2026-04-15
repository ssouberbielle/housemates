# HANDOFF — HOUSE MATES

> Estado actual del proyecto. Este archivo se reescribe en cada PR que mergea a `develop`.
> Última actualización: 2026-04-15 por Tato (branch `feature/fix-landing`)

---

## Dónde estamos

**Fase:** Diseño + docs ✅ → Scaffold + gate ✅ → Fix visual landing ✅ → Deploy a Vercel ⏳

Tercera feature completa. Correcciones visuales menores sobre la landing: el título principal
pasó de minúsculas (`house mates`) a mayúsculas (`HOUSE MATES`) en ambas páginas (`/` y `/access`),
y el handle de Instagram se corrigió de `@housemates.uy` a `@house__mates` (URL y texto visible)
en ambas páginas también.

---

## Branch activa

- `feature/fix-landing` (pendiente de abrir PR contra `develop`)

---

## Qué está hecho

### Feature `fix-landing`

- `src/app/page.tsx` — título `HOUSE` / `MATES` en mayúsculas + link IG corregido a `@house__mates`
- `src/app/access/page.tsx` — título `HOUSE MATES` en mayúsculas + link IG corregido a `@house__mates`

### Features previas (siguen vigentes)

**Infra Next.js:**
- Next.js 14.2 + React 18.3 + TypeScript strict + Tailwind 3.4
- Headers de seguridad globales, paleta ink/bone/ember, fuentes Fraunces + JetBrains Mono
- Deps runtime: iron-session, zod, cva, clsx, tailwind-merge, lucide-react

**Gate funcional:**
- `src/lib/auth/gate.ts` — cookie `hm_access`, TTL 24h, httpOnly + secure en prod
- `src/middleware.ts` — bouncer global, falla cerrado si falta `GATE_COOKIE_SECRET`
- `src/app/api/gate/route.ts` — POST con zod + `timingSafeEqual` + delay 500ms en fallo
- `src/app/access/page.tsx` — input con shake/ember feedback en password incorrecto

**UI:**
- Landing `/` con tipografía `14-22vw`, micro-interacciones heartbeat + reveal staggered
- Primitivos `button.tsx` + `input.tsx` con CVA variants
- `not-found.tsx` en línea estética

**Skills y docs:**
- 5 skills copiadas a `.claude/skills/`: frontend-design, shannon, code-reviewer, browser-use, claude-md-improver
- `docs/DEPLOY.md`, `docs/NEXT_STEPS.md`, `README.md` actualizados

---

## Qué está pendiente

### Deploy (humano — ver `docs/NEXT_STEPS.md`)

- [ ] Crear cuenta 1Password Teams y vault HOUSE MATES
- [ ] Crear cuenta Vercel + conectar repo
- [ ] Generar `GATE_COOKIE_SECRET` + `GATE_PASSWORD` inicial por entorno
- [ ] Setear env vars en Vercel (dev/preview/prod)
- [ ] Primer preview deploy
- [ ] Decidir + registrar dominio
- [ ] Configurar DNS + SSL

### Próxima feature (código)

`feature/supabase-setup` — conectar Supabase, crear migrations iniciales, RLS policies base.

---

## Bloqueos / Dudas abiertas

- **Dominio final** aún sin decidir.
- **`GATE_PASSWORD` inicial de production**: lo define el equipo al momento del primer deploy.

---

## Decisiones recientes relevantes

- Handle Instagram confirmado como `@house__mates` (resuelve duda abierta del HANDOFF anterior)
- Previas siguen vigentes: whitelist 100% manual, cookie 1 día, UYU único, 1Password, scanner sin offline v1, webhook MP idempotente

Ver `memoria/DECISIONS.md` para historial completo (#001–#010).

---

## Quién hizo qué en la última sesión

- **Tato** (2026-04-15): corrección del título de la landing (mayúsculas) y handle de Instagram en `/` y `/access`.
- **José**: pendiente de review del PR.
- **Facu**: owner, sin contribución de código en esta fase.

---

## Próximos pasos concretos

1. Abrir PR `feature/fix-landing` → `develop`
2. José review + merge con squash
3. Completar `docs/NEXT_STEPS.md` (cuentas Vercel + 1Password + env vars + primer deploy)
4. Decidir dominio + comprarlo + DNS
5. Abrir `feature/supabase-setup` desde develop
