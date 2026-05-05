# HANDOFF — HOUSE MATES

> Estado actual del proyecto. Este archivo se reescribe en cada PR que mergea a `develop`.
> Última actualización: 2026-05-04 por Tato (branch `feature/admin-base`, en progreso)

---

## Dónde estamos

**Fase:** Diseño + docs ✅ → Scaffold + gate ✅ → Fix visual landing ✅ → Supabase + DB ✅ → Admin base ⏳

Quinta feature en curso. El panel de administración tiene login funcionando con Supabase Auth (Server Action), middleware de auth correctamente configurado, y layout del panel con sidebar y header. Falta implementar las páginas concretas del panel (eventos, tickets, whitelist, config).

---

## Branch activa

- `feature/admin-base` (en desarrollo — aún no PR a develop)

---

## Qué está hecho

### Feature `admin-base` (en curso)

- `src/middleware.ts` — agregado `handleAdminAuth` para rutas `/admin/*` y `/api/admin/*`; separado del gate de password; refresca tokens de Supabase en cada request
- `src/lib/auth/admin.ts` — helpers `getAdminUser()`, `requireAdmin()`, `requireOwner()`, `logAdminAction()`
- `src/app/admin/login/page.tsx` — login form (Client Component, `useTransition`)
- `src/app/admin/login/actions.ts` — `loginAction` (Server Action con `redirect('/admin')`), `logoutAction`
- `src/app/admin/(panel)/layout.tsx` — layout del panel con Sidebar + Header; redirige a login si `getAdminUser()` retorna null
- `src/app/admin/(panel)/page.tsx` — dashboard con KPIs (tickets vendidos, whitelist activa, próximo evento)
- `src/app/api/admin/auth/login/route.ts` — endpoint REST alternativo (no usado en el flujo actual, disponible para uso futuro)
- `src/components/admin/sidebar.tsx` y `header.tsx` — componentes de layout del panel
- `@supabase/ssr` actualizado de `0.3.0` a `0.10.2` (ver DECISIONS #011)

**Bug crítico resuelto:** `@supabase/ssr@0.3.0` usaba API `get/set/remove` y el código usaba `getAll/setAll` (introducida en v0.5.0). La librería ignoraba silenciosamente los callbacks — las sesiones nunca se persistían. Actualizar a 0.10.2 resolvió el login.

### Feature `supabase-setup` (mergeada a develop — 2026-04-15)

- `supabase/migrations/0001_init.sql` — schema completo: 10 tablas (admins, events, ticket_tiers, tickets, whitelist, check_ins, admin_logs, site_config, gate_attempts, email_log), tipos enum, trigger `updated_at`
- `supabase/migrations/0002_indexes.sql` — índices de performance
- `supabase/migrations/0003_rls.sql` — Row Level Security en todas las tablas
- `supabase/migrations/0004_seed.sql` — datos de seed para dev
- `supabase/config.toml` — config del CLI de Supabase
- `src/lib/supabase/server.ts` — cliente SSR para Server Components / Route Handlers / Server Actions
- `src/lib/supabase/client.ts` — cliente browser
- `src/lib/supabase/admin.ts` — cliente con service_role (bypass RLS)
- `src/types/database.ts` — tipos TypeScript generados del schema
- `src/lib/validation/` — helpers de normalización y validación (email, documento, schemas zod)

### Features previas (siguen vigentes)

**Infra Next.js:**
- Next.js 14.2 + React 18.3 + TypeScript strict + Tailwind 3.4
- Headers de seguridad globales, paleta ink/bone/ember, fuentes Fraunces + JetBrains Mono
- Deps runtime: iron-session, zod, cva, clsx, tailwind-merge, lucide-react

**Gate funcional:**
- `src/lib/auth/gate.ts` — cookie `hm_access`, TTL 24h, httpOnly + secure en prod
- `src/middleware.ts` — bouncer global; admin paths van a handleAdminAuth, resto va a handleGateAuth
- `src/app/api/gate/route.ts` — POST con zod + `timingSafeEqual` + delay 500ms en fallo
- `src/app/access/page.tsx` — input con shake/ember feedback en password incorrecto

**UI:**
- Landing `/` con tipografía `14-22vw`, micro-interacciones heartbeat + reveal staggered
- Primitivos `button.tsx` + `input.tsx` con CVA variants
- `not-found.tsx` en línea estética

---

## Qué está pendiente en `feature/admin-base`

- [ ] `/admin/events` — listado y gestión de eventos
- [ ] `/admin/events/[id]` — detalle y edición de evento
- [ ] `/admin/tickets` — listado de tickets con filtros
- [ ] `/admin/whitelist` — gestión de emails autorizados (agregar, desactivar, banear)
- [ ] `/admin/invitations` — crear invitaciones (tickets con source=invitation)
- [ ] `/admin/scanner` — validador QR en puerta
- [ ] `/admin/config` — configuración del site (GATE_PASSWORD, etc.)
- [ ] Control de acceso por rol (owner vs staff) en las páginas del panel

---

## Bloqueos / Dudas abiertas

- **Dominio final** aún sin decidir.
- **Deploy a Vercel** pendiente (ver `docs/DEPLOY.md` y `docs/NEXT_STEPS.md`).
- **`GATE_PASSWORD` de producción**: lo define el equipo al primer deploy.

---

## Decisiones recientes relevantes

- **#011** — `@supabase/ssr` actualizado a 0.10.2; API `getAll/setAll` era incompatible con 0.3.0
- **#012** — Admins se crean manualmente desde el dashboard de Supabase (no hay UI de registro en v1)
- Previas siguen vigentes: whitelist 100% manual, cookie 1 día, UYU único, 1Password, scanner sin offline v1, webhook MP idempotente

Ver `memoria/DECISIONS.md` para historial completo (#001–#012).

---

## Quién hizo qué en la última sesión

- **Tato** (2026-05-04): implementó feature/admin-base — login, middleware admin auth, panel layout, dashboard KPIs. Resolvió bug de versión de `@supabase/ssr`.

---

## Próximos pasos concretos

1. Completar páginas del panel en `feature/admin-base` (eventos, tickets, whitelist, scanner, config)
2. Correr `/security-review` o `shannon` antes del PR (hay rutas admin nuevas)
3. PR `feature/admin-base` → `develop` con review de al menos 1 miembro
4. Retomar deploy a Vercel + dominio (bloqueado desde `feature/fix-landing`)
