import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCreateProject, useUpdateProject } from '../hooks/useProjectMutations'
import type { Project } from '@/types/project'

const projectFormSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(100),
  description: z.string().max(500).optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

interface ProjectFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
  const isEditing = Boolean(project)
  const createProject = useCreateProject()
  const updateProject = useUpdateProject(project?.id ?? '')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: { name: '', description: '' },
  })

  useEffect(() => {
    if (open) {
      reset({ name: project?.name ?? '', description: project?.description ?? '' })
    }
  }, [open, project, reset])

  const onSubmit = async (values: ProjectFormValues) => {
    if (isEditing) {
      await updateProject.mutateAsync(values)
    } else {
      await createProject.mutateAsync(values)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar proyecto' : 'Nuevo proyecto'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Ej. Rediseño de sitio web" {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Descripción opcional del proyecto"
              {...register('description')}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? 'Guardar cambios' : 'Crear proyecto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
