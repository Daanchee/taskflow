import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { CompletedTrendPoint } from '@/types/stats'

const chartConfig = {
  count: { label: 'Completadas', color: 'var(--chart-4)' },
} satisfies ChartConfig

interface CompletedTrendChartProps {
  completedTrend: CompletedTrendPoint[]
}

export function CompletedTrendChart({ completedTrend }: CompletedTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencia de tareas completadas (últimos 30 días)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={completedTrend}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="count"
              stroke="var(--color-count)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
