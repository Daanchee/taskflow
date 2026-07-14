export interface StatsByStatus {
  TODO: number
  IN_PROGRESS: number
  DONE: number
}

export interface StatsByPriority {
  LOW: number
  MEDIUM: number
  HIGH: number
}

export interface ProjectTaskCount {
  projectId: string
  projectName: string
  taskCount: number
}

export interface CompletedTrendPoint {
  date: string
  count: number
}

export interface DashboardStats {
  byStatus: StatsByStatus
  byPriority: StatsByPriority
  byProject: ProjectTaskCount[]
  completedTrend: CompletedTrendPoint[]
}
