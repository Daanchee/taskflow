import { useDashboardStats } from '@/features/stats/hooks/useDashboardStats'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusDistributionChart } from '@/features/stats/components/StatusDistributionChart'
import { PriorityDistributionChart } from '@/features/stats/components/PriorityDistributionChart'
import { ProjectDistributionChart } from '@/features/stats/components/ProjectDistributionChart'
import { CompletedTrendChart } from '@/features/stats/components/CompletedTrendChart'

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorState message="No se pudieron cargar las métricas del dashboard." />
  }

  if (!data || data.byProject.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay datos para mostrar"
        description="Creá un proyecto y algunas tareas para ver las métricas acá."
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <StatusDistributionChart byStatus={data.byStatus} />
      <PriorityDistributionChart byPriority={data.byPriority} />
      <ProjectDistributionChart byProject={data.byProject} />
      <CompletedTrendChart completedTrend={data.completedTrend} />
    </div>
  )
}
