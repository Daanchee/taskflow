# Spec: [NOMBRE DE LA FEATURE]

**ID**: `[NNN-slug]` | **Estado**: Borrador | **Creado**: [FECHA]
**Input**: descripción original del usuario → "[texto literal]"

## Escenarios de Usuario y Testing

### Historia principal
Como [tipo de usuario], quiero [acción] para [beneficio].

### Escenarios (Given/When/Then)
1. **Given** [contexto], **When** [acción], **Then** [resultado esperado].
2. **Given** [contexto de borde], **When** [acción], **Then** [resultado esperado].

### Casos de error
- [Qué pasa si el input es inválido / el recurso no existe / hay un conflicto de estado]

## Requisitos

### Funcionales
- **FR-001**: El sistema DEBE [capacidad concreta y verificable].
- **FR-002**: El sistema DEBE [capacidad concreta y verificable].
- **FR-003**: Los usuarios DEBEN poder [acción clave].
- **FR-004**: El sistema DEBE [manejo de error/validación].

Marca cada requisito ambiguo así: `[NEEDS CLARIFICATION: pregunta concreta]`. No lo asumas ni lo
completes con una suposición silenciosa — usa `/clarify` para resolverlo antes de planear.

### No funcionales (si aplica)
- **NFR-001**: [rendimiento, accesibilidad, etc., solo si el usuario lo pidió o es evidente]

## Entidades Clave (si la feature involucra datos)
- **[Entidad]**: qué representa, atributos relevantes, relación con otras entidades.

## Fuera de Alcance
- [Qué NO incluye esta feature, para que /plan no lo infle]

## Checklist de Revisión
- [ ] Sin detalles de implementación (lenguaje, librerías, endpoints, esquemas)
- [ ] Enfocado en valor de usuario y comportamiento observable
- [ ] Todos los requisitos son verificables (o marcados `[NEEDS CLARIFICATION]`)
- [ ] Alcance delimitado explícitamente
- [ ] Sin `[NEEDS CLARIFICATION]` pendientes antes de pasar a `/plan`
