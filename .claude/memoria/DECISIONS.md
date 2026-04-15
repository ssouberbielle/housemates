# DECISIONS — HOUSE MATES

> ADRs (Architecture Decision Records) livianos. Decisiones técnicas tomadas durante el diseño o implementación que no están obvias en los docs oficiales.
>
> **Reglas:**
> - Append-only: nunca se edita una decisión ya registrada
> - Si una decisión cambia → nueva entrada que la supersede (con link a la anterior)
> - Formato: contexto → decisión → alternativas descartadas → consecuencias
>
> Última entrada: #010

---

## #001 — Stack tecnológico

**Fecha:** 2026-04-14
**Autor:** José + Claude

**Contexto:** Definir el stack antes de arrancar.

**Decisión:** Next.js 14 (App Router) + TypeScript + Tailwind + Supabase + Mercado Pago Checkout Pro + Resend + Vercel.

**Alternativas descartadas:**
- Astro en lugar de Next: más rápido para landing estática pero admin panel interactivo empujó a Next.
- SendGrid / Postmark / SES: Resend ganó por DX y React Email nativo.
- Stripe: no es la opción realista en UY (costos de devisa + menor confianza local); MP es el estándar.
- Checkout Bricks de MP: más integración requerida, PCI indirecto. Checkout Pro (redirección) simplifica MVP.

**Consecuencias:**
- Todo el equipo necesita saber React/Next.
- Supabase resuelve DB + Auth + Storage en una plataforma (simplifica infra).
- Vercel hobby alcanza hasta que escale.

---

## #002 — Whitelist 100% manual

**Fecha:** 2026-04-14
**Autor:** José

**Contexto:** Cómo limitar que solo la comunidad deseada pueda comprar tickets. El password universal se termina filtrando a amigos de amigos, capas de IP/fingerprint no resuelven el problema real (un invitado real comprando para terceros no deseados).

**Decisión:**
- Whitelist de emails gestionada exclusivamente desde el admin
- No auto-populate tras compra
- No CSV bulk import
- No form público de "solicitar acceso"
- Agregado manual con textarea que acepta emails separados por coma
- Normalización: lowercase + strip gmail dots/+tag
- Si email no está en whitelist durante checkout → mensaje "escribinos por IG"

**Alternativas descartadas:**
- Capas de seguridad (IP + device fingerprint + CI único): no resuelve el problema real
- Access requests con form público: overhead innecesario, se canaliza por Instagram igual
- CSV bulk import: innecesario para el volumen (400-500 personas), el input por coma cubre el use case

**Consecuencias:**
- El equipo maneja manualmente la lista. Disciplina requerida.
- Password universal deja de ser barrera real, pasa a ser solo mística.
- DM de Instagram se vuelve canal oficial de solicitud de acceso.

---

## #003 — Cookie gate 1 día

**Fecha:** 2026-04-15
**Autor:** José

**Contexto:** Duración de la sesión tras ingresar password universal.

**Decisión:** Cookie `hm_access` vive **1 día exactamente** (HTTP-only, Secure, SameSite=Lax, firmada con iron-session).

**Alternativas descartadas:**
- 30 días: demasiado permisivo, el password filtrado queda activo mucho tiempo en devices ajenos
- Sesión del browser (cookie sin expires): se pierde contexto al cerrar tab, peor UX

**Consecuencias:**
- Usuarios recurrentes re-ingresan el password cada día. Aceptable por la mística.
- Reduce ventana si la cookie es robada.

---

## #004 — Moneda UYU únicamente

**Fecha:** 2026-04-14
**Autor:** José

**Contexto:** Definir si la ticketera maneja UYU, USD o ambos.

**Decisión:** Solo UYU.

**Consecuencias:**
- Setup de MP más simple (una sola currency).
- Si aparece demanda internacional (Brunch España, etc.), se revisa en v2.

---

## #005 — 1Password Teams como secret manager

**Fecha:** 2026-04-15
**Autor:** José + Claude

**Contexto:** Cómo compartir API keys entre José, Tato y Facu trabajando cada uno desde su Mac con Claude Code, sin mandarlas por WhatsApp/Slack/email.

**Decisión:** 1Password Teams ($24/mes los 3), vault compartido "HOUSE MATES", CLI `op` para inyectar secrets en dev (`op run --env-file=...`).

**Alternativas descartadas:**
- Bitwarden: más barato pero UX y CLI menos pulida
- Doppler: diseñado para secrets en apps pero free tier limitado y curva de aprendizaje
- Vercel + GitHub secrets: no cubre sharing entre devs ni dev local
- Mandar por Slack/WA: inaceptable por seguridad

**Consecuencias:**
- Costo fijo ~$24/mes incluso antes de lanzar.
- Requiere que los 3 tengan cuenta y manejen el flujo `op`.
- Auditoría y rotación granular habilitada.

---

## #006 — Scanner sin modo offline en v1

**Fecha:** 2026-04-15
**Autor:** José

**Contexto:** ¿Implementar cache offline del scanner por si la puerta pierde conexión?

**Decisión:** No en v1. El scanner requiere internet en puerta, y José confirma que la conectividad es confiable en el venue.

**Alternativas descartadas:**
- Cache IndexedDB + sync queue: ~3-4 días extra de dev, complejidad alta, conflict resolution no trivial

**Consecuencias:**
- Dependencia crítica de wifi/4G en la puerta el día del evento.
- Si alguna vez falla → entrada manual vía `/events/[id]/tickets` desde admin.
- Se reevaluará para v2 si aparece un evento con conectividad dudosa.

---

## #007 — Webhook MP idempotente con validación de firma

**Fecha:** 2026-04-15
**Autor:** José + Claude

**Contexto:** Mercado Pago puede reintentar el webhook múltiples veces y también pueden llegar webhooks falsificados.

**Decisión:**
1. Validar `x-signature` header contra `MP_WEBHOOK_SECRET` antes de procesar
2. GET a `/v1/payments/{id}` para obtener estado real (no confiar en el body)
3. Deduplicar por `mp_payment_id` (si ya existe con ese ID, no duplicar operación)
4. Responder 200 en todos los casos procesados exitosamente (incluso duplicados)

**Alternativas descartadas:**
- Confiar en body del webhook sin GET: vulnerable a manipulación
- No validar firma: exposición a falsificación trivial

**Consecuencias:**
- Toda la lógica de confirmación de pago es resistente a reintentos.
- Monitoreo en Sentry es crítico: si webhook falla silenciosamente, perdemos registros de pagos confirmados.

---

## #008 — `GATE_PASSWORD` en env var (temporal)

**Fecha:** 2026-04-15
**Autor:** José + Claude

**Contexto:** Feature `landing-gate` es el primer código ejecutable. No hay Supabase aún. ¿Dónde vive el password del gate?

**Decisión:** En una env var `GATE_PASSWORD` en v0. Rotable desde Vercel dashboard. Cuando entre Supabase (feature siguiente), migra a la tabla `site_config` con rotación desde `/admin/config` (ya contemplado en `docs/ARCHITECTURE.md`).

**Alternativas descartadas:**
- Pasar directo a `site_config`: requiere Supabase antes de deployar → retrasa el objetivo de tener algo en Vercel para comprar dominio.
- Hardcode en código: inaceptable por seguridad + requiere redeploy para rotar.

**Consecuencias:**
- Rotación manual vía Vercel env vars + redeploy. Aceptable para v0.
- Cuando migre a DB, actualizar el route handler `/api/gate` para leer de `site_config` con caché corto.

---

## #009 — Rate limit del gate con delay artificial

**Fecha:** 2026-04-15
**Autor:** José + Claude

**Contexto:** Evitar brute force del password universal. ¿Cómo sin agregar infra extra?

**Decisión:** Delay artificial de 500ms en todas las respuestas de fallo del endpoint `/api/gate`. Sin Redis, sin Upstash, sin contador. El delay por sí solo hace el brute force inviable: con 500ms por intento, probar 10k combinaciones toma >1h por cliente.

**Alternativas descartadas:**
- Upstash Redis (ya planeado en `docs/EXTERNAL_SERVICES.md`): overhead de setup y costo para v0. Se integra cuando haya endpoints más críticos (webhook MP, whitelist check, checkout).
- Contador en memoria por IP: Next.js en Vercel es serverless, la memoria no persiste entre invocations.
- Bloqueo temporal por IP: requiere storage externo → mismo problema.

**Consecuencias:**
- Ante ataque distribuido (botnet con muchas IPs) el delay solo lo ralentiza, no lo bloquea. Aceptable porque el password NO es la barrera real de acceso (lo es la whitelist de emails).
- En feature `feature/supabase-setup` o posterior se integra Upstash para rate limit por IP en endpoints sensibles.

---

## #010 — Skills compartidas copiadas al repo

**Fecha:** 2026-04-15
**Autor:** José

**Contexto:** Tato y Facu tienen Claude Code pero no tienen las skills que José usa. ¿Cómo compartirlas sin que cada uno las configure localmente?

**Decisión:** Copiar 5 skills relevantes al proyecto a `.claude/skills/` del repo (mismo patrón que comandos). Se commitean y cualquier miembro al clonar el repo las tiene.

Skills elegidas:
- `frontend-design` — UI distintiva (crítico para landing + admin)
- `shannon` — pentester autónomo (crítico pre-PR en gate, webhook MP, RLS)
- `code-reviewer` — review automático del diff
- `browser-use` — testing e2e + screenshots
- `claude-md-improver` — mantener el CLAUDE.md al día

**Alternativas descartadas:**
- Cada dev instala sus skills localmente: inconsistencia entre miembros, no garantiza que todos usen las mismas.
- Incluir `valyu-best-practices`: no aplica al stack HOUSE MATES (no hay uso de Valyu API).

**Consecuencias:**
- El `.claude/` del repo pesa más, pero sigue siendo razonable.
- Actualizar una skill requiere PR al repo (consistencia garantizada).
- Tato y Facu al clonar tienen el mismo toolkit que José.

---

<!-- Las próximas decisiones se agregan como #011, #012, etc. -->
