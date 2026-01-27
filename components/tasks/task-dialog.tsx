'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Task } from '@/types'
import { Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { TaskForm } from './task-form'

interface TaskDialogProps {
  task?: Task;
  onSuccess: () => void;
  children?: React.ReactNode;
}

export function TaskDialog({ task, onSuccess, children }: TaskDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
    onSuccess()
  }

  const defaultTrigger = task ? (
    <Button variant="ghost" size="sm">
      <Edit className="w-4 h-4" />
    </Button>
  ) : (
    <Button className="flex items-center gap-2">
      <Plus className="w-4 h-4" />
      New Task
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || defaultTrigger}
      </DialogTrigger>
        <TaskForm
          task={task}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
    </Dialog>
  )
}