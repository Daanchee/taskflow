# Spec: Modo Oscuro

**ID**: `002-modo-oscuro` | **Estado**: Borrador | **Creado**: 2026-07-09
**Input**: descripción original del usuario → "Modo oscuro: agregar un toggle de tema (claro/oscuro) a la aplicación, aprovechando que shadcn/ui ya soporta theming. El usuario debe poder cambiar entre tema claro y oscuro desde la UI (por ejemplo un botón/switch en el AppHeader), la preferencia debe persistir entre sesiones (recargar la página, cerrar y volver a abrir el navegador), y por defecto debería respetar la preferencia del sistema operativo del usuario si no eligió nada manualmente todavía."

## Escenarios de Usuario y Testing

### Historia principal
Como usuaria de TaskFlow, quiero poder alternar entre tema claro y oscuro para trabajar cómoda
según la luz del ambiente o mi preferencia visual, sin perder esa elección cada vez que vuelvo a
la app.

### Escenarios (Given/When/Then)
1. **Given** que nunca elegí un tema manualmente, **When** abro la app y mi sistema operativo está
   en modo oscuro, **Then** la app se muestra en tema oscuro sin que yo haga nada.
2. **Given** que estoy viendo la app en un tema, **When** activo el control de cambio de tema,
   **Then** toda la interfaz cambia al tema opuesto de inmediato, sin recargar la página.
3. **Given** que elegí manualmente un tema, **When** recargo la página o cierro y vuelvo a abrir el
   navegador, **Then** la app se muestra en el tema que elegí (no en el que tenga el sistema
   operativo en ese momento).
4. **Given** que elegí manualmente un tema, **When** cambio la preferencia de tema de mi sistema
   operativo, **Then** la app sigue mostrando el tema que elegí manualmente; el cambio del sistema
   operativo se ignora hasta que yo mismo vuelva a usar el control de cambio de tema.
5. **Given** que no inicié sesión todavía, **When** entro a la pantalla de login, **Then** la
   pantalla se muestra con el mismo tema (claro/oscuro) que ya está guardado, o con el de mi
   sistema operativo si todavía no elegí ninguno manualmente — aunque el control para cambiarlo
   solo esté visible después de iniciar sesión.

### Casos de error
- Si el navegador no permite guardar la preferencia (ej. almacenamiento deshabilitado o lleno), la
  app debe seguir funcionando en algún tema razonable (no debe romperse ni quedar en un estado sin
  estilos).

## Requisitos

### Funcionales
- **FR-001**: Los usuarios DEBEN poder alternar entre tema claro y tema oscuro desde un control
  visible en la interfaz.
- **FR-002**: El sistema DEBE aplicar el cambio de tema de inmediato a toda la interfaz, sin
  requerir recargar la página.
- **FR-003**: El sistema DEBE recordar la última elección manual de tema de la persona usuaria y
  mostrarla de nuevo al recargar la página o al volver a abrir el navegador.
- **FR-004**: Cuando la persona usuaria todavía no eligió un tema manualmente, el sistema DEBE
  mostrar por defecto el tema que coincida con la preferencia del sistema operativo (claro u
  oscuro).
- **FR-005**: El control para cambiar de tema DEBE dejar claro en qué tema está la app actualmente
  (por ejemplo, mostrando un estado visual distinto para claro vs. oscuro).
- **FR-006**: Una vez que la persona usuaria eligió un tema manualmente, el sistema DEBE ignorar
  cambios posteriores en la preferencia del sistema operativo hasta que ella misma vuelva a usar
  el control de cambio de tema.
- **FR-007**: La pantalla de login (antes de autenticarse) DEBE mostrarse con el mismo tema
  (guardado o, en su ausencia, el del sistema operativo) que el resto de la app, aunque el control
  para cambiarlo solo esté disponible después de iniciar sesión.

Marca cada requisito ambiguo así: `[NEEDS CLARIFICATION: pregunta concreta]`. No lo asumas ni lo
completes con una suposición silenciosa — usa `/clarify` para resolverlo antes de planear.

### No funcionales (si aplica)
- **NFR-001**: El control de cambio de tema debe ser operable con teclado y tener una etiqueta
  accesible (lector de pantalla), consistente con el resto de controles de la aplicación.
- **NFR-002**: El cambio de tema no debe producir un "parpadeo" visible del tema incorrecto antes
  de aplicar el tema recordado al cargar la app.

## Entidades Clave (si la feature involucra datos)
- **Preferencia de tema**: valor con tres estados posibles (claro / oscuro / sin elección manual
  todavía), asociado al navegador de la persona usuaria, no a su cuenta.

## Fuera de Alcance
- Sincronizar la preferencia de tema entre distintos dispositivos o navegadores de la misma
  persona usuaria.
- Temas adicionales más allá de claro/oscuro (por ejemplo, temas de color personalizados).
- Cambiar el tema por proyecto o por usuario cuando haya soporte multi-usuario (ver ideas futuras
  de multi-usuario) — esta feature es una preferencia global de la app.

## Aclaraciones

### 2026-07-09
- **P: Si el usuario ya eligió un tema manualmente y después cambia la preferencia de su sistema
  operativo, ¿qué debe pasar?** → R: Se ignora el cambio del sistema operativo; la elección manual
  manda siempre hasta que el usuario vuelva a usar el control de cambio de tema (FR-006).
- **P: ¿La pantalla de login (antes de autenticarse) también debe respetar el tema oscuro/claro?**
  → R: Sí, respeta el tema guardado o el del sistema operativo, igual que el resto de la app,
  aunque el control para cambiarlo solo viva en el `AppHeader` post-login (FR-007).

## Checklist de Revisión
- [x] Sin detalles de implementación (lenguaje, librerías, endpoints, esquemas)
- [x] Enfocado en valor de usuario y comportamiento observable
- [x] Todos los requisitos son verificables (o marcados `[NEEDS CLARIFICATION]`)
- [x] Alcance delimitado explícitamente
- [x] Sin `[NEEDS CLARIFICATION]` pendientes antes de pasar a `/plan`
