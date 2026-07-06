import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUSES,
  type TaskFilters as TaskFiltersType,
} from '@/types/task'

interface TaskFiltersProps {
  filters: TaskFiltersType
  onChange: (filters: TaskFiltersType) => void
}

const ALL_VALUE = 'ALL'

const STATUS_SELECT_LABELS: Record<string, string> = {
  [ALL_VALUE]: 'Todos los estados',
  ...TASK_STATUS_LABELS,
}

const PRIORITY_SELECT_LABELS: Record<string, string> = {
  [ALL_VALUE]: 'Todas las prioridades',
  ...TASK_PRIORITY_LABELS,
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  const hasActiveFilters = Boolean(filters.status || filters.priority || filters.search)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar tareas…"
          className="pl-8"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value || undefined })}
        />
      </div>

      <Select
        value={filters.status ?? ALL_VALUE}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value === ALL_VALUE ? undefined : (value as TaskFiltersType['status']),
          })
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Estado">
            {(value: string) => STATUS_SELECT_LABELS[value] ?? 'Estado'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todos los estados</SelectItem>
          {TASK_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.priority ?? ALL_VALUE}
        onValueChange={(value) =>
          onChange({
            ...filters,
            priority: value === ALL_VALUE ? undefined : (value as TaskFiltersType['priority']),
          })
        }
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Prioridad">
            {(value: string) => PRIORITY_SELECT_LABELS[value] ?? 'Prioridad'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Todas las prioridades</SelectItem>
          {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={() => onChange({})}>
          <X className="mr-1 h-4 w-4" />
          Limpiar
        </Button>
      )}
    </div>
  )
}
