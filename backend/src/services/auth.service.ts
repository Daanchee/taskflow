import { timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { UnauthorizedError } from '../errors/app-error.js';
import type { ISessionRepository, Session } from '../repositories/interfaces/session.repository.interface.js';

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export class AuthService {
  constructor(private readonly sessionRepository: ISessionRepository) {}

  async login(username: string, password: string): Promise<Session> {
    const validUsername = timingSafeStringEqual(username, env.ADMIN_USERNAME);
    const validPassword = timingSafeStringEqual(password, env.ADMIN_PASSWORD);

    if (!validUsername || !validPassword) {
      throw new UnauthorizedError('Usuario o contraseña incorrectos');
    }

    return this.sessionRepository.create();
  }

  async logout(token: string): Promise<void> {
    await this.sessionRepository.delete(token);
  }

  async validateSession(token: string | undefined): Promise<boolean> {
    if (!token) return false;
    return this.sessionRepository.exists(token);
  }
}
