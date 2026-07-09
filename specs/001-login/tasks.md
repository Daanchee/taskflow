# Tasks: Login

**Plan**: `specs/001-login/plan.md` | **Estado**: Completa | **Creado**: 2026-07-08

Convenciones: `[P]` = puede ejecutarse en paralelo (toca archivos distintos e independientes sin
dependencias entre sí). Cada tarea trae la ruta de archivo exacta. Los tests van antes que la
implementación que cubren (Principio IV). Las rutas de test de backend siguen la convención real
del repo (`backend/tests/unit/...`, `backend/tests/integration/...`), no `src/**/*.test.ts`.

## Fase 1 — Setup
- [x] T001 [P] Agregar `cookie-parser` y `@types/cookie-parser` a `backend/package.json`
      (`npm install cookie-parser` + `npm install -D @types/cookie-parser` en `backend/`)
- [x] T002 [P] Agregar `ADMIN_USERNAME` (default `admin`), `ADMIN_PASSWORD` (sin default,
      requerido), `SESSION_COOKIE_NAME` (default `taskflow_session`) al schema Zod de
      `backend/src/config/env.ts`
- [x] T003 [P] Documentar las variables nuevas (sin el valor real) en `backend/.env.example`
      (además: `vitest.config.ts` recibió un `ADMIN_PASSWORD` de fixture para que los tests no
      dependan de `.env` local, y `backend/.env` local se completó con `ADMIN_PASSWORD=312` para
      desarrollo manual — no versionado)

## Fase 2 — Tests (antes que el código que cubren)
- [x] T004 [P] Test unitario de `InMemorySessionRepository` (`create`/`exists`/`delete`) en
      `backend/tests/unit/repositories/in-memory-session.repository.test.ts`
- [x] T005 [P] Test unitario de `AuthService` (login con credenciales correctas/incorrectas,
      logout, validación de sesión) en `backend/tests/unit/services/auth.service.test.ts`
- [x] T006 [P] Test de integración de `POST /api/auth/login`, `POST /api/auth/logout`,
      `GET /api/auth/me` (incluye caso 401 con mensaje genérico y caso de éxito con
      `Set-Cookie` sin `Max-Age`) en `backend/tests/integration/auth.routes.test.ts`
- [x] T007 [P] Test de integración de `requireAuth` bloqueando `GET /api/projects` sin cookie de
      sesión (401) y permitiéndolo con sesión válida, en
      `backend/tests/integration/auth.routes.test.ts` (mismo archivo que T006, agregar después)
- [x] T008 [P] Test de componente de `LoginForm` (submit válido dispara `onSubmit`, credenciales
      inválidas muestran mensaje de error genérico) en
      `frontend/src/features/auth/components/LoginForm.test.tsx`
- [x] T009 [P] Test de `RequireAuth` (redirige a `/login` sin sesión, renderiza `children`/
      `Outlet` con sesión válida) en `frontend/src/routes/RequireAuth.test.tsx`

## Fase 3 — Backend Core
- [x] T010 Esquema Zod `loginSchema` en `backend/src/schemas/auth.schema.ts`
- [x] T011 Agregar `UnauthorizedError` (401, code `UNAUTHORIZED`) en
      `backend/src/errors/app-error.ts`
- [x] T012 `ISessionRepository` en
      `backend/src/repositories/interfaces/session.repository.interface.ts`
- [x] T013 `InMemorySessionRepository` en
      `backend/src/repositories/in-memory/in-memory-session.repository.ts` (implementa T012,
      hace pasar T004)
- [x] T014 Agregar `sessionRepository` a `Repositories` y a `createRepositories()` en
      `backend/src/repositories/index.ts`
- [x] T015 `AuthService` (login con `crypto.timingSafeEqual`, logout, validateSession) en
      `backend/src/services/auth.service.ts` (hace pasar T005)
- [x] T016 `AuthController` (login/logout/me, set/clear cookie httpOnly sin `Max-Age`) en
      `backend/src/controllers/auth.controller.ts`
- [x] T017 `requireAuth` middleware (factory que recibe `AuthService`) en
      `backend/src/middlewares/require-auth.middleware.ts`
- [x] T018 Router de auth + doc `@openapi` de los 3 endpoints en
      `backend/src/routes/auth.routes.ts` (hace pasar T006)
- [x] T019 Montar `/auth` sin protección y envolver `/projects` y `/` (tasks) con `requireAuth`
      en `backend/src/routes/index.ts` (hace pasar T007)
- [x] T020 Habilitar `cors({ origin: env.CORS_ORIGIN, credentials: true })` y `app.use(cookieParser())`
      en `backend/src/app.ts`

## Fase 4 — Frontend Core
- [x] T021 [P] Tipos `Session`/`LoginPayload` en `frontend/src/types/auth.ts`
- [x] T022 [P] Agregar `credentials: 'include'` al `fetch` de `frontend/src/api/http-client.ts`
- [x] T023 Cliente de API `authApi` (`login`, `logout`, `me`) en `frontend/src/api/auth.api.ts`
      (depende de T021/T022)
- [x] T024 [P] Hook `useSession` (React Query, `queryKey: ['session']`, `retry: false`) en
      `frontend/src/features/auth/hooks/useSession.ts`
- [x] T025 [P] Hooks `useLogin`/`useLogout` en
      `frontend/src/features/auth/hooks/useAuthMutations.ts` (ajuste sobre el plan: en vez de
      `invalidateQueries` usan `setQueryData(['session'], ...)` directo con la respuesta de
      login/logout — evita un round-trip extra a `/auth/me` justo después de loguear)
- [x] T026 `LoginForm` (react-hook-form + `zodResolver`, componentes shadcn/ui) en
      `frontend/src/features/auth/components/LoginForm.tsx` (hace pasar T008)
- [x] T027 `LoginPage` en `frontend/src/routes/LoginPage.tsx` (usa `LoginForm`)
- [x] T028 `RequireAuth` (usa `useSession`, redirige a `/login` si no hay sesión) en
      `frontend/src/routes/RequireAuth.tsx` (hace pasar T009)
- [x] T029 Ruta pública `/login` + envolver `AppShell` con `RequireAuth` en
      `frontend/src/App.tsx`
- [x] T030 Botón "Cerrar sesión" (usa `useLogout`) en
      `frontend/src/components/layout/AppHeader.tsx`

## Fase 5 — Integración y Pulido
- [x] T031 Revisar la tabla Constitution Check de `plan.md` contra el resultado real (verificado:
      capas, sin `any`, 3 `@openapi`, `cors`+`cookieParser` en `app.ts`, env vars en `env.ts`,
      `UnauthorizedError` en `app-error.ts` — todo coincide, sin desviaciones)
- [x] T032 Correr `npm run lint` y `npm test` en `backend/` y en `frontend/` (backend: lint limpio,
      51/51 tests; frontend: lint solo warnings preexistentes no relacionados con auth, 26/26 tests)
- [x] T033 Ejecutar el quickstart de verificación de `plan.md` (pasos 1-8, manual). Backend
      (curl): pasos 2-6 correctos (401 sin sesión, `Set-Cookie` sin `Max-Age` en login, acceso
      autenticado, logout 204, 401 tras logout). Frontend (Playwright headless contra el dev
      server real): se detectó y corrigió un bug — tras un login exitoso la app se quedaba en
      `/login` porque `LoginForm.onSubmit` nunca navegaba; se agregó
      `navigate('/', { replace: true })` tras `login.mutateAsync` en
      `frontend/src/features/auth/components/LoginForm.tsx`. Reverificado: login correcto → `/`,
      F5 mantiene sesión, botón "Cerrar sesión" → `/login` + `/api/projects` vuelve a dar 401.
      Paso 8 (`npm test`) ya cubierto por T032.

      **Confirmado en producción** (Vercel + Render): se detectó un segundo bug, esta vez de
      infraestructura — frontend (`vercel.app`) y backend (`onrender.com`) en dominios distintos
      hacían que el navegador tratara la cookie de sesión como de tercero y la descartara tras un
      login "exitoso" (200 OK sin sesión real persistida). Corregido con
      `frontend/vercel.json` (rewrite de `/api/*` hacia Render server-to-server + fallback SPA a
      `index.html`) y `VITE_API_URL=/api` en las env vars de Vercel, para que la cookie quede
      first-party. Reverificado con Playwright contra las URLs reales: `/login` directo ya no da
      404, login → `/`, cookie `taskflow_session` persiste (`Secure`, `HttpOnly`, `SameSite=Lax`),
      F5 mantiene sesión, logout vuelve a `/login` e invalida el acceso a `/api/projects`.

## Dependencias
- Fase 1 (T001-T003) antes que Fase 3 (necesita `cookie-parser` instalado y las env vars
  definidas antes de escribir código que las use).
- Fase 2 (T004-T009) antes que la implementación que cubre cada test: T004→T013, T005→T015,
  T006/T007→T018/T019, T008→T026, T009→T028.
- Dentro de Fase 3: T010/T011/T012 son la base → T013 (depende de T012) → T014 (depende de T013)
  → T015 (depende de T010, T014) → T016 (depende de T015) → T017 (depende de T015) → T018
  (depende de T010, T016, T017) → T019 (depende de T017, T018) → T020 (depende de T001,
  independiente del resto de la fase salvo que debe estar antes de correr T006/T007 en la
  práctica).
- Fase 4 puede empezar cuando T018/T019/T020 (endpoints reales) estén disponibles para probar
  manualmente, aunque T021-T025 (tipos, cliente, hooks) son independientes entre sí y de backend
  en cuanto a compilación. T026 depende de T023/T025. T027 depende de T026. T028 depende de
  T024. T029 depende de T027, T028. T030 depende de T025.
- Fase 5 al final, siempre.
