import { NotFoundError } from '../errors/app-error.js';
import type { CreateProjectDTO, Project, UpdateProjectDTO } from '../schemas/project.schema.js';
import type { IProjectRepository } from '../repositories/interfaces/project.repository.interface.js';
import type { ITaskRepository } from '../repositories/interfaces/task.repository.interface.js';

export class ProjectService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly taskRepository: ITaskRepository,
  ) {}

  async listProjects(search?: string): Promise<Project[]> {
    return this.projectRepository.findAll(search);
  }

  async getProject(id: string): Promise<Project> {
    const project = await this.projectRepository.findById(id);
    if (!project) {
      throw new NotFoundError(`Proyecto con id "${id}" no encontrado`);
    }
    return project;
  }

  async createProject(data: CreateProjectDTO): Promise<Project> {
    return this.projectRepository.create(data);
  }

  async updateProject(id: string, data: UpdateProjectDTO): Promise<Project> {
    const updated = await this.projectRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Proyecto con id "${id}" no encontrado`);
    }
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Proyecto con id "${id}" no encontrado`);
    }
    // Cascada: se orquesta aquí (y no en el repository) para mantener
    // single-responsibility de cada repositorio.
    await this.taskRepository.deleteByProjectId(id);
    await this.projectRepository.delete(id);
  }
}
