<!--
SYNC IMPACT REPORT
Versión: (ninguna) → 1.0.0
Tipo de cambio: ratificación inicial
Principios añadidos: I–VII (todos, nuevos)
Plantillas revisadas:
  ✅ .specify/templates/spec-template.md — alineado (sin detalles de implementación)
  ✅ .specify/templates/plan-template.md — Constitution Check referencia estos principios
  ✅ .specify/templates/tasks-template.md — orden TDD y fases alineadas con Principio IV
Seguimientos pendientes: ninguno
-->

# Constitución de TaskFlow

## Núcleo de Principios

### I. Arquitectura en Capas (NON-NEGOTIABLE)
El flujo de datos es siempre `routes → controllers → services → repositories (interfaz)`.
Los `services` **solo** conocen interfaces (`IProjectRepository`, `ITaskRepository`), nunca una
implementación concreta. Cualquier cambio de persistencia (ej. introducir Postgres) debe limitar
su alcance a una nueva implementación de repositorio más el composition root
(`backend/src/repositories/index.ts`); ningún controller o service se modifica para ese fin.

### II. Zod como Fuente Única de Verdad
Toda validación de entrada (backend) y de formularios (frontend) se define con esquemas Zod, de
los que se infieren los tipos de TypeScript (`z.infer`). No se define un tipo manual allí donde
Zod ya lo puede inferir, y no se valida "a mano" allí donde un `.parse`/`.safeParse` sea posible.

### III. Tipado Estricto de Punta a Punta
TypeScript estricto en backend y frontend. `any` requiere justificación explícita en el propio
código (comentario) y en el plan de la feature que lo introduce. Los tipos de dominio compartidos
entre capas se derivan de Zod, no se duplican.

### IV. Testing Obligatorio (NON-NEGOTIABLE)
- Backend: Vitest + Supertest — unit tests de repositories/services e integración de rutas.
- Frontend: Vitest + React Testing Library — formularios, interacciones críticas y regresiones
  de bugs reales encontrados.
Ninguna feature se considera terminada sin tests que cubran su camino feliz y al menos un caso de
error/borde. Los tests se escriben antes o junto con el código que ejercitan, nunca como una tarea
"aparte" al final.

### V. Simplicidad y Anti-Sobreingeniería
No se introduce infraestructura (bases de datos, autenticación, colas, microservicios, workspaces
de monorepo) hasta que una feature concreta lo requiera. Ante dos soluciones válidas, se elige la
más simple que resuelva el problema actual. Lo que se pospone a propósito se deja explícito en el
spec o el plan de la feature, no se omite en silencio.

### VI. Contrato de API Documentado
Todo endpoint nuevo o modificado se documenta en Swagger/OpenAPI (`swagger-jsdoc`) en el mismo
cambio que lo introduce. El contrato expuesto en `/api-docs` nunca queda desactualizado respecto
al código.

### VII. Experiencia de Usuario Consistente
La UI se construye con TailwindCSS + shadcn/ui, sin mezclar otra librería de componentes.
Operaciones que afectan estado compartido entre vistas (ej. drag & drop del tablero) usan
actualizaciones optimistas vía TanStack React Query, con rollback automático si la petición falla.

## Restricciones Técnicas Adicionales

- Stack fijo: Node.js + TypeScript + Express (backend), React + TypeScript + Vite (frontend).
  Cambiarlo requiere justificación explícita y aprobación directa del usuario, no una decisión
  tomada dentro de un plan.
- Monorepo simple de dos carpetas (`backend`/`frontend`), cada una con su propio `package.json`.
  No se adoptan pnpm workspaces / Turborepo salvo que el número de paquetes crezca de verdad.
- `docker-compose.yml` debe seguir levantando todo el stack con un solo comando; cualquier
  servicio nuevo (ej. una base de datos) se agrega ahí.
- El CI (`.github/workflows/ci.yml`) corre lint + tests + build en cada push. Ningún cambio se da
  por completo si rompe CI.

## Flujo de Desarrollo (Spec-Driven Development)

1. **`/constitution`** — este documento. Se toca solo cuando cambian principios de fondo, no en
   cada feature.
2. **`/specify`** — describe QUÉ se construye y PARA QUIÉN, sin detalles de implementación.
   Genera `specs/<NNN-slug>/spec.md`.
3. **`/clarify`** (opcional pero recomendado) — resuelve ambigüedades marcadas en el spec antes
   de planear, para no rehacer trabajo más adelante.
4. **`/plan`** — traduce el spec en decisiones técnicas concretas (capas afectadas, esquemas Zod,
   endpoints, componentes). Genera `specs/<NNN-slug>/plan.md` (y `data-model.md`/`contracts/`
   cuando aplique).
5. **`/tasks`** — descompone el plan en tareas atómicas, ordenadas y verificables. Genera
   `specs/<NNN-slug>/tasks.md`.
6. **`/implement`** — ejecuta las tareas en orden, marcándolas como completadas y corriendo tests
   y lint en los checkpoints.

Cada fase lee **solo** el artefacto de la fase anterior (más esta constitución), nunca todo el
historial de conversación: el spec no necesita el chat previo, el plan solo necesita el spec, las
tareas solo necesitan el plan, la implementación solo necesita las tareas. Así el contexto que se
vuelve a cargar en cada paso es mínimo.

## Gobernanza

- Esta constitución prevalece sobre cualquier práctica ad-hoc. Un plan que se desvíe de un
  principio debe justificarlo explícitamente en su sección "Complejidad/Desviaciones".
- Modificarla requiere: (a) una razón explícita, (b) actualizar la versión semántica de abajo,
  (c) revisar si algún spec/plan en curso deja de cumplirla.
- Versionado semántico: MAJOR = eliminar o redefinir un principio de forma incompatible; MINOR =
  añadir un principio o sección nueva; PATCH = aclaración o redacción sin cambio de sentido.

**Versión**: 1.0.0 | **Ratificada**: 2026-07-07 | **Última modificación**: 2026-07-07
