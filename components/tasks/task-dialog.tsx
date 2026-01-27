'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Task } from '@/types'
import { Edit, Plus } from 'lucide-react'
import { useState } from 'react'
import { TaskForm } from './task-form'

interface TaskDialogProps {
  task?: Task;
  children?: React.ReactNode;
}

export function TaskDialog({ task, children }: TaskDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  const defaultTrigger = task ? (
    <Button variant="outline" size="icon">
      <Edit />
    </Button>
  ) : (
    <Button variant={'outline'} className="flex items-center gap-2">
      <Plus />
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