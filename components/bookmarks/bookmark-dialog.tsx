'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { BookmarkForm } from './bookmark-form'

export function BookmarkDialog() {
  const [open, setOpen] = useState(false)

  const handleSuccess = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'outline'} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Bookmark
        </Button>
      </DialogTrigger>
      <BookmarkForm
        onSuccess={handleSuccess}
        onCancel={() => setOpen(false)}
      />
    </Dialog>
  )
}
