# Plan: Modo Oscuro

**Spec**: `specs/002-modo-oscuro/spec.md` | **Estado**: Borrador | **Creado**: 2026-07-09

## Resumen
Feature 100% frontend: un botón en `AppHeader` alterna entre tema claro y oscuro. En vez de
escribir un Context/hook propio, se usa `next-themes` — ya está en `package.json` (lo trajo el
CLI de shadcn/ui al scaffoldear `components/ui/sonner.tsx`, que ya espera un `ThemeProvider` de
esta librería y hoy no lo tiene). Su modo `attribute="class"` alterna la clase `.dark` en
`<html>`, que ya tiene todas las variables CSS definidas en `index.css`; su modo
`defaultTheme="system"` resuelve el tema inicial contra el sistema operativo cuando no hay
preferencia guardada, y al llamar `setTheme('light' | 'dark')` explícito deja de escuchar cambios
del sistema operativo — mapea 1 a 1 con FR-003/004/006 sin lógica adicional. `next-themes`
también inyecta su propio script inline para fijar la clase antes del primer paint, así que no
hace falta tocar `index.html` a mano para evitar el parpadeo (NFR-002).

## Contexto Técnico
- **Backend afectado**: ninguno. No hay endpoints, esquemas ni persistencia del lado del
  servidor — la preferencia vive en `localStorage` del navegador (coincide con "Fuera de Alcance"
  del spec: no se sincroniza entre dispositivos).
- **Frontend afectado**:
  - Nuevo: `features/theme/components/ThemeToggle.tsx`,
    `features/theme/components/ThemeToggle.test.tsx`.
  - Modificado: `main.tsx` (envuelve `<App />`/`<Toaster />` con `ThemeProvider` de
    `next-themes`), `components/layout/AppHeader.tsx` (agrega `<ThemeToggle />`),
    `test/test-utils.tsx` (agrega `ThemeProvider` a `AllProviders` para que los tests de
    componentes que usan `useTheme()` no rompan), `test/setup.ts` (agrega un mock de
    `window.matchMedia`, que jsdom no implementa y que `next-themes` necesita para resolver la
    preferencia del sistema operativo).
- **Esquemas Zod nuevos/modificados**: ninguno.
- **Endpoints nuevos/modificados**: ninguno.
- **Dependencias nuevas**: ninguna — `next-themes` ya está en `frontend/package.json` (dependencia
  existente sin usar todavía; hoy `Toaster` importa `useTheme` de ahí pero como no hay
  `ThemeProvider` en el árbol, siempre cae al default `"system"` sin resolver de verdad. Este plan
  además corrige ese detalle preexistente al agregar el `ThemeProvider` real).

## Constitution Check

| Principio | Cumple | Nota |
|---|---|---|
| I. Arquitectura en capas | ✅ | No aplica — feature 100% frontend, no toca `routes/controllers/services/repositories`. |
| II. Zod como fuente única | ✅ | No aplica — no hay inputs de usuario que validar (no es un formulario). |
| III. Tipado estricto | ✅ | Sin `any`; `useTheme()` de `next-themes` ya viene tipado. |
| IV. Testing obligatorio | ✅ | Test de componente de `ThemeToggle`: estado inicial según `matchMedia` mockeado, y que el click alterna el `aria-label`/ícono y llama a `setTheme` con el valor explícito opuesto. |
| V. Simplicidad | ✅ | Reutiliza `next-themes`, ya instalado, en vez de escribir un Context propio o traer otra librería. |
| VI. Contrato de API documentado | ✅ | No aplica — no hay endpoints nuevos. |
| VII. UX consistente | ✅ | `ThemeToggle` usa `Button` de shadcn/ui + ícono de `lucide-react`, mismo patrón visual que el botón "Cerrar sesión" ya existente en `AppHeader`. |

Sin ❌ — no aplica sección de Complejidad/Desviaciones.

## Estructura de Proyecto

```
frontend/src/main.tsx                                        (mod)
frontend/src/components/layout/AppHeader.tsx                 (mod)
frontend/src/features/theme/components/ThemeToggle.tsx       (nuevo)
frontend/src/features/theme/components/ThemeToggle.test.tsx  (nuevo)
frontend/src/test/test-utils.tsx                              (mod)
frontend/src/test/setup.ts                                    (mod)
```

## Fase 1 — Diseño

### Modelo de datos
No aplica — no hay entidades de dominio. El único "dato" es la preferencia de tema, que
`next-themes` guarda como el string `'light'` o `'dark'` en `localStorage` bajo la key
`taskflow-theme` (se fija explícito vía `storageKey` en vez de dejar el default `'theme'` de la
librería, para que no choque con otras apps corriendo en el mismo dominio en `localhost`).

### Componentes y contratos internos

**`main.tsx`** — envuelve el árbol con:
```tsx
<ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="taskflow-theme">
  <App />
  <Toaster />
</ThemeProvider>
```
Ubicado dentro de `QueryClientProvider`/`BrowserRouter` (no depende de ellos ni al revés, el
orden entre estos tres providers es indistinto).

**`features/theme/components/ThemeToggle.tsx`**:
- Usa `const { resolvedTheme, setTheme } = useTheme()` de `next-themes`.
- `isDark = resolvedTheme === 'dark'`.
- Botón `Button` (`variant="outline"`, `size="sm"`, mismo tamaño que "Cerrar sesión"): ícono
  `Sun` (de `lucide-react`) si `isDark`, `Moon` si no; `onClick` llama
  `setTheme(isDark ? 'light' : 'dark')` (siempre un valor explícito, nunca `'system'`, para
  cumplir FR-006: una vez elegido manualmente, no se vuelve a seguir al sistema operativo).
- `aria-label` dinámico: `"Cambiar a tema claro"` / `"Cambiar a tema oscuro"` según corresponda
  (NFR-001).

**`components/layout/AppHeader.tsx`**: agrega `<ThemeToggle />` en el mismo contenedor flex que
el botón "Cerrar sesión", antes de este (orden: toggle de tema, luego cerrar sesión).

**`test/test-utils.tsx`**: `AllProviders` pasa a envolver también con
`<ThemeProvider attribute="class" storageKey="taskflow-theme">`, mismo `storageKey` que
producción para que los tests ejerciten el mismo código de lectura/escritura de `localStorage`.

**`test/setup.ts`**: agrega antes de los tests (o dentro de un `beforeEach`) un mock de
`window.matchMedia` que devuelva `matches: false` por default (jsdom no lo implementa; sin este
mock, `next-themes` con `enableSystem` tira `TypeError: window.matchMedia is not a function` en
cualquier test que renderice algo envuelto en `ThemeProvider`).

### Quickstart de verificación
1. `cd frontend && npm run dev`, abrir con las DevTools del navegador forzando
   `prefers-color-scheme: dark` (Chrome DevTools → Rendering → "Emulate CSS media feature
   prefers-color-scheme" → `dark`) y `localStorage` vacío → la app carga directamente en tema
   oscuro (FR-004), sin parpadeo del tema claro (NFR-002).
2. Click en el ícono de tema del `AppHeader` → la interfaz entera cambia a claro al instante, sin
   recargar (FR-001, FR-002); el ícono y su `aria-label` cambian de acuerdo al nuevo tema (FR-005).
3. Recargar la página (F5) → sigue en tema claro, el que se eligió manualmente (FR-003).
4. Con las DevTools, cambiar la emulación a `prefers-color-scheme: light` sin tocar el toggle,
   recargar → la app sigue en tema claro (coincide, no distingue este caso de FR-006 por sí solo);
   repetir cambiando la emulación a `dark` y recargando → la app **sigue en claro** (FR-006: la
   elección manual ignora el cambio del sistema operativo).
5. Ir a `/login` (cerrar sesión primero) → se ve en el mismo tema claro elegido (FR-007).
6. Borrar `taskflow-theme` de `localStorage` y recargar con la emulación en `dark` → la app vuelve
   a arrancar en oscuro (sin preferencia guardada, vuelve a seguir al sistema operativo).
7. `npm test` en `frontend/` → todo verde, incluyendo el test nuevo de `ThemeToggle`.
