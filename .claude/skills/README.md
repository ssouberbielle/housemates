# Skills del proyecto

Skills de Claude Code compartidos por el equipo de HOUSE MATES.
Cada subcarpeta es un skill que cualquier miembro puede invocar desde Claude Code.

## Formato

Cada skill vive en su propia carpeta:
```
.claude/skills/nombre-skill/
├── SKILL.md        # descripción e instrucciones
└── (archivos de soporte si aplica)
```

## Skills propuestos a futuro

- **new-migration** — genera una migration SQL con naming correcto + actualiza types
- **publish-event** — flujo guiado para publicar un evento (crea record, setea sales_active, dispara anuncio)
- **close-event** — posterior al evento: marca archived, genera reporte, exporta data a CSV
- **audit-security** — revisa RLS policies, verifica que no haya service_role leak, lista endpoints no protegidos

A medida que identifiquemos flujos repetitivos complejos, los convertimos en skills.
