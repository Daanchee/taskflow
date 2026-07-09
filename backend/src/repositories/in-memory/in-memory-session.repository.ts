import { generateId } from '../../utils/id.js';
import type { ISessionRepository, Session } from '../interfaces/session.repository.interface.js';

export class InMemorySessionRepository implements ISessionRepository {
  private readonly sessions = new Map<string, Session>();

  async create(): Promise<Session> {
    const session: Session = { token: generateId(), createdAt: new Date() };
    this.sessions.set(session.token, session);
    return session;
  }

  async exists(token: string): Promise<boolean> {
    return this.sessions.has(token);
  }

  async delete(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}
