# TaskFlow

Gestor de proyectos y tareas estilo Kanban, hecho como proyecto personal para mostrar cómo trabajo el desarrollo full-stack: arquitectura en capas, patrón Repository, validación con Zod, testing automatizado, documentación OpenAPI y una UI completa con React + TailwindCSS.

## 🚀 Demo en vivo

- **App**: [taskflow-umber-zeta.vercel.app](https://taskflow-umber-zeta.vercel.app)
- **API**: [taskflow-yjdp.onrender.com](https://taskflow-yjdp.onrender.com)
- **Documentación API (Swagger)**: [taskflow-yjdp.onrender.com/api-docs](https://taskflow-yjdp.onrender.com/api-docs)

> El backend está en el plan free de Render y "duerme" tras ~15 min sin tráfico. Si la demo tarda 30-50s en cargar la primera vez, es normal: solo está despertando.

Login de demo: usuario `admin`, contraseña `312`.

## Por qué hice este proyecto

Quería tener algo en mi GitHub que mostrara cómo pienso la arquitectura de un proyecto full-stack de punta a punta, no solo un CRUD suelto. Elegí un tablero Kanban porque es un dominio simple de entender pero que igual obliga a resolver cosas reales: relaciones entre entidades, filtros, estado compartido entre componentes, drag & drop, y una API bien diseñada detrás.

Decidí a propósito **no usar base de datos todavía**. En lugar de eso, el backend guarda todo en memoria pero detrás de una interfaz de repositorio (`IProjectRepository` / `ITaskRepository`), así que el día que quiera conectar Postgres o cualquier otra base real, solo tengo que escribir una nueva implementación de esa interfaz sin tocar ni un controller ni un service. Me pareció una mejor forma de mostrar criterio de diseño que apurar una base de datos solo por tenerla.

## Stack que usé

| Capa | Tecnología | Por qué la elegí |
|---|---|---|
| Backend | Node.js + TypeScript + Express | Quería una arquitectura en capas explícita y tipado estricto de punta a punta |
| Validación | Zod | Una sola fuente de verdad: valida en runtime y de ahí infiero los tipos de TS |
| Testing backend | Vitest + Supertest | Tests rápidos, unitarios y de integración, con una API muy parecida a Jest |
| Documentación API | Swagger (swagger-jsdoc + swagger-ui-express) | Un contrato de API vivo, que se puede probar desde el navegador |
| Frontend | React + TypeScript + Vite | Es el stack más pedido en el mercado y con el que más cómodo me siento |
| Estilos/UI | TailwindCSS + shadcn/ui | Componentes accesibles y consistentes sin reinventar la rueda |
| Estado de servidor | TanStack React Query | Cache, invalidación y updates optimistas sin necesitar Redux |
| Formularios | react-hook-form + Zod | Misma validación en frontend y backend, sin duplicar reglas de negocio |
| Drag & Drop | @dnd-kit | Tablero Kanban interactivo y accesible, con mantenimiento activo |
| Contenedores | Docker + Docker Compose | Poder levantar todo con un solo comando, sin depender de mi máquina |

## Arquitectura

```
Cliente (React) ──HTTP/JSON──▶ routes ──▶ controllers ──▶ services ──▶ repositories (interfaz)
                                                                              │
                                                                    implementación in-memory
                                                                    (a futuro: implementación con DB real)
```

La pieza que más me interesaba dejar bien resuelta es el patrón Repository: los `services` solo conocen las interfaces `IProjectRepository`/`ITaskRepository`, nunca su implementación concreta. Hoy `repositories/index.ts` instancia la versión en memoria; el día que agregue una base de datos real, ese es el único archivo que cambiaría.

## Estructura de carpetas

```
/
├── backend/          # API REST (Express + TypeScript)
│   ├── src/
│   │   ├── routes/          # Definición de endpoints + docs OpenAPI
│   │   ├── controllers/     # Adaptan HTTP ↔ services
│   │   ├── services/        # Lógica de negocio
│   │   ├── repositories/    # Interfaces + implementación in-memory
│   │   ├── schemas/         # Validación y tipos (Zod)
│   │   └── middlewares/     # Validación, manejo de errores
│   └── tests/         # Unit + integración (Vitest/Supertest)
├── frontend/         # SPA (React + Vite)
│   └── src/
│       ├── features/        # projects y tasks (componentes, hooks)
│       ├── routes/          # Páginas
│       ├── api/             # Cliente HTTP
│       └── components/ui/   # Componentes shadcn/ui
└── docker-compose.yml
```

## Requisitos previos

- Node.js 20+
- Docker y Docker Compose (opcional, para levantar todo con un comando)

## Instalación y ejecución

### Opción 1: Docker

```bash
cp .env.example .env   # completá ADMIN_PASSWORD antes de continuar
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Documentación API: http://localhost:4000/api-docs

### Opción 2: manual (dos terminales)

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env
npm install
npm run dev      # http://localhost:4000

# Terminal 2 — frontend
cd frontend
cp .env.example .env
npm install
npm run dev       # http://localhost:5173
```

## Variables de entorno

**backend/.env**
| Variable | Descripción | Default |
|---|---|---|
| `PORT` | Puerto del servidor | `4000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |
| `ADMIN_USERNAME` | Usuario del login admin | `admin` |
| `ADMIN_PASSWORD` | Contraseña del login admin (obligatoria, sin default) | — |
| `SESSION_COOKIE_NAME` | Nombre de la cookie de sesión | `taskflow_session` |

**frontend/.env**
| Variable | Descripción | Default |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:4000/api` (en producción, `/api` — ver [Despliegue](#despliegue-gratuito-render--vercel)) |

## Scripts disponibles

**backend**
| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Compila TypeScript a `dist/` |
| `npm test` | Corre los tests (Vitest) |
| `npm run lint` / `lint:fix` | ESLint |
| `npm run format` / `format:check` | Prettier |

**frontend**
| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Type-check + build de producción |
| `npm test` / `test:watch` | Corre los tests (Vitest + Testing Library) |
| `npm run lint` | oxlint |
| `npm run format` / `format:check` | Prettier |

## Documentación de la API

Con el backend corriendo, la documentación interactiva (Swagger UI) está disponible en `http://localhost:4000/api-docs`, incluyendo la posibilidad de probar cada endpoint directamente desde el navegador. El spec en crudo está en `/api-docs.json`.

## Testing

**Backend** — 51 tests (unitarios de repositorios/services + integración de rutas con Supertest), que cubren el CRUD completo, los filtros, el borrado en cascada de tareas al eliminar un proyecto, y el login/logout/protección de rutas:

```bash
cd backend
npm test
```

**Frontend** — tests de componentes y utilidades con Vitest + React Testing Library: validación de formularios, interacción con menús, formateo de fechas, manejo de errores de la API y una prueba de regresión sobre un bug real que encontré (los `Select` de shadcn/Base UI mostraban el valor crudo del enum en vez de la etiqueta traducida):

```bash
cd frontend
npm test
```

## Decisiones de diseño

- **Sin base de datos, pero con patrón Repository**: preferí demostrar una arquitectura desacoplada antes que apurar una persistencia real que no aportaba nada a lo que quería mostrar. Migrar a Postgres/Prisma más adelante implicaría solo escribir nuevas implementaciones de `IProjectRepository`/`ITaskRepository` y cambiar el composition root (`repositories/index.ts`).
- **Monorepo simple sin workspaces**: dos carpetas independientes (`backend`/`frontend`), cada una con su propio `package.json`. Para el tamaño de este proyecto, pnpm workspaces o Turborepo hubiera sido complejidad de más.
- **Zod como fuente única de verdad**: tanto en backend como en frontend, los schemas de validación también generan los tipos de TypeScript (`z.infer`), para no mantener validación y tipos por separado.
- **Optimistic updates en el tablero Kanban**: mover una tarea entre columnas actualiza la UI antes de que responda el servidor (con rollback automático si algo falla), para que el drag & drop se sienta instantáneo.

## Despliegue gratuito (Render + Vercel)

La demo en vivo de arriba corre exactamente con esta configuración: backend en Render (Web Service con Docker, plan free) y frontend en Vercel. El repo incluye `render.yaml` (Blueprint) y un workflow de CI (`.github/workflows/ci.yml`) que corre lint + tests + build en cada push. Si quieres replicarlo:

**1. Backend en Render**
1. Entra a [render.com](https://render.com) y haz "Sign in with GitHub".
2. "New" → "Blueprint" (o "Web Service" manual) → selecciona este repositorio, con **Root Directory = `backend`**. Render detecta `render.yaml` automáticamente si usas Blueprint.
3. Completa `ADMIN_USERNAME` y `ADMIN_PASSWORD` (las credenciales del login admin); deja `CORS_ORIGIN` vacío por ahora, lo actualizas en el paso 3.
4. Al terminar el deploy, copia la URL pública (algo como `https://taskflow-backend.onrender.com`).

**2. Frontend en Vercel**
1. Entra a [vercel.com](https://vercel.com) y haz "Sign in with GitHub".
2. "Add New" → "Project" → selecciona este repositorio, con **Root Directory = `frontend`**.
3. En "Environment Variables" agrega `VITE_API_URL` = `/api` (relativo — ver nota abajo sobre por qué no apunta directo a Render).
4. Deploy. Copia la URL pública (algo como `https://taskflow.vercel.app`).

**3. Conectar CORS**
1. Vuelve a Render → tu servicio → "Environment" → edita `CORS_ORIGIN` con la URL de Vercel del paso 2 (sin `/` final).
2. Guarda: Render redepliega automáticamente.

**Por qué `VITE_API_URL=/api` y no la URL de Render directo**: la sesión de login usa una cookie httpOnly (ver [Decisiones de diseño](#decisiones-de-diseño)). Si el frontend llamara directo a `https://TU-BACKEND.onrender.com`, el navegador trataría esa cookie como de **tercero** (dominio distinto al de Vercel) y la bloquearía por las políticas de third-party cookies de los navegadores modernos — el login "funcionaría" (200 OK) pero la sesión nunca quedaría guardada. `frontend/vercel.json` resuelve esto con un rewrite: las llamadas a `/api/*` se reenvían server-to-server a Render, así el navegador ve todo como un único origen (`vercel.app`) y la cookie queda first-party. Si cambiás la URL del backend, actualizá el `destination` en `frontend/vercel.json` (Vercel no interpola variables de entorno ahí).

Nota: el plan free de Render "duerme" el backend tras ~15 minutos sin tráfico; la primera petición tras la inactividad puede tardar 30-50s en responder mientras despierta.

## Metodología de desarrollo (SDD)

Las features nuevas se desarrollan con Spec-Driven Development: primero se especifica el qué,
después se planea el cómo, luego se desglosa en tareas y recién ahí se implementa. Esto vive como
un conjunto de skills de Claude Code:

| Comando | Qué hace |
|---|---|
| `/constitution` | Crea o actualiza `.specify/memory/constitution.md`, los principios no negociables del proyecto |
| `/specify` | Genera `specs/NNN-slug/spec.md` (qué y para quién, sin implementación) |
| `/clarify` | Resuelve ambigüedades del spec antes de planear |
| `/plan` | Genera `specs/NNN-slug/plan.md` (diseño técnico, validado contra la constitución) |
| `/tasks` | Genera `specs/NNN-slug/tasks.md` (tareas atómicas y ordenadas) |
| `/implement` | Ejecuta las tareas, marcándolas completadas y corriendo tests/lint |

Cada comando solo lee el artefacto de la fase anterior (no el chat completo), lo que mantiene el
contexto — y el consumo de tokens — bajo control incluso en features grandes.

## Qué le falta (a propósito)

Este proyecto no busca ser un producto terminado, sino mostrar arquitectura. Lo que dejé pendiente para una siguiente iteración:

- Autenticación de usuarios y proyectos por usuario/equipo
- Persistencia real (Postgres + Prisma) implementando las interfaces de repositorio que ya existen
- Actualizaciones en tiempo real entre usuarios (WebSockets)
- Paginación e infinite scroll en listados grandes

## Licencia

MIT — ver [LICENSE](./LICENSE).

---

Hecho por [@Daanchee](https://github.com/Daanchee).
