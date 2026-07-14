# Tasks: Dashboard de métricas

**Plan**: `specs/003-dashboard-metricas/plan.md` | **Estado**: Pendiente | **Creado**: 2026-07-14

Convenciones: `[P]` = puede ejecutarse en paralelo (toca archivos distintos e independientes sin
dependencias entre sí). Cada tarea trae la ruta de archivo exacta. Los tests van antes que la
implementación que cubren (Principio IV).

## Fase 1 — Setup
- [x] T001 Agregar `recharts` a `frontend/package.json` y correr install (dependencia justificada
      en `plan.md`: no hay librería de gráficos instalada, es la base del primitivo `chart` de
      shadcn/ui). Hecho vía `npx shadcn@latest add chart`, que instaló `recharts@^3.8.0`.
- [x] T002 Crear el primitivo `frontend/src/components/ui/chart.tsx` (wrapper shadcn/ui sobre
      `recharts`, con soporte de theming claro/oscuro vía variables CSS existentes desde la
      feature de modo oscuro) — depende de T001. Generado por el CLI de shadcn.

## Fase 2 — Tests (antes que el código que cubren)
- [x] T003 [P] Unit test de `StatsService` en `backend/tests/unit/services/stats.service.test.ts`:
      conteo por estado, por prioridad, por proyecto (incluyendo proyecto sin tareas → 0), y
      tendencia diaria de 30 puntos con días en 0.
- [x] T004 [P] Ampliar `backend/tests/unit/repositories/in-memory-task.repository.test.ts` con
      casos para `findAll()` (devuelve tareas de todos los proyectos) y para el fijado de
      `completedAt`: se setea la primera vez que `status` pasa a `DONE`, no se sobrescribe si la
      tarea sale de `DONE` y vuelve a entrar.
- [x] T005 [P] Test de integración de `GET /stats/dashboard` en
      `backend/tests/integration/stats.routes.test.ts`: 200 con datos poblados, 200 con sistema
      vacío (conteos en 0, `byProject: []`), 401 sin cookie de sesión.
- [x] T006 [P] Test de `useDashboardStats` en
      `frontend/src/features/stats/hooks/useDashboardStats.test.ts`: hace la petición inicial y
      configura `refetchInterval` de 30s (FR-006).
- [x] T007 [P] Test de `StatusDistributionChart` en
      `frontend/src/features/stats/components/StatusDistributionChart.test.tsx`: renderiza los
      conteos recibidos por props (componente "tonto", sin mock de red).
- [x] T008 Test de estados de `DashboardPage` en `frontend/src/routes/DashboardPage.test.tsx`:
      `isLoading` → `LoadingSpinner`, `isError` → `ErrorState`, `byProject: []` → `EmptyState`
      (escenario 6 del spec), datos poblados → los 4 gráficos.

## Fase 3 — Backend Core
- [x] T009 Esquema `backend/src/schemas/stats.schema.ts`: `statsByStatusSchema`,
      `statsByPrioritySchema`, `projectTaskCountSchema`, `completedTrendPointSchema`,
      `dashboardStatsSchema` (ver Fase 1 — Diseño de `plan.md`).
- [x] T010 Agregar `completedAt: z.string().datetime().optional()` a `taskSchema` en
      `backend/src/schemas/task.schema.ts` (no se agrega a `createTaskSchema`/`updateTaskSchema`:
      es gestionado por el repositorio, no input de usuario).
- [x] T011 Agregar `findAll(): Promise<Task[]>` a `ITaskRepository` en
      `backend/src/repositories/interfaces/task.repository.interface.ts`.
- [x] T012 Implementar `findAll()` y el fijado automático de `completedAt` (en `create()` y
      `update()`) en `backend/src/repositories/in-memory/in-memory-task.repository.ts` (depende de
      T010, T011; hace pasar T004).
- [x] T013 `StatsService.getDashboardStats()` en `backend/src/services/stats.service.ts`: agrega
      `taskRepository.findAll()` + `projectRepository.findAll()` en `byStatus`, `byPriority`,
      `byProject`, `completedTrend` (30 días) — depende de T009, T012; hace pasar T003.
- [x] T014 `StatsController.getDashboardStats` en `backend/src/controllers/stats.controller.ts` —
      depende de T013.
- [x] T015 `createStatsRouter` con doc `@openapi` en `backend/src/routes/stats.routes.ts` (`GET
      /stats/dashboard`, requiere `requireAuth`) — depende de T014; hace pasar T005.
- [x] T016 Montar `/stats` en `backend/src/routes/index.ts` (con `requireAuth`, mismo patrón que
      `/projects`) y registrar el schema `DashboardStats` en `backend/src/config/swagger.ts` —
      depende de T015.

## Fase 4 — Frontend Core
- [x] T017 [P] Tipos `frontend/src/types/stats.ts` (mirror manual de `DashboardStats`, mismo
      patrón que `types/task.ts`/`types/project.ts`).
- [x] T018 [P] Agregar `completedAt?: string` a la interfaz `Task` en `frontend/src/types/task.ts`.
- [x] T019 Cliente de API `frontend/src/api/stats.api.ts` (`statsApi.getDashboard()`) — depende de
      T017.
- [x] T020 Hook `frontend/src/features/stats/hooks/useDashboardStats.ts` (`useQuery` con
      `refetchInterval: 30_000`) — depende de T019; hace pasar T006.
- [x] T021 [P] Componente `frontend/src/features/stats/components/StatusDistributionChart.tsx`
      (recibe `byStatus` por props) — depende de T002; hace pasar T007.
- [x] T022 [P] Componente `frontend/src/features/stats/components/PriorityDistributionChart.tsx`
      (recibe `byPriority` por props) — depende de T002.
- [x] T023 [P] Componente `frontend/src/features/stats/components/ProjectDistributionChart.tsx`
      (recibe `byProject` por props) — depende de T002.
- [x] T024 [P] Componente `frontend/src/features/stats/components/CompletedTrendChart.tsx` (recibe
      `completedTrend` por props) — depende de T002.
- [x] T025 `frontend/src/routes/DashboardPage.tsx`: usa `useDashboardStats`, maneja
      loading/error/vacío con `LoadingSpinner`/`ErrorState`/`EmptyState` existentes, renderiza los
      4 gráficos en un grid de `Card` — depende de T020-T024; hace pasar T008.
- [x] T026 Agregar la ruta `/dashboard` (bajo `RequireAuth` + `AppShell`) en `frontend/src/App.tsx`
      — depende de T025.
- [x] T027 Agregar el link de navegación al dashboard en
      `frontend/src/components/layout/AppHeader.tsx` (cubre FR-005) — depende de T026.

## Fase 5 — Integración y Pulido
- [x] T028 Revisar la tabla Constitution Check de `plan.md` contra el resultado real: confirmado
      sin ❌ (capas respetadas, `recharts` como única dependencia nueva y justificada, sin `any`,
      tests presentes en las 3 capas, Swagger actualizado con `DashboardStats`, UX consistente en
      ambos temas — verificado visualmente en el paso T030).
- [x] T029 `npm run lint` y `npm test` en `backend/` (62 tests, 11 archivos) y `frontend/` (36
      tests, 12 archivos), ambos en verde. `npm run build` también verificado sin errores en
      ambos paquetes (sin warnings nuevos de lint más allá de los preexistentes en archivos no
      tocados por esta feature).
- [x] T030 Quickstart ejecutado de punta a punta con los dev servers reales (backend :4000,
      frontend :5173) y Chromium headless vía Playwright: login → estado vacío → creación de 2
      proyectos (uno con 3 tareas, otro sin tareas) → los 4 gráficos con datos reales (incluye
      "Proyecto Vacio" con 0) → mover una tarea a `DONE` → la tendencia sube a 1 hoy y
      `byStatus`/`byProject` se actualizan correctamente (confirmado también contra
      `GET /api/stats/dashboard` directo) → modo oscuro legible. Se encontró y corrigió un warning
      de consola ("Base UI: ... expected a native <button>") agregando `nativeButton={false}` al
      botón de navegación del dashboard en `AppHeader.tsx`; tras el fix, cero errores/warnings de
      consola en todo el flujo.

## Dependencias
- Fase 1 (T001-T002) antes que cualquier tarea de frontend que use `recharts`/`chart.tsx`
  (T021-T025).
- Fase 2 (tests, T003-T008) antes que la implementación que cubren: T003→T013, T004→T012,
  T005→T015, T006→T020, T007→T021, T008→T025.
- Dentro de Fase 3: T009 y T010 son independientes entre sí (archivos distintos) pero ambos
  bloquean T012/T013 (necesitan el esquema con `completedAt`). T011 bloquea T012. Orden estricto:
  (T009, T010, T011) → T012 → T013 → T014 → T015 → T016.
- Dentro de Fase 4: T017 y T018 son independientes (`[P]`). T019 depende de T017. T020 depende de
  T019. T021-T024 son independientes entre sí (`[P]`, cada uno en su propio archivo) pero todos
  dependen de T002. T025 depende de T020, T021, T022, T023 y T024 (los junta en una página). T026
  depende de T025. T027 depende de T026.
- Fase 5 al final, siempre, después de que Fase 3 y Fase 4 estén completas.
