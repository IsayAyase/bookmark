'use client'

import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle, Clock, ListTodo } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
}

export function TaskStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    highPriority: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    if (!user) return

    setLoading(true)

    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('status, priority')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching stats:', error)
        return
      }

      const stats: TaskStats = {
        total: tasks?.length || 0,
        pending: tasks?.filter(t => t.status === 'pending').length || 0,
        inProgress: tasks?.filter(t => t.status === 'in-progress').length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        highPriority: tasks?.filter(t => t.priority === 'high').length || 0
      }

      setStats(stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-muted animate-pulse rounded-lg p-4 h-20" />
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: AlertCircle,
      color: 'text-gray-600 bg-gray-50 border-gray-200'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200'
    }
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 ${card.color}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{card.title}</p>
                <p className="text-2xl font-bold">{card.value}</p>
              </div>
              <card.icon className="w-5 h-5 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      {stats.highPriority > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">
              {stats.highPriority} high priority {stats.highPriority === 1 ? 'task' : 'tasks'} need attention
            </span>
          </div>
        </div>
      )}

      {stats.total > 0 && (
        <div className="text-sm text-muted-foreground">
          Completion rate: {Math.round((stats.completed / stats.total) * 100)}%
        </div>
      )}
    </div>
  )
}