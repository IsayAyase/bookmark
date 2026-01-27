'use client'

import { supabase } from '@/lib/supabase'
import { formatDate, getPriorityColor, getStatusColor, truncateText } from '@/lib/utils'
import { AlertCircle, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Task, TaskFilter } from '@/types'
import { TaskDialog } from './task-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface TaskListProps {
  onRefresh: () => void;
}

export function TaskList({ onRefresh }: TaskListProps) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<TaskFilter>({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [user, filter, searchTerm])

  const fetchTasks = async () => {
    if (!user) return

    setLoading(true)
    setError('')

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filter.status) {
        query = query.eq('status', filter.status)
      }

      if (filter.priority) {
        query = query.eq('priority', filter.priority)
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      }

      const { data, error } = await query

      if (error) {
        setError(error.message)
      } else {
        setTasks(data || [])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user!.id)

      if (error) {
        setError(error.message)
      } else {
        setTasks(prev => prev.filter(task => task.id !== taskId))
        onRefresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .eq('user_id', user!.id)

      if (error) {
        setError(error.message)
      } else {
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
            : task
        ))
        onRefresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
    }
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'in-progress':
        return <Clock className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-destructive mb-4">{error}</div>
        <Button onClick={fetchTasks}>Try Again</Button>
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          {searchTerm || filter.status || filter.priority 
            ? 'No tasks found matching your criteria.' 
            : 'No tasks yet. Create your first task!'}
        </div>
        {(searchTerm || filter.status || filter.priority) && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('')
              setFilter({})
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter.status || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              status: e.target.value as Task['status'] || undefined 
            }))}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.priority || ''}
            onChange={(e) => setFilter(prev => ({ 
              ...prev, 
              priority: e.target.value as Task['priority'] || undefined 
            }))}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <h3 className="font-medium">{task.title}</h3>
                </div>
                
                {task.description && (
                  <p className="text-sm text-muted-foreground">
                    {truncateText(task.description, 150)}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  {task.due_date && (
                    <span className="text-muted-foreground">
                      Due: {formatDate(task.due_date)}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    Created: {formatDate(task.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {task.status !== 'completed' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateTaskStatus(task.id, 'completed')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <TaskDialog 
                  task={task}
                  onSuccess={onRefresh}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground text-center">
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
      </div>
    </div>
  )
}