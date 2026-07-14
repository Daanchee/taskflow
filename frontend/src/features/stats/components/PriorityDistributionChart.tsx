import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TASK_PRIORITY_LABELS, type TaskPriority } from '@/types/task'
import type { StatsByPriority } from '@/types/stats'

const chartConfig = {
  count: { label: 'Tareas', color: 'var(--chart-2)' },
} satisfies ChartConfig

interface PriorityDistributionChartProps {
  byPriority: StatsByPriority
}

export function PriorityDistributionChart({ byPriority }: PriorityDistributionChartProps) {
  const data = (Object.keys(byPriority) as TaskPriority[]).map((priority) => ({
    label: TASK_PRIORITY_LABELS[priority],
    count: byPriority[priority],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas por prioridad</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
