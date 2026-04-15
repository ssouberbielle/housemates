# DECISIONS — HOUSE MATES

> ADRs (Architecture Decision Records) livianos. Decisiones técnicas tomadas durante el diseño o implementación que no están obvias en los docs oficiales.
>
> **Reglas:**
> - Append-only: nunca se edita una decisión ya registrada
> - Si una decisión cambia → nueva entrada que la supersede (con link a la anterior)
> - Formato: contexto → decisión → alternativas descartadas → consecuencias
>
> Última entrada: #007

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

<!-- Las próximas decisiones se agregan como #008, #009, etc. -->
