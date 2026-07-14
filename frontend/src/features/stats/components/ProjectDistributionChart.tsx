import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { ProjectTaskCount } from '@/types/stats'

const chartConfig = {
  taskCount: { label: 'Tareas', color: 'var(--chart-3)' },
} satisfies ChartConfig

interface ProjectDistributionChartProps {
  byProject: ProjectTaskCount[]
}

export function ProjectDistributionChart({ byProject }: ProjectDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tareas por proyecto</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={byProject}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="projectName" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="taskCount" fill="var(--color-taskCount)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
