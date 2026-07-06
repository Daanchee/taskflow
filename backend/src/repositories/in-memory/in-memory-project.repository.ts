import { generateId } from '../../utils/id.js';
import type { CreateProjectDTO, Project, UpdateProjectDTO } from '../../schemas/project.schema.js';
import type { IProjectRepository } from '../interfaces/project.repository.interface.js';

export class InMemoryProjectRepository implements IProjectRepository {
  private readonly projects = new Map<string, Project>();

  async findAll(search?: string): Promise<Project[]> {
    const all = Array.from(this.projects.values());
    if (!search) return all;

    const normalized = search.toLowerCase();
    return all.filter((project) => project.name.toLowerCase().includes(normalized));
  }

  async findById(id: string): Promise<Project | null> {
    return this.projects.get(id) ?? null;
  }

  async create(data: CreateProjectDTO): Promise<Project> {
    const now = new Date().toISOString();
    const project: Project = {
      id: generateId(),
      name: data.name,
      description: data.description,
      createdAt: now,
      updatedAt: now,
    };
    this.projects.set(project.id, project);
    return project;
  }

  async update(id: string, data: UpdateProjectDTO): Promise<Project | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;

    const updated: Project = {
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }
}
