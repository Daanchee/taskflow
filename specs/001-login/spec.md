# Spec: Login

**ID**: `001-login` | **Estado**: Borrador | **Creado**: 2026-07-07
**Input**: descripción original del usuario → "Login para la página. Usuario: admin, contraseña: 312"

## Escenarios de Usuario y Testing

### Historia principal
Como administrador de TaskFlow, quiero iniciar sesión con usuario y contraseña para que solo yo
pueda ver y modificar los proyectos y tareas del tablero.

### Escenarios (Given/When/Then)
1. **Given** no hay sesión iniciada, **When** entro a cualquier ruta de la app, **Then** se me
   redirige a la pantalla de login.
2. **Given** estoy en la pantalla de login, **When** ingreso usuario `admin` y contraseña `312`,
   **Then** accedo al tablero y la sesión queda activa.
3. **Given** estoy en la pantalla de login, **When** ingreso credenciales incorrectas, **Then** veo
   un mensaje de error y permanezco en el login (sin revelar si falló el usuario o la contraseña).
4. **Given** tengo sesión activa, **When** cierro sesión, **Then** se me redirige al login y ya no
   puedo acceder al tablero ni a la API sin volver a autenticarme.
5. **Given** tengo sesión activa, **When** recargo la página, **Then** sigo autenticado (la sesión
   sobrevive a un refresh, no solo al estado en memoria de React).

### Casos de error
- Credenciales incorrectas → error genérico, sin bloqueo de cuenta ni límite de intentos (fuera de
  alcance por ahora, ver "Fuera de Alcance").
- Petición a la API de proyectos/tareas sin sesión válida → rechazada.
- Sesión expirada mientras el usuario navega → se le redirige al login al próximo intento de
  acción que requiera datos.

## Requisitos

### Funcionales
- **FR-001**: El sistema DEBE exponer una pantalla de login con campos usuario y contraseña.
- **FR-002**: El sistema DEBE autenticar exactamente una cuenta administradora con usuario `admin`
  y contraseña `312`.
- **FR-003**: El sistema DEBE bloquear el acceso al tablero (frontend) y a los endpoints de
  proyectos/tareas (backend) mientras no haya una sesión válida.
- **FR-004**: El sistema DEBE permitir cerrar sesión desde la UI.
- **FR-005**: La sesión DEBE persistir entre recargas de página hasta que el usuario cierre sesión
  o la sesión expire.
- **FR-006**: Ante credenciales incorrectas, el sistema DEBE mostrar un mensaje de error genérico
  sin indicar si el usuario o la contraseña fue lo incorrecto.
- **FR-007**: La contraseña `312` NO DEBE quedar en texto plano commiteada en el repositorio de
  código (repo público); DEBE configurarse fuera del código fuente versionado.

### No funcionales
- **NFR-001**: La sesión DEBE persistir mientras el navegador permanezca abierto (sobrevive a
  recargas de página) y DEBE finalizar al cerrar el navegador, sin expiración adicional basada en
  tiempo transcurrido.

## Entidades Clave
- **Sesión**: representa que el administrador está autenticado. No hay una entidad "Usuario" con
  múltiples cuentas — es un único administrador fijo (ver Fuera de Alcance).

## Fuera de Alcance
- Múltiples usuarios/roles o gestión de cuentas (alta, baja, cambio de contraseña desde la UI).
- Recuperación de contraseña ("olvidé mi contraseña").
- Límite de intentos fallidos / bloqueo temporal de cuenta.
- Registro de nuevos usuarios.

## Checklist de Revisión
- [x] Sin detalles de implementación (lenguaje, librerías, endpoints, esquemas)
- [x] Enfocado en valor de usuario y comportamiento observable
- [x] Todos los requisitos son verificables (o marcados `[NEEDS CLARIFICATION]`)
- [x] Alcance delimitado explícitamente
- [x] Sin `[NEEDS CLARIFICATION]` pendientes antes de pasar a `/plan`

## Aclaraciones

### Sesión de 2026-07-08
- **P**: ¿Cuánto debe durar la sesión de admin antes de expirar (NFR-001)?
  **R**: Hasta cerrar el navegador — sesión de tipo "session cookie", sin expiración adicional por
  tiempo transcurrido. Sobrevive a recargas de página pero no a cerrar el navegador.
