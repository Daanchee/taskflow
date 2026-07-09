# Plan: [NOMBRE DE LA FEATURE]

**Spec**: `specs/[NNN-slug]/spec.md` | **Estado**: Borrador | **Creado**: [FECHA]

## Resumen
[2-3 frases: qué se construye técnicamente y el enfoque elegido, derivado del spec]

## Contexto Técnico
- **Backend afectado**: [routes/controllers/services/repositories que se tocan o crean]
- **Frontend afectado**: [features/componentes/hooks que se tocan o crean]
- **Esquemas Zod nuevos/modificados**: [lista]
- **Endpoints nuevos/modificados**: [método + ruta + request/response resumido]
- **Dependencias nuevas**: [ninguna, o justificar por qué es necesaria]

## Constitution Check
Repasa cada principio de `.specify/memory/constitution.md` contra este plan:

| Principio | Cumple | Nota |
|---|---|---|
| I. Arquitectura en capas | ✅/❌ | |
| II. Zod como fuente única | ✅/❌ | |
| III. Tipado estricto | ✅/❌ | |
| IV. Testing obligatorio | ✅/❌ | |
| V. Simplicidad | ✅/❌ | |
| VI. Contrato de API documentado | ✅/❌ | |
| VII. UX consistente | ✅/❌ | |

Si alguna fila es ❌, resuélvelo en el diseño o documéntalo en "Complejidad/Desviaciones" con
justificación explícita. No se avanza a `/tasks` con un ❌ sin justificar.

## Estructura de Proyecto
Archivos concretos que esta feature añade o modifica (rutas reales del repo):

```
backend/src/...
frontend/src/...
```

## Fase 0 — Investigación (solo si hay incógnitas)
[Decisiones técnicas que requieren resolverse antes de diseñar: ej. cómo modelar una relación,
qué librería usar para X. Si no hay incógnitas, omite esta fase.]

## Fase 1 — Diseño
- **Modelo de datos** (`data-model.md` si es complejo, o inline si es simple): entidades, campos,
  validaciones Zod, relaciones.
- **Contratos de API** (`contracts/` si son varios endpoints, o inline si es simple): request/
  response por endpoint, códigos de error.
- **Quickstart de verificación**: pasos manuales o de test para confirmar que la feature funciona
  end-to-end.

## Complejidad / Desviaciones
[Solo si algún principio quedó ❌ arriba. Formato: "Se viola el principio X porque Y; alternativa
más simple descartada porque Z".]
