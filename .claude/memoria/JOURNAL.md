# JOURNAL — HOUSE MATES

> Historia acumulativa del proyecto. Append-only: cada entrada se agrega al final, nunca se modifica una anterior.
> Una entrada por PR mergeado a `develop`.
> Formato: `## YYYY-MM-DD — autor — branch → develop`

---

## 2026-04-15 — José — `feature/project-base` → `develop`

### Contexto
Primer PR del proyecto. Branch creada desde develop el 2026-04-14 para sentar las bases documentales antes de picar código.

### Qué se hizo

**Documentación arquitectónica completa** en `docs/`:
- Arquitectura: stack (Next.js 14 + Supabase + MP + Resend + Vercel), estructura de rutas (apex + subdominio admin), modelo de datos con 10 tablas, flujos end-to-end (gate, compra, validación puerta, whitelist), políticas de seguridad, scope MVP v1 vs v2
- API spec: contratos de todos los endpoints públicos y admin, códigos de error, formato de respuestas
- Scaffold: estructura de carpetas objetivo, dependencies con versiones, configs clave, checklist de 20 pasos para ejecutar el scaffold
- External Services: 10 servicios (Supabase, MP, Resend, Vercel, GitHub, dominio, Cloudflare, Sentry, 1Password, Upstash) con setup, planes, costos, secrets que genera cada uno
- Diagrama ER en Excalidraw

**Infra Claude Code compartida** en `.claude/`:
- CLAUDE.md con instrucciones del proyecto (reglas, convenciones, dominio específico)
- HANDOFF.md rolling para estado actual
- memoria/JOURNAL.md (este archivo) + DECISIONS.md para decisiones técnicas
- commands/handoff.md slash command
- Carpetas commands/ y skills/ con READMEs

**README principal** reescrito con links a toda la documentación.

### Decisiones clave tomadas
Registradas en `DECISIONS.md`:
- Stack tecnológico definitivo
- Whitelist 100% manual (no auto-populate, no form de solicitud)
- Cookie gate 1 día
- Moneda UYU únicamente
- 1Password como secret manager del equipo
- Scanner sin modo offline en v1
- Webhook MP idempotente con validación de firma

### Problemas / consideraciones
- Ninguno bloqueante. Todas las decisiones importantes fueron discutidas y alineadas antes de escribir docs.
- Dominio definitivo queda abierto (decisión futura).

### Estado al cerrar
- `feature/project-base` lista para PR contra develop
- Próxima fase: scaffold (nueva branch desde develop tras merge)

---

<!-- Las próximas entradas se agregan acá debajo, siempre cronológicas -->
