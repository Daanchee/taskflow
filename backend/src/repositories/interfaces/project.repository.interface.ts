import type { CreateProjectDTO, Project, UpdateProjectDTO } from '../../schemas/project.schema.js';

export interface IProjectRepository {
  findAll(search?: string): Promise<Project[]>;
  findById(id: string): Promise<Project | null>;
  create(data: CreateProjectDTO): Promise<Project>;
  update(id: string, data: UpdateProjectDTO): Promise<Project | null>;
  delete(id: string): Promise<boolean>;
}
