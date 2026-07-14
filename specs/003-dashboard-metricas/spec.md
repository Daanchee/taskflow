# Spec: Dashboard de métricas

**ID**: `003-dashboard-metricas` | **Estado**: Borrador | **Creado**: 2026-07-14
**Input**: descripción original del usuario → "Dashboard de métricas: un panel que muestre visualizaciones agregadas del estado de los proyectos y tareas en TaskFlow — por ejemplo cantidad de tareas por estado (To Do / In Progress / Done), distribución de tareas por proyecto, carga de trabajo por persona asignada, y tendencia de tareas completadas en el tiempo. Pensado para dar valor a stakeholders no técnicos y mostrar manejo de datos agregados/visualización de datos."

> Nota de alcance acordada con el usuario: TaskFlow no tiene campo de "asignado" en las tareas ni
> multi-usuario (es un sistema de admin único). Se decidió **sacar** la métrica de "carga de
> trabajo por persona asignada" de esta feature en vez de agregar un campo nuevo al modelo de
> datos. Ver "Fuera de Alcance".

## Escenarios de Usuario y Testing

### Historia principal
Como administrador de TaskFlow, quiero ver un panel de métricas agregadas de mis proyectos y
tareas para entender de un vistazo el estado general del trabajo, sin tener que revisar tablero
por tablero.

### Escenarios (Given/When/Then)
1. **Given** que existen varios proyectos con tareas en distintos estados, **When** el admin abre
   el dashboard, **Then** ve el conteo total de tareas agrupado por estado (`TODO`,
   `IN_PROGRESS`, `DONE`) reflejando los datos reales en ese momento.
2. **Given** que hay tareas repartidas en varios proyectos, **When** el admin abre el dashboard,
   **Then** ve cuántas tareas tiene cada proyecto.
3. **Given** que hay tareas con distintas prioridades, **When** el admin abre el dashboard,
   **Then** ve la distribución de tareas por prioridad (`LOW`, `MEDIUM`, `HIGH`).
4. **Given** que existen tareas marcadas como `DONE` en distintos momentos, **When** el admin abre
   el dashboard, **Then** ve una tendencia de tareas completadas a lo largo del tiempo.
5. **Given** un proyecto sin ninguna tarea creada, **When** se muestra la distribución por
   proyecto, **Then** ese proyecto aparece listado con 0 tareas (no se omite de la vista).
6. **Given** que todavía no existe ningún proyecto ni tarea en el sistema, **When** el admin abre
   el dashboard, **Then** ve un estado vacío explicativo, no gráficos vacíos ni una pantalla en
   blanco.

### Casos de error
- Si la carga de datos del dashboard falla (error de red o del servidor), el sistema debe mostrar
  un mensaje de error claro, sin dejar la pantalla en blanco ni romper el resto de la aplicación.
- El dashboard debe poder mostrarse sin que el admin tenga que seleccionar un proyecto puntual
  primero (es un resumen global por defecto).

## Requisitos

### Funcionales
- **FR-001**: El sistema DEBE mostrar el conteo total de tareas agrupado por estado (`TODO`,
  `IN_PROGRESS`, `DONE`).
- **FR-002**: El sistema DEBE mostrar la cantidad de tareas por proyecto, incluyendo los proyectos
  que todavía no tienen tareas (mostrados con 0).
- **FR-003**: El sistema DEBE mostrar la distribución de tareas por prioridad (`LOW`, `MEDIUM`,
  `HIGH`).
- **FR-004**: El sistema DEBE mostrar una tendencia temporal de tareas completadas (estado
  `DONE`), agrupada por día. Cada tarea aporta a la tendencia según su fecha de completado,
  registrada en un campo `completedAt` que se fija automáticamente la primera vez que la tarea
  pasa a estado `DONE` (ver "Entidades Clave" para el impacto en el modelo de `Task`).
- **FR-005**: Los usuarios DEBEN poder acceder al dashboard como una vista separada del tablero
  Kanban, desde la navegación principal de la aplicación.
- **FR-006**: El sistema DEBE refrescar las métricas automáticamente mientras el dashboard está
  abierto (polling periódico), sin que el usuario tenga que recargar la página manualmente, además
  de recalcularlas al entrar. El intervalo de refresco por defecto es de 30 segundos
  `[intervalo ajustable en /plan si el diseño técnico lo justifica]`.
- **FR-007**: El sistema DEBE mostrar un estado vacío distinguible cuando no hay proyectos o
  tareas creadas, en vez de gráficos vacíos sin contexto (cubre el escenario 6).
- **FR-008**: El sistema DEBE manejar errores de carga de datos mostrando un mensaje al usuario,
  sin dejar la pantalla en blanco ni romper la aplicación (cubre el caso de error).

### No funcionales
- **NFR-001**: El dashboard DEBE ser legible tanto en tema claro como en tema oscuro, en línea con
  la feature de modo oscuro ya existente en la aplicación (no depender únicamente del color para
  transmitir información en los gráficos).

## Entidades Clave
Esta feature no introduce entidades nuevas, pero sí extiende una existente:
- **Task** (ya existente): se agrupa por `status`, `priority` y `projectId` para las métricas de
  conteo y distribución. Además, se le agrega el campo `completedAt` (fecha, opcional, se fija
  automáticamente la primera vez que la tarea pasa a estado `DONE`) para poder calcular la
  tendencia temporal de FR-004. Las tareas creadas antes de esta feature no tienen `completedAt`
  aunque ya estén en `DONE` (no se migran datos históricos retroactivamente).
- **Project** (ya existente, sin cambios): se usa como dimensión de agrupación para la
  distribución de tareas por proyecto.

## Fuera de Alcance
- Carga de trabajo por persona asignada: TaskFlow no tiene campo de "asignado" en Task ni
  multi-usuario (es admin único). Se decidió explícitamente no agregar ese campo para esta
  feature.
- Exportar el dashboard a PDF, CSV o cualquier otro formato.
- Filtros avanzados o selección de rangos de fechas personalizados más allá de la tendencia
  temporal definida en FR-004.
- Permisos o vistas de dashboard diferenciadas por rol (el sistema sigue siendo de admin único).
- Alertas o notificaciones disparadas por umbrales de métricas.

## Aclaraciones

### 2026-07-14
- **P: Para la tendencia de tareas completadas (FR-004), ¿qué fecha se usa como "fecha de
  completado" si Task no tiene `completedAt`?** → R: se agrega un campo `completedAt` nuevo a
  Task, fijado automáticamente la primera vez que pasa a `DONE`. Las tareas históricas ya en
  `DONE` no se migran retroactivamente.
- **P: ¿Con qué granularidad se agrupa la tendencia temporal (FR-004)?** → R: diaria (un punto por
  día).
- **P: ¿Las métricas del dashboard deben actualizarse solas mientras está abierto, o alcanza con
  recalcular al entrar/recargar (FR-006)?** → R: polling en vivo mientras el dashboard está
  abierto, con un intervalo por defecto de 30 segundos (ajustable en `/plan` si el diseño técnico
  lo justifica), además de recalcular al entrar.

## Checklist de Revisión
- [x] Sin detalles de implementación (lenguaje, librerías, endpoints, esquemas)
- [x] Enfocado en valor de usuario y comportamiento observable
- [x] Todos los requisitos son verificables (o marcados `[NEEDS CLARIFICATION]`)
- [x] Alcance delimitado explícitamente
- [x] Sin `[NEEDS CLARIFICATION]` pendientes antes de pasar a `/plan`
