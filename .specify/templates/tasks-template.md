# Tasks: [NOMBRE DE LA FEATURE]

**Plan**: `specs/[NNN-slug]/plan.md` | **Estado**: Pendiente | **Creado**: [FECHA]

Convenciones: `[P]` = puede ejecutarse en paralelo (toca archivos distintos e independientes sin
dependencias entre sí). Cada tarea trae la ruta de archivo exacta. Los tests van antes que la
implementación que cubren (Principio IV).

## Fase 1 — Setup
- [ ] T001 [P] [Dependencias/config nuevas si aplica, con ruta exacta]

## Fase 2 — Tests (antes que el código que cubren)
- [ ] T002 [P] Test unitario de `[archivo]` en `backend/tests/[...].test.ts`
- [ ] T003 [P] Test de integración de `[ruta]` en `backend/tests/[...].test.ts`
- [ ] T004 [P] Test de componente/hook en `frontend/src/[...].test.tsx`

## Fase 3 — Backend Core
- [ ] T005 Esquema Zod en `backend/src/schemas/[...].ts`
- [ ] T006 Método(s) de repositorio en `backend/src/repositories/[...].ts`
- [ ] T007 Lógica de servicio en `backend/src/services/[...].ts`
- [ ] T008 Controller en `backend/src/controllers/[...].ts`
- [ ] T009 Ruta + doc Swagger en `backend/src/routes/[...].ts`

## Fase 4 — Frontend Core
- [ ] T010 [P] Cliente de API en `frontend/src/api/[...].ts`
- [ ] T011 [P] Hook(s) de React Query en `frontend/src/features/[...].ts`
- [ ] T012 Componente(s) en `frontend/src/features/[...].tsx`

## Fase 5 — Integración y Pulido
- [ ] T013 Verificar el Constitution Check del plan contra el resultado real
- [ ] T014 Correr `npm test`, `npm run lint` en backend y frontend
- [ ] T015 Ejecutar el quickstart de verificación del plan

## Dependencias
- Fase 2 antes que Fase 3/4 (tests antes que implementación).
- T005 antes de T006/T007/T008/T009 (el esquema es la base del resto).
- Fase 4 puede empezar cuando el endpoint de Fase 3 esté disponible.
- Fase 5 al final, siempre.
