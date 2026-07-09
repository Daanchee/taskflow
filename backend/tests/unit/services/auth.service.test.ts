import { beforeEach, describe, expect, it } from 'vitest';
import { AuthService } from '../../../src/services/auth.service.js';
import { InMemorySessionRepository } from '../../../src/repositories/in-memory/in-memory-session.repository.js';
import { UnauthorizedError } from '../../../src/errors/app-error.js';

describe('AuthService', () => {
  let service: AuthService;
  let sessionRepository: InMemorySessionRepository;

  beforeEach(() => {
    sessionRepository = new InMemorySessionRepository();
    service = new AuthService(sessionRepository);
  });

  it('crea una sesión al loguear con credenciales correctas', async () => {
    const session = await service.login('admin', 'test-admin-password');

    expect(session.token).toBeTruthy();
    expect(await sessionRepository.exists(session.token)).toBe(true);
  });

  it('lanza UnauthorizedError con usuario incorrecto', async () => {
    await expect(service.login('otro', 'test-admin-password')).rejects.toThrow(UnauthorizedError);
  });

  it('lanza UnauthorizedError con contraseña incorrecta', async () => {
    await expect(service.login('admin', 'incorrecta')).rejects.toThrow(UnauthorizedError);
  });

  it('el mensaje de error es genérico sin importar cuál dato falló', async () => {
    let wrongUserMessage = '';
    let wrongPasswordMessage = '';

    try {
      await service.login('otro', 'test-admin-password');
    } catch (error) {
      wrongUserMessage = (error as UnauthorizedError).message;
    }

    try {
      await service.login('admin', 'incorrecta');
    } catch (error) {
      wrongPasswordMessage = (error as UnauthorizedError).message;
    }

    expect(wrongUserMessage).toBe(wrongPasswordMessage);
    expect(wrongUserMessage).not.toBe('');
  });

  it('invalida la sesión al hacer logout', async () => {
    const session = await service.login('admin', 'test-admin-password');

    await service.logout(session.token);

    expect(await service.validateSession(session.token)).toBe(false);
  });

  it('validateSession retorna false para token vacío o indefinido', async () => {
    expect(await service.validateSession(undefined)).toBe(false);
    expect(await service.validateSession('')).toBe(false);
  });

  it('validateSession retorna true para una sesión activa', async () => {
    const session = await service.login('admin', 'test-admin-password');

    expect(await service.validateSession(session.token)).toBe(true);
  });
});
