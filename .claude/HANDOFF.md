# HANDOFF — HOUSE MATES

> Estado actual del proyecto. Este archivo se reescribe en cada PR que mergea a `develop`.
> Última actualización: 2026-05-07 por Tato (branch `feature/admin-base`, PR pendiente)

---

## Dónde estamos

**Fase:** Diseño + docs ✅ → Scaffold + gate ✅ → Fix visual landing ✅ → Supabase + DB ✅ → Admin base ✅ (PR pendiente)

`feature/admin-base` está lista para PR a `develop`. El panel de admin tiene auth completa, layout navegable con todos los links funcionando, gate password configurable desde el panel, y Playwright configurado con 7 tests verdes.

---

## Branch activa

- `feature/admin-base` — PR pendiente contra `develop`

---

## Qué está hecho

### Feature `admin-base` (esta PR)

**Auth y estructura:**
- `src/middleware.ts` — `handleAdminAuth` para rutas `/admin/*` y `/api/admin/*`; separado del gate; refresca tokens Supabase en cada request
- `src/lib/auth/admin.ts` — `getAdminUser()`, `requireAdmin()`, `requireOwner()`, `logAdminAction()`
- `src/app/admin/login/page.tsx` + `actions.ts` — login/logout con Server Actions, Supabase signInWithPassword, actualiza `last_login_at`
- `src/app/admin/(panel)/layout.tsx` — layout protegido con Sidebar + Header
- `src/components/admin/sidebar.tsx` + `header.tsx` — navegación con 6 links + badge de rol

**Dashboard:**
- `src/app/admin/(panel)/page.tsx` — KPIs: tickets vendidos (status=paid), whitelist activa, próximo evento publicado

**Skeleton completo del panel (stub pages):**
- `/admin/events` — lista vacía + botón deshabilitado
- `/admin/events/[id]` — overview con stats reales (count tickets, tiers), tabs de navegación
- `/admin/events/[id]/edit|tickets|invitations|scan` — stubs navegables
- `/admin/whitelist` — count real de activos, botón deshabilitado
- `/admin/config` — gate password configurable (ver más abajo)
- `/admin/admins` — lista read-only de admins actuales, solo owners
- `/admin/logs` — stub, solo owners
- `src/components/admin/tab-link.tsx` — Client Component para tabs activos en sub-layout de eventos

**Gate password configurable desde el panel:**
- `src/app/api/gate/route.ts` — ahora lee de `site_config` (fallback a env var `GATE_PASSWORD` si no hay fila)
- `src/app/admin/(panel)/config/page.tsx` — muestra fecha de última actualización, form para owners
- `src/app/admin/(panel)/config/actions.ts` — `updateGatePasswordAction` con `requireOwner()`, validación mínimo 6 chars, upsert a `site_config`, `logAdminAction`
- `src/app/admin/(panel)/config/gate-password-form.tsx` — Client Component con feedback éxito/error

**Testing con Playwright:**
- `playwright.config.ts` — dev server local, serial (no parallel), carga `.env.test.local`
- `tests/helpers/auth.ts` — `loginAsAdmin()`, `loginAsOwner()`
- `tests/e2e/auth/login.spec.ts` — 5 tests: login correcto, password incorrecto, redirecciones sin sesión, logout
- `tests/e2e/admin/config.spec.ts` — 2 tests: cambio de gate password, validación mínimo 6 chars
- Scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed` en `package.json`
- 7/7 tests verdes

### Features previas mergeadas (siguen vigentes)

- **supabase-setup:** schema 10 tablas, migrations, clientes SSR/browser/admin, tipos TS, validaciones
- **landing-gate:** gate iron-session, middleware, `/access`, landing UI
- **fix-landing:** handle IG + mayúsculas
- **project-base:** arquitectura documentada, docs/, CLAUDE.md

---

## Qué está pendiente (próximas ramas)

Cada una parte de `develop` tras este merge:

| Rama | Contenido |
|------|-----------|
| `feature/admin-events` | CRUD eventos + tiers (crear, editar, archivar, toggle sales) |
| `feature/admin-whitelist` | Bulk add, búsqueda, ban, edición inline |
| `feature/admin-tickets` | Tabla compradores, ticket manual, resend email |
| `feature/admin-scan` | Invitaciones + Scanner QR (PWA) + close-door |
| `feature/admin-staff` | CRUD admins + logs de auditoría |

**Infra pendiente (humano):**
- Deploy a Vercel + compra de dominio (ver `docs/DEPLOY.md` y `docs/NEXT_STEPS.md`)
- Configurar `GATE_PASSWORD` inicial en `site_config` vía panel o seed

---

## Bloqueos / Dudas abiertas

- Dominio final aún sin decidir.
- Deploy a Vercel pendiente.
- Integración Mercado Pago + emails (Resend) quedan para después de las features de admin.

---

## Decisiones recientes relevantes

- **#013** — Skeleton first: `feature/admin-base` cierra con stub pages navegables; CRUD completo va en ramas separadas por feature
- **#014** — Gate password migrado de env var a `site_config`; `api/gate` lee de DB con fallback (supersede #008)
- **#012** — Admins se crean manualmente desde Supabase dashboard en v1
- **#011** — `@supabase/ssr` actualizado a 0.10.2 (API getAll/setAll incompatible con 0.3.0)

Ver `memoria/DECISIONS.md` para historial completo (#001–#014).

---

## Quién hizo qué en la última sesión

- **Tato** (2026-05-07): completó `feature/admin-base` — Playwright setup + 7 tests, stub pages de todo el panel, gate password configurable desde `/admin/config`, migración de env var a `site_config`.

---

## Próximos pasos concretos

1. Mergear PR `feature/admin-base` → `develop` (review de al menos 1 miembro)
2. Abrir `feature/admin-events` desde `develop` — CRUD de eventos + Playwright tests
3. Abrir `feature/admin-whitelist` desde `develop` — bulk add, búsqueda, ban
4. Coordinar deploy a Vercel + dominio (tarea humana, no requiere más código)
5. Correr `/shannon` antes del PR de cualquier feature que toque gate, whitelist o scan
