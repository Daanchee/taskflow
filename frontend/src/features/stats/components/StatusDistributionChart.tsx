import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { TASK_STATUS_LABELS, type TaskStatus } from '@/types/task'
import type { StatsByStatus } from '@/types/stats'

const chartConfig = {
  count: { label: 'Tareas', color: 'var(--chart-1)' },
} satisfies ChartConfig

interface StatusDistributionChartProps {
  byStatus: StatsByStatus
}

export function StatusDistributionChart({ byStatus }: StatusDistributionChartProps) {
  const data = (Object.keys(byStatus) as TaskStatus[]).map((status) => ({
    label: TASK_STATUS_LABELS[status],
    count: byStatus[status],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas por estado</CardTitle>
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
