# Plan: Dashboard de métricas

**Spec**: `specs/003-dashboard-metricas/spec.md` | **Estado**: Borrador | **Creado**: 2026-07-14

## Resumen
Se agrega un endpoint de agregación (`GET /stats/dashboard`) que calcula, en el backend, conteos de
tareas por estado/proyecto/prioridad y una tendencia diaria de tareas completadas de los últimos 30
días. El frontend consume ese endpoint con TanStack Query (polling cada 30s vía `refetchInterval`)
y lo renderiza en una vista nueva `/dashboard` con gráficos (recharts, envuelto en el primitivo
`chart` de shadcn/ui para heredar theming claro/oscuro). Se extiende `Task` con un campo
`completedAt`, fijado por el repositorio la primera vez que una tarea pasa a `DONE`.

## Contexto Técnico
- **Backend afectado**:
  - Nuevo: `services/stats.service.ts`, `controllers/stats.controller.ts`, `routes/stats.routes.ts`,
    `schemas/stats.schema.ts`.
  - Modificado: `schemas/task.schema.ts` (campo `completedAt`), `repositories/interfaces/
    task.repository.interface.ts` (+ `findAll()`), `repositories/in-memory/
    in-memory-task.repository.ts` (implementa `findAll()` + fija `completedAt`), `routes/index.ts`
    (monta `/stats`), `config/swagger.ts` (schema `DashboardStats`).
- **Frontend afectado**:
  - Nuevo: `features/stats/hooks/useDashboardStats.ts`, `features/stats/components/
    StatusDistributionChart.tsx`, `PriorityDistributionChart.tsx`, `ProjectDistributionChart.tsx`,
    `CompletedTrendChart.tsx`, `routes/DashboardPage.tsx`, `api/stats.api.ts`, `types/stats.ts`,
    `components/ui/chart.tsx` (primitivo shadcn/ui sobre recharts, no existe todavía).
  - Modificado: `App.tsx` (ruta `/dashboard`), `components/layout/AppHeader.tsx` (link de
    navegación al dashboard), `types/task.ts` (campo `completedAt` opcional, solo lectura).
- **Esquemas Zod nuevos/modificados**:
  - Nuevo `backend/src/schemas/stats.schema.ts`: `dashboardStatsSchema` (y sub-schemas
    `statsByStatusSchema`, `statsByPrioritySchema`, `projectTaskCountSchema`,
    `completedTrendPointSchema`).
  - Modificado `backend/src/schemas/task.schema.ts`: se agrega `completedAt: z.string().datetime()
    .optional()` a `taskSchema` (entidad de respuesta). No se agrega a `createTaskSchema` ni
    `updateTaskSchema`: es un campo gestionado por el sistema, no un input de usuario.
- **Endpoints nuevos/modificados**:
  - `GET /api/stats/dashboard` (nuevo, requiere sesión): devuelve `DashboardStats` (ver Fase 1).
  - Ningún endpoint existente cambia de contrato (el `completedAt` nuevo en `Task` es un campo
    adicional opcional en las respuestas ya existentes de `/tasks`, no rompe consumidores actuales).
- **Dependencias nuevas**:
  - `recharts` (frontend): no hay ninguna librería de gráficos instalada hoy y la feature requiere
    4 visualizaciones. Se elige `recharts` porque es la que usa el primitivo `chart` oficial de
    shadcn/ui (mismo ecosistema de componentes que ya usa el proyecto — Principio VII), evitando
    tanto mezclar una librería de UI distinta como reinventar gráficos a mano con SVG.

## Constitution Check

| Principio | Cumple | Nota |
|---|---|---|
| I. Arquitectura en capas | ✅ | `StatsService` solo depende de `ITaskRepository`/`IProjectRepository` (interfaces), igual que `ProjectService`/`TaskService`. Agregación vive en el service, no en el controller ni en el frontend. |
| II. Zod como fuente única | ✅ | `dashboardStatsSchema` en Zod define la respuesta del endpoint; `completedAt` se suma al `taskSchema` existente. |
| III. Tipado estricto | ✅ | Sin `any`. `DashboardStats` se infiere de Zod en backend; en frontend se declara manualmente en `types/stats.ts`, igual que `types/task.ts`/`types/project.ts` (no hay paquete compartido entre backend/frontend en este monorepo simple). |
| IV. Testing obligatorio | ✅ | Backend: unit tests de `StatsService` (conteos, proyecto sin tareas, tendencia con días en 0) + integración de `GET /stats/dashboard` (Supertest, incluye 401 sin sesión). Frontend: tests de `useDashboardStats` (polling) y al menos un componente de gráfico + estado vacío/error de `DashboardPage`. |
| V. Simplicidad | ✅ | No se toca persistencia, auth ni infraestructura. Única dependencia nueva (`recharts`) está justificada arriba; no se introduce librería de gráficos alternativa ni un microservicio de analítica. |
| VI. Contrato de API documentado | ✅ | `GET /stats/dashboard` documentado con `@openapi` en `stats.routes.ts` + schema `DashboardStats` registrado en `config/swagger.ts`. |
| VII. UX consistente | ✅ | Gráficos vía primitivo `chart` de shadcn/ui (mismo sistema que el resto de la UI); reutiliza `EmptyState`/`ErrorState`/`LoadingSpinner` ya existentes; legible en ambos temas porque `chart.tsx` usa variables CSS de shadcn (mismas que ya soportan modo oscuro desde la feature 002). |

Sin filas ❌. No hace falta sección de Complejidad/Desviaciones.

## Estructura de Proyecto

```
backend/src/schemas/stats.schema.ts                          (nuevo)
backend/src/schemas/task.schema.ts                            (modificado: + completedAt)
backend/src/repositories/interfaces/task.repository.interface.ts  (modificado: + findAll())
backend/src/repositories/in-memory/in-memory-task.repository.ts  (modificado: findAll() + set completedAt)
backend/src/services/stats.service.ts                          (nuevo)
backend/src/controllers/stats.controller.ts                     (nuevo)
backend/src/routes/stats.routes.ts                              (nuevo)
backend/src/routes/index.ts                                     (modificado: monta /stats)
backend/src/config/swagger.ts                                   (modificado: + schema DashboardStats)

frontend/src/types/stats.ts                                     (nuevo)
frontend/src/types/task.ts                                      (modificado: + completedAt?)
frontend/src/api/stats.api.ts                                    (nuevo)
frontend/src/components/ui/chart.tsx                            (nuevo, primitivo shadcn/ui)
frontend/src/features/stats/hooks/useDashboardStats.ts          (nuevo)
frontend/src/features/stats/components/StatusDistributionChart.tsx    (nuevo)
frontend/src/features/stats/components/PriorityDistributionChart.tsx  (nuevo)
frontend/src/features/stats/components/ProjectDistributionChart.tsx   (nuevo)
frontend/src/features/stats/components/CompletedTrendChart.tsx        (nuevo)
frontend/src/routes/DashboardPage.tsx                            (nuevo)
frontend/src/App.tsx                                             (modificado: ruta /dashboard)
frontend/src/components/layout/AppHeader.tsx                     (modificado: link a /dashboard)
frontend/package.json                                            (modificado: + recharts)
```

## Fase 0 — Investigación

Dos decisiones técnicas que el spec deja abiertas a criterio de diseño (no son ambigüedades de
negocio, son parámetros de implementación):

1. **Ventana de la tendencia temporal (FR-004)**: el spec pide una tendencia diaria de tareas
   completadas pero no fija cuántos días mostrar. Decisión: **últimos 30 días, incluyendo días con
   0 completadas** (para que el eje temporal del gráfico sea continuo y no tenga huecos). Se
   calcula en el backend con aritmética de fechas nativa (`Date`/`toISOString().slice(0,10)`), sin
   agregar `date-fns` al backend (no está en sus dependencias hoy; agregarlo solo para esto sería
   sobre-ingeniería dado lo simple del cálculo).
2. **Dónde vive la agregación**: se decide calcularla en el backend (`StatsService`) y no en el
   frontend a partir de listas crudas, porque (a) ya existe un endpoint de listado de tareas por
   proyecto pero ninguno "todas las tareas" — traerlas todas al cliente para agregar ahí duplicaría
   lógica de negocio fuera de la capa de services (Principio I), y (b) el polling de 30s (FR-006)
   sería más pesado si cada tick trajera todas las tareas crudas en vez de un resumen ya agregado.

## Fase 1 — Diseño

### Modelo de datos

**Task** (extensión de la entidad existente en `backend/src/schemas/task.schema.ts`):
```ts
export const taskSchema = z.object({
  // ...campos existentes sin cambios...
  completedAt: z.string().datetime().optional(),
});
```
- `completedAt` **no** se agrega a `createTaskSchema` ni `updateTaskSchema`: no es un input de
  usuario. Lo fija el repositorio:
  - En `create()`: si `data.status === 'DONE'` en el momento de creación, `completedAt = now`.
  - En `update()`: si `data.status === 'DONE'` y el `existing.completedAt` todavía no está seteado,
    `completedAt = now`. Si la tarea ya tenía `completedAt` (porque ya pasó por `DONE` antes) y
    vuelve a `DONE` tras haber estado en otro estado, **no se sobrescribe** (coherente con la
    aclaración del spec: "la primera vez que pasa a DONE").
- Las tareas creadas antes de esta feature que ya estén en `DONE` quedan con `completedAt`
  `undefined` hasta que se vuelvan a actualizar (documentado como decisión aceptada en el spec, no
  se migra retroactivamente).

**DashboardStats** (nuevo, `backend/src/schemas/stats.schema.ts`, solo lectura, no persistido):
```ts
export const statsByStatusSchema = z.object({
  TODO: z.number().int().nonnegative(),
  IN_PROGRESS: z.number().int().nonnegative(),
  DONE: z.number().int().nonnegative(),
});

export const statsByPrioritySchema = z.object({
  LOW: z.number().int().nonnegative(),
  MEDIUM: z.number().int().nonnegative(),
  HIGH: z.number().int().nonnegative(),
});

export const projectTaskCountSchema = z.object({
  projectId: z.string().uuid(),
  projectName: z.string(),
  taskCount: z.number().int().nonnegative(),
});

export const completedTrendPointSchema = z.object({
  date: z.string(), // 'YYYY-MM-DD'
  count: z.number().int().nonnegative(),
});

export const dashboardStatsSchema = z.object({
  byStatus: statsByStatusSchema,
  byPriority: statsByPrioritySchema,
  byProject: z.array(projectTaskCountSchema),
  completedTrend: z.array(completedTrendPointSchema),
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
```

**ITaskRepository** (+1 método):
```ts
findAll(): Promise<Task[]>;
```
`InMemoryTaskRepository.findAll()` → `Array.from(this.tasks.values())`.

### Contratos de API

**`GET /api/stats/dashboard`**
- Auth: requiere sesión (mismo middleware `requireAuth` que `/projects` y `/tasks`).
- Request: sin params, sin query, sin body.
- Response `200`:
  ```json
  {
    "byStatus": { "TODO": 5, "IN_PROGRESS": 3, "DONE": 12 },
    "byPriority": { "LOW": 4, "MEDIUM": 10, "HIGH": 6 },
    "byProject": [
      { "projectId": "b1f4...", "projectName": "Website Redesign", "taskCount": 8 },
      { "projectId": "c2a9...", "projectName": "Proyecto nuevo sin tareas", "taskCount": 0 }
    ],
    "completedTrend": [
      { "date": "2026-06-15", "count": 2 },
      { "date": "2026-06-16", "count": 0 }
    ]
  }
  ```
  - `byProject` incluye **todos** los proyectos existentes (Escenario 5 del spec), en orden de
    creación (`findAll()` de `IProjectRepository` ya devuelve ese orden hoy, sin cambios).
  - `completedTrend` siempre trae 30 puntos (uno por día, últimos 30 días hasta hoy), con `count: 0`
    en los días sin tareas completadas.
  - Si no hay proyectos ni tareas: `byStatus`/`byPriority` en 0, `byProject: []`,
    `completedTrend` con 30 puntos en 0 (el frontend decide mostrar el `EmptyState` del escenario 6
    cuando `byProject.length === 0`, no el backend).
- Response `401`: sin cookie de sesión válida (mismo formato `Error` que el resto de la API).
- Sin `404`/`400`: no hay parámetros que validar.

### Componentes de frontend
- `useDashboardStats()`: `useQuery({ queryKey: ['stats', 'dashboard'], queryFn: statsApi.getDashboard, refetchInterval: 30_000 })` — cubre FR-006 (recalcula al entrar por el fetch inicial de React Query, y refresca solo cada 30s mientras el componente está montado).
- `DashboardPage`: maneja los 3 estados de la query (`isLoading` → `LoadingSpinner`, `isError` →
  `ErrorState`, datos con `byProject.length === 0` → `EmptyState`) y si no, renderiza los 4 gráficos
  en un grid de `Card` (mismo patrón visual que `ProjectCard`/`TaskCard`).
- Los 4 componentes de gráfico son "tontos" (reciben los datos ya agregados por props, no hacen
  fetch ni lógica de negocio), para poder testearlos con datos de ejemplo sin mockear la red.

### Quickstart de verificación
1. `npm run dev` en `backend/` y `frontend/`, login como admin.
2. Con la base en memoria vacía (reinicio del backend): entrar a `/dashboard` → debe verse el
   `EmptyState` (escenario 6), no gráficos vacíos ni pantalla en blanco.
3. Crear 2 proyectos; en uno crear 3 tareas (`TODO`, `IN_PROGRESS`, `DONE`) y dejar el otro sin
   tareas. Volver a `/dashboard` → el gráfico por estado muestra 1/1/1, el de por proyecto muestra
   ambos proyectos (uno con 3, el otro con 0 — escenario 5), el de prioridad refleja las
   prioridades elegidas.
4. Mover una tarea a `DONE` desde el Kanban → volver a `/dashboard` (o esperar el polling de 30s)
   → la tendencia diaria debe mostrar +1 en el día de hoy.
5. Mover esa misma tarea de `DONE` a `IN_PROGRESS` y de nuevo a `DONE` → la tendencia **no** debe
   duplicar el conteo de hoy (verifica la regla de "solo la primera vez").
6. Apagar el backend con el dashboard abierto → tras el siguiente polling (≤30s) debe aparecer el
   `ErrorState`, sin romper el resto de la SPA (navegar a `/` debe seguir funcionando).
7. Alternar el toggle de tema claro/oscuro con el dashboard abierto (NFR-001) → los 4 gráficos
   deben seguir siendo legibles en ambos temas.
8. `npm run lint` y `npm test` en `backend/` y `frontend/` deben pasar, incluyendo los tests nuevos
   de `StatsService`, la ruta `/stats/dashboard` y los componentes de `features/stats`.
