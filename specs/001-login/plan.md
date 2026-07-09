# Plan: Login

**Spec**: `specs/001-login/spec.md` | **Estado**: Borrador | **Creado**: 2026-07-08

## Resumen
Login de administrador único (`admin`/`312` vía variables de entorno) con sesión basada en
cookie httpOnly de tipo "session cookie" (sin `Max-Age`, muere al cerrar el navegador, sobrevive a
recargas). El backend valida credenciales contra `env.ADMIN_USERNAME`/`env.ADMIN_PASSWORD` y
emite un token de sesión opaco guardado en memoria (mismo patrón Repository que
proyectos/tareas); un middleware `requireAuth` protege `/api/projects` y `/api/tasks`. El
frontend agrega una pantalla de login, un hook de sesión (`useSession`) que consulta
`GET /api/auth/me` al montar la app, y una guarda de ruta que redirige a `/login` sin sesión
válida.

## Contexto Técnico
- **Backend afectado**:
  - Nuevo: `repositories/interfaces/session.repository.interface.ts`,
    `repositories/in-memory/in-memory-session.repository.ts`, `services/auth.service.ts`,
    `controllers/auth.controller.ts`, `routes/auth.routes.ts`,
    `middlewares/require-auth.middleware.ts`, `schemas/auth.schema.ts`.
  - Modificado: `repositories/index.ts` (agrega `sessionRepository`), `routes/index.ts` (monta
    `/auth` sin protección y envuelve `/projects` y `/` (tasks) con `requireAuth`), `app.ts`
    (agrega `cookie-parser`, habilita `cors({ credentials: true })`), `config/env.ts` (agrega
    `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_COOKIE_NAME`), `errors/app-error.ts` (agrega
    `UnauthorizedError`).
- **Frontend afectado**:
  - Nuevo: `features/auth/hooks/useSession.ts`, `features/auth/hooks/useAuthMutations.ts`
    (`useLogin`, `useLogout`), `features/auth/components/LoginForm.tsx`,
    `routes/LoginPage.tsx`, `routes/RequireAuth.tsx` (guarda de ruta), `api/auth.api.ts`,
    `types/auth.ts`.
  - Modificado: `api/http-client.ts` (agrega `credentials: 'include'` a `fetch` para que el
    navegador envíe/reciba la cookie de sesión), `App.tsx` (ruta `/login` pública + `RequireAuth`
    envolviendo `AppShell`), `components/layout/AppHeader.tsx` (botón "Cerrar sesión").
- **Esquemas Zod nuevos**: `loginSchema` (`username: z.string().min(1)`,
  `password: z.string().min(1)`) en `backend/src/schemas/auth.schema.ts`, reutilizado en el
  frontend con `react-hook-form` + `zodResolver` (`LoginForm.tsx`) para consistencia con el resto
  de formularios del proyecto.
- **Endpoints nuevos**:
  - `POST /api/auth/login` — body `{ username, password }` → `200 { username }` + `Set-Cookie`
    (httpOnly, sin `Max-Age`) | `401` si credenciales inválidas (mensaje genérico).
  - `POST /api/auth/logout` — invalida la sesión en el store, limpia la cookie → `204`.
  - `GET /api/auth/me` — `200 { username }` si la cookie corresponde a una sesión válida,
    `401` si no hay sesión o es inválida.
- **Dependencias nuevas**: `cookie-parser` (+ `@types/cookie-parser` en backend). Justificación:
  es el estándar de facto en el ecosistema Express para leer/firmar cookies httpOnly; evita
  reimplementar parsing de `Cookie` header a mano. No se agrega `express-session` ni un store
  externo (Redis, etc.) porque con un único admin y sesión "hasta cerrar navegador" un
  `Map`/`Set` en memoria (mismo patrón que los repos in-memory existentes) es suficiente y ya
  está previsto por la Constitución (Principio V).

## Constitution Check

| Principio | Cumple | Nota |
|---|---|---|
| I. Arquitectura en capas | ✅ | `routes → controllers → services → repositories (ISessionRepository)`, igual que projects/tasks. |
| II. Zod como fuente única | ✅ | `loginSchema` valida el body; tipos inferidos con `z.infer`, reutilizado en frontend. |
| III. Tipado estricto | ✅ | Sin `any`; `Request` no se extiende con `declare global` porque el token viaja solo por la cookie, no se adjunta al `req` más que como `string \| undefined` local al middleware. |
| IV. Testing obligatorio | ✅ | Backend: Vitest+Supertest para `auth.service`, `POST /api/auth/login` (éxito/401), `GET /api/auth/me`, `requireAuth` bloqueando `/api/projects` sin cookie. Frontend: RTL para `LoginForm` (submit válido/; error genérico) y `RequireAuth` (redirect sin sesión). |
| V. Simplicidad | ✅ | Sin JWT, sin `express-session`, sin base de datos; token opaco + `Set` en memoria, coherente con que el resto del backend tampoco persiste a disco. |
| VI. Contrato de API documentado | ✅ | Los 3 endpoints se documentan con `@openapi` JSDoc en `auth.routes.ts`, igual que `project.routes.ts`. |
| VII. UX consistente | ✅ | `LoginForm` usa `Input`/`Label`/`Button` de shadcn/ui y `react-hook-form` + `zodResolver`, mismo patrón que `ProjectFormDialog`. |

Sin ❌ — no aplica sección de Complejidad/Desviaciones.

## Estructura de Proyecto

```
backend/src/config/env.ts                                   (mod)
backend/src/app.ts                                           (mod)
backend/src/errors/app-error.ts                              (mod)
backend/src/schemas/auth.schema.ts                           (nuevo)
backend/src/repositories/interfaces/session.repository.interface.ts (nuevo)
backend/src/repositories/in-memory/in-memory-session.repository.ts  (nuevo)
backend/src/repositories/index.ts                            (mod)
backend/src/services/auth.service.ts                         (nuevo)
backend/src/services/auth.service.test.ts                    (nuevo)
backend/src/controllers/auth.controller.ts                   (nuevo)
backend/src/middlewares/require-auth.middleware.ts            (nuevo)
backend/src/routes/auth.routes.ts                             (nuevo)
backend/src/routes/auth.routes.test.ts                        (nuevo)
backend/src/routes/index.ts                                   (mod)
backend/.env.example                                          (mod)

frontend/src/types/auth.ts                                    (nuevo)
frontend/src/api/auth.api.ts                                  (nuevo)
frontend/src/api/http-client.ts                                (mod)
frontend/src/features/auth/hooks/useSession.ts                (nuevo)
frontend/src/features/auth/hooks/useAuthMutations.ts           (nuevo)
frontend/src/features/auth/components/LoginForm.tsx            (nuevo)
frontend/src/features/auth/components/LoginForm.test.tsx       (nuevo)
frontend/src/routes/LoginPage.tsx                              (nuevo)
frontend/src/routes/RequireAuth.tsx                            (nuevo)
frontend/src/routes/RequireAuth.test.tsx                       (nuevo)
frontend/src/App.tsx                                           (mod)
frontend/src/components/layout/AppHeader.tsx                   (mod)
```

## Fase 1 — Diseño

### Modelo de datos

**Sesión** (no persistida, vive en memoria del proceso backend):
```ts
interface Session {
  token: string   // crypto.randomUUID(), opaco, sin info decodificable (no es JWT)
  createdAt: Date
}
```
- `ISessionRepository`: `create(): Session`, `exists(token: string): boolean`,
  `delete(token: string): void`.
- `InMemorySessionRepository`: `Map<string, Session>` interno. Reinicio del proceso backend
  invalida todas las sesiones (aceptable: single admin, sesión "hasta cerrar navegador").

**Credenciales admin** (no es una entidad de datos, vive solo en `env`):
- `env.ADMIN_USERNAME` (default `admin`, documentado en `.env.example` pero **sin** valor real
  commiteado).
- `env.ADMIN_PASSWORD` (sin default — si falta, `env.ts` falla al arrancar con Zod; así se
  garantiza FR-007: la contraseña real nunca vive en el código fuente).
- Comparación con `crypto.timingSafeEqual` sobre buffers de igual longitud (paddeados) para
  evitar timing attacks triviales — detalle de implementación menor, no cambia el contrato.

### Contratos de API

**`POST /api/auth/login`**
- Request: `{ "username": string, "password": string }` (`loginSchema`, `validate(schema, 'body')`).
- 200: `{ "username": "admin" }` + header `Set-Cookie: <SESSION_COOKIE_NAME>=<token>; HttpOnly; SameSite=Lax; Path=/` (sin `Max-Age`/`Expires` → cookie de sesión del navegador; `Secure` solo si `NODE_ENV=production`).
- 401 (`UnauthorizedError`, code `UNAUTHORIZED`): `{ "error": { "code": "UNAUTHORIZED", "message": "Usuario o contraseña incorrectos" } }` — mismo mensaje sin importar cuál campo falló (FR-006).

**`POST /api/auth/logout`**
- Sin body. Lee la cookie, borra la sesión del repositorio si existe, limpia la cookie
  (`res.clearCookie`).
- 204, sin body. Idempotente (llamarlo sin sesión también da 204).

**`GET /api/auth/me`**
- Sin body. Lee la cookie y valida contra `ISessionRepository.exists`.
- 200: `{ "username": "admin" }` si la sesión es válida.
- 401 (`UNAUTHORIZED`) si no hay cookie o el token no existe en el store.

**`requireAuth` middleware** (aplicado a `/api/projects/*` y a las rutas de tasks): misma
validación que `/auth/me`; si falla, `next(new UnauthorizedError('No autenticado'))` → responde
401 vía el `errorHandler` existente, sin llegar al controller de projects/tasks (cumple FR-003).

### Quickstart de verificación
1. Backend: `cp backend/.env.example backend/.env`, setear `ADMIN_PASSWORD=312`, `npm run dev`.
2. `curl -i http://localhost:4000/api/projects` → `401 UNAUTHORIZED` (bloqueado sin sesión).
3. `curl -i -c cookies.txt -X POST http://localhost:4000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"312"}'` → `200`, header `Set-Cookie` presente sin `Max-Age`.
4. `curl -i -b cookies.txt http://localhost:4000/api/projects` → `200` (ahora autenticado).
5. `curl -i -b cookies.txt -X POST http://localhost:4000/api/auth/logout` → `204`.
6. `curl -i -b cookies.txt http://localhost:4000/api/projects` → `401` (sesión invalidada tras logout).
7. Frontend: `npm run dev`, entrar a `http://localhost:5173/` → redirige a `/login`; loguearse con
   `admin`/`312` → llega al tablero; recargar la página (F5) → sigue autenticado; click en
   "Cerrar sesión" → vuelve a `/login` y las llamadas a la API dejan de funcionar.
8. `npm run test` en `backend/` y `frontend/` → todo verde, incluyendo los tests nuevos de auth.

## Complejidad / Desviaciones
Ninguna — todas las filas del Constitution Check son ✅.
