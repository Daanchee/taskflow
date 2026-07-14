import type { Task } from '../schemas/task.schema.js';
import type {
  CompletedTrendPoint,
  DashboardStats,
  StatsByPriority,
  StatsByStatus,
} from '../schemas/stats.schema.js';
import type { IProjectRepository } from '../repositories/interfaces/project.repository.interface.js';
import type { ITaskRepository } from '../repositories/interfaces/task.repository.interface.js';

const TREND_DAYS = 30;

export class StatsService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository,
  ) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [tasks, projects] = await Promise.all([
      this.taskRepository.findAll(),
      this.projectRepository.findAll(),
    ]);

    return {
      byStatus: countByStatus(tasks),
      byPriority: countByPriority(tasks),
      byProject: projects.map((project) => ({
        projectId: project.id,
        projectName: project.name,
        taskCount: tasks.filter((task) => task.projectId === project.id).length,
      })),
      completedTrend: buildCompletedTrend(tasks, TREND_DAYS),
    };
  }
}

function countByStatus(tasks: Task[]): StatsByStatus {
  return {
    TODO: tasks.filter((task) => task.status === 'TODO').length,
    IN_PROGRESS: tasks.filter((task) => task.status === 'IN_PROGRESS').length,
    DONE: tasks.filter((task) => task.status === 'DONE').length,
  };
}

function countByPriority(tasks: Task[]): StatsByPriority {
  return {
    LOW: tasks.filter((task) => task.priority === 'LOW').length,
    MEDIUM: tasks.filter((task) => task.priority === 'MEDIUM').length,
    HIGH: tasks.filter((task) => task.priority === 'HIGH').length,
  };
}

function buildCompletedTrend(tasks: Task[], days: number): CompletedTrendPoint[] {
  const countByDate = new Map<string, number>();
  for (const task of tasks) {
    if (!task.completedAt) continue;
    const date = task.completedAt.slice(0, 10);
    countByDate.set(date, (countByDate.get(date) ?? 0) + 1);
  }

  const today = new Date();
  const trend: CompletedTrendPoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    trend.push({ date: key, count: countByDate.get(key) ?? 0 });
  }
  return trend;
}
