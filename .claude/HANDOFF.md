# HANDOFF — HOUSE MATES

> Estado actual del proyecto. Este archivo se reescribe en cada PR que mergea a `develop`.
> Última actualización: 2026-04-15 por José (branch `feature/project-base`)

---

## Dónde estamos

**Fase:** Diseño de arquitectura ✅ → Scaffold inicial ⏳

Acabamos de terminar toda la documentación del proyecto. El repo tiene los 5 documentos arquitectónicos completos en `docs/`, la infraestructura Claude compartida en `.claude/`, y un README que linkea todo. **Todavía no hay código ejecutable** — no se corrió `create-next-app` aún.

---

## Branch activa

- `feature/project-base` (pendiente de abrir PR contra `develop`)

---

## Qué está hecho

### Documentación (completa)
- `docs/ARCHITECTURE.md` — arquitectura full: stack, rutas, modelo de datos (10 tablas), flujos (gate, compra, validación puerta, whitelist), seguridad, features v1/v2, roadmap
- `docs/API.md` — spec de endpoints públicos, admin, cron + códigos de error
- `docs/SCAFFOLD.md` — estructura de carpetas, dependencies, configs, checklist de 20 pasos
- `docs/EXTERNAL_SERVICES.md` — 10 servicios externos (Supabase, MP, Resend, Vercel, GitHub, dominio, Cloudflare, Sentry, 1Password, Upstash), setup, costos, secrets
- `docs/database.excalidraw` — diagrama ER visual

### Infra Claude Code
- `.claude/CLAUDE.md` — instrucciones del proyecto (reglas, convenciones, workflow)
- `.claude/HANDOFF.md` — este archivo
- `.claude/memoria/JOURNAL.md` — log histórico append-only
- `.claude/memoria/DECISIONS.md` — ADRs livianos
- `.claude/commands/handoff.md` — slash command `/handoff`
- `.claude/commands/` y `.claude/skills/` — READMEs con propuestas

### README principal
- Actualizado con links a toda la documentación

---

## Qué está pendiente (próximo bloque de trabajo)

### Scaffold inicial (ver `docs/SCAFFOLD.md` checklist paso a paso)

1. `npx create-next-app@latest` con App Router + TS + Tailwind + ESLint
2. Ajustar estructura de carpetas según SCAFFOLD.md sección 1
3. Instalar dependencies del stack
4. Crear `.env.example` y `.env.local`
5. Configurar Prettier + alias `@/*`

### Servicios externos (trabajo paralelo)

Idealmente antes o durante el scaffold, que alguien (José o Tato) avance con:

- [ ] Crear cuenta **1Password Teams** y vault "HOUSE MATES" compartido con los 3
- [ ] Crear proyectos Supabase dev + prod (región São Paulo)
- [ ] Crear cuenta Resend (sin dominio todavía)
- [ ] Iniciar cuenta empresa Mercado Pago UY (proceso de verificación tarda 1-3 días)
- [ ] Conectar repo a Vercel

---

## Bloqueos / Dudas abiertas

- **Dominio definitivo:** aún no elegido. Opciones discutidas: `.com`, `.uy`, `.fm`, `.party`. Se decide cuando el proyecto avance más.
- **Fecha del primer evento con este sistema:** no definida. Define la urgencia del MVP.
- **Guía visual/branding:** pendiente de consolidar con material existente de HOUSE MATES (tipografías, paleta, assets previos).

---

## Decisiones recientes relevantes

Para detalle completo ver `memoria/DECISIONS.md`. Highlights:

- Whitelist de acceso a compra es **100% manual** (decisión explícita de José — no auto-populate, no form de solicitud, emails se agregan desde admin por coma)
- Cookie del gate dura **1 día**
- Moneda **UYU** únicamente
- **1Password Teams** como secret manager del equipo
- Scanner **sin modo offline en v1** (internet en puerta confirmado confiable)

---

## Quién hizo qué en la última sesión

- **José** (2026-04-14 y 2026-04-15): diseño completo de arquitectura junto con Claude, clonación del repo, creación de branch, documentación en `docs/` e infra en `.claude/`.
- **Tato**: aún no se sumó al código (en onboarding).
- **Facu**: owner, no contribuye código.

---

## Próximos pasos concretos

1. Abrir PR de `feature/project-base` → `develop` con toda la documentación
2. Review y merge por Tato
3. Crear nueva branch `feature/scaffold` desde develop
4. Ejecutar checklist de `docs/SCAFFOLD.md`
5. En paralelo: setup de servicios externos (1Password, Supabase, Vercel)
