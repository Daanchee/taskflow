import { generateId } from '../../utils/id.js';
import type {
  CreateTaskDTO,
  Task,
  TaskFiltersQuery,
  UpdateTaskDTO,
} from '../../schemas/task.schema.js';
import type { ITaskRepository } from '../interfaces/task.repository.interface.js';

export class InMemoryTaskRepository implements ITaskRepository {
  private readonly tasks = new Map<string, Task>();

  async findAll(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async findByProjectId(projectId: string, filters: TaskFiltersQuery = {}): Promise<Task[]> {
    let result = Array.from(this.tasks.values()).filter((task) => task.projectId === projectId);

    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.search) {
      const normalized = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(normalized) ||
          task.description?.toLowerCase().includes(normalized),
      );
    }
    if (filters.dueBefore) {
      const before = new Date(filters.dueBefore).getTime();
      result = result.filter((task) => task.dueDate && new Date(task.dueDate).getTime() <= before);
    }
    if (filters.dueAfter) {
      const after = new Date(filters.dueAfter).getTime();
      result = result.filter((task) => task.dueDate && new Date(task.dueDate).getTime() >= after);
    }

    return result;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }

  async create(projectId: string, data: CreateTaskDTO): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      id: generateId(),
      projectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      createdAt: now,
      updatedAt: now,
      completedAt: data.status === 'DONE' ? now : undefined,
    };
    this.tasks.set(task.id, task);
    return task;
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated: Task = {
      ...existing,
      ...data,
      updatedAt: now,
      completedAt:
        data.status === 'DONE' && !existing.completedAt ? now : existing.completedAt,
    };
    this.tasks.set(id, updated);
    return updated;
  }

  async delete(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async deleteByProjectId(projectId: string): Promise<void> {
    for (const task of this.tasks.values()) {
      if (task.projectId === projectId) {
        this.tasks.delete(task.id);
      }
    }
  }
}
