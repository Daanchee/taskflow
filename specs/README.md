# Specs

Cada carpeta `NNN-slug/` es una feature gestionada con el flujo Spec-Driven Development (SDD)
definido en `.specify/memory/constitution.md`:

```
specs/
  001-primera-feature/
    spec.md    # generado por /specify — qué y para quién
    plan.md    # generado por /plan — diseño técnico + Constitution Check
    tasks.md   # generado por /tasks — tareas atómicas y ordenadas
```

Flujo: `/specify` → (`/clarify` si quedan ambigüedades) → `/plan` → `/tasks` → `/implement`.

Cada comando lee solo el artefacto de la fase anterior, no el historial de chat completo — así el
contexto que hay que volver a cargar en cada paso es mínimo.
