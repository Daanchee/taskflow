import { NotFoundError } from '../errors/app-error.js';
import type {
  CreateTaskDTO,
  Task,
  TaskFiltersQuery,
  UpdateTaskDTO,
} from '../schemas/task.schema.js';
import type { IProjectRepository } from '../repositories/interfaces/project.repository.interface.js';
import type { ITaskRepository } from '../repositories/interfaces/task.repository.interface.js';

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository,
  ) {}

  async listTasks(projectId: string, filters?: TaskFiltersQuery): Promise<Task[]> {
    await this.assertProjectExists(projectId);
    return this.taskRepository.findByProjectId(projectId, filters);
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new NotFoundError(`Tarea con id "${id}" no encontrada`);
    }
    return task;
  }

  async createTask(projectId: string, data: CreateTaskDTO): Promise<Task> {
    await this.assertProjectExists(projectId);
    return this.taskRepository.create(projectId, data);
  }

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const updated = await this.taskRepository.update(id, data);
    if (!updated) {
      throw new NotFoundError(`Tarea con id "${id}" no encontrada`);
    }
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.taskRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`Tarea con id "${id}" no encontrada`);
    }
  }

  private async assertProjectExists(projectId: string): Promise<void> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) {
      throw new NotFoundError(`Proyecto con id "${projectId}" no encontrado`);
    }
  }
}
