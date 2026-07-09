import { InMemoryProjectRepository } from './in-memory/in-memory-project.repository.js';
import { InMemoryTaskRepository } from './in-memory/in-memory-task.repository.js';
import { InMemorySessionRepository } from './in-memory/in-memory-session.repository.js';
import type { IProjectRepository } from './interfaces/project.repository.interface.js';
import type { ITaskRepository } from './interfaces/task.repository.interface.js';
import type { ISessionRepository } from './interfaces/session.repository.interface.js';

export interface Repositories {
  projectRepository: IProjectRepository;
  taskRepository: ITaskRepository;
  sessionRepository: ISessionRepository;
}

/**
 * Composition root del patrón Repository.
 *
 * Hoy siempre instancia los repositorios en memoria. El día que se agregue
 * persistencia real (ej. Postgres/Prisma), este es el único archivo que
 * cambia: se instanciaría `PrismaProjectRepository`/`PrismaTaskRepository`
 * (implementando las mismas interfaces) sin tocar controllers ni services.
 */
export function createRepositories(): Repositories {
  return {
    projectRepository: new InMemoryProjectRepository(),
    taskRepository: new InMemoryTaskRepository(),
    sessionRepository: new InMemorySessionRepository(),
  };
}
