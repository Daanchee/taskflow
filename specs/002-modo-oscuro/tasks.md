# Tasks: Modo Oscuro

**Plan**: `specs/002-modo-oscuro/plan.md` | **Estado**: Completa | **Creado**: 2026-07-09

Convenciones: `[P]` = puede ejecutarse en paralelo (toca archivos distintos e independientes sin
dependencias entre sí). Cada tarea trae la ruta de archivo exacta. Los tests van antes que la
implementación que cubren (Principio IV). Esta feature es 100% frontend (sin backend, sin Zod,
sin endpoints — ver plan.md), así que no hay fase de "Backend Core".

## Fase 1 — Setup (infraestructura de tests)
- [x] T001 [P] Mock de `window.matchMedia` (default `matches: false`) en
      `frontend/src/test/setup.ts` — sin esto, cualquier test que renderice algo envuelto en el
      `ThemeProvider` de `next-themes` con `enableSystem` falla con
      `TypeError: window.matchMedia is not a function` (jsdom no lo implementa).
- [x] T002 [P] Envolver `AllProviders` con `<ThemeProvider attribute="class"
      storageKey="taskflow-theme">` (de `next-themes`) en `frontend/src/test/test-utils.tsx`,
      mismo `storageKey` que se usará en producción.

## Fase 2 — Tests (antes que el código que cubren)
- [x] T003 Test de componente de `ThemeToggle` en
      `frontend/src/features/theme/components/ThemeToggle.test.tsx` (depende de T001, T002):
      - Estado inicial: con `matchMedia` mockeado en `false` (preferencia de sistema = claro),
        el botón muestra el ícono/`aria-label` de "Cambiar a tema oscuro".
      - Al hacer click, el `aria-label` y el ícono cambian a los de "Cambiar a tema claro" (o
        viceversa según el estado previo).
      - El click deja fijado un valor explícito (`'light'` o `'dark'`) — no `'system'` — para
        que quede trazado el cumplimiento de FR-006 (una vez elegido a mano, no se vuelve a
        seguir al sistema operativo).

## Fase 3 — Frontend Core
- [x] T004 [P] Componente `ThemeToggle` (usa `useTheme()` de `next-themes`, `Button` de
      shadcn/ui, íconos `Sun`/`Moon` de `lucide-react`, `aria-label` dinámico) en
      `frontend/src/features/theme/components/ThemeToggle.tsx` (hace pasar T003)
- [x] T005 [P] Envolver `<App />` y `<Toaster />` con `<ThemeProvider attribute="class"
      defaultTheme="system" enableSystem storageKey="taskflow-theme">` (de `next-themes`) en
      `frontend/src/main.tsx`
- [x] T006 Agregar `<ThemeToggle />` al contenedor flex de `AppHeader`, antes del botón
      "Cerrar sesión", en `frontend/src/components/layout/AppHeader.tsx` (depende de T004)

## Fase 4 — Integración y Pulido
- [x] T007 Revisar la tabla Constitution Check de `plan.md` contra el resultado real (verificado:
      `git status` confirma que solo se tocó `frontend/`, sin `any` nuevo, sin dependencias
      nuevas — `next-themes` ya estaba en `package.json` — mismo patrón visual que el botón
      "Cerrar sesión" existente)
- [x] T008 Correr `npm run lint` y `npm test` en `frontend/` (lint: solo warnings preexistentes
      no relacionados; tests: 9 archivos / 29 tests, todos verdes, incluyendo los 3 nuevos de
      `ThemeToggle`)
- [x] T009 Ejecutar el quickstart de verificación de `plan.md` (con Playwright emulando
      `colorScheme` en vez de DevTools manuales, mismo efecto). Resultado: sistema=dark sin
      preferencia guardada → arranca oscuro (FR-004); click en el toggle → pasa a claro al
      instante (FR-001/002, screenshots confirman el cambio visual completo); F5 con sistema
      todavía en dark → sigue en claro, `localStorage.taskflow-theme=light` (FR-003 y FR-006: la
      elección manual ignora el sistema); logout → `/login` se ve en el mismo tema claro
      (FR-007); contexto nuevo sin `localStorage` con sistema=dark → vuelve a arrancar oscuro.

## Dependencias
- Fase 1 (T001-T002) antes que Fase 2 (T003 necesita el mock de `matchMedia` y el
  `ThemeProvider` en `test-utils.tsx` para poder renderizar `ThemeToggle` en el test).
- Fase 2 (T003) antes que la implementación que cubre: T003 → T004.
- Dentro de Fase 3: T004 y T005 son independientes entre sí (archivos distintos, ninguno importa
  al otro) → `[P]`. T006 depende de T004 (importa `ThemeToggle`); para que el quickstart manual
  funcione de punta a punta hace falta que T005 y T006 estén hechas, aunque no haya dependencia
  de compilación entre ellas.
- Fase 4 al final, siempre.
