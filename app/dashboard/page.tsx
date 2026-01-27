'use client'

import { useState } from 'react'
import { ProtectedRoute } from '../../components/auth/protected-route'
import { TaskDialog } from '../../components/tasks/task-dialog'
import { TaskList } from '../../components/tasks/task-list'
import { TaskStats } from '../../components/tasks/task-stats'

export default function DashboardPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleTaskSuccess = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Task Manager</h1>
              <p className="text-muted-foreground">Manage your tasks efficiently</p>
            </div>
            <TaskDialog onSuccess={handleTaskSuccess} />
          </div>
          <div className="space-y-8">
            <TaskStats key={`stats-${refreshKey}`} />            
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
              <TaskList 
                key={`tasks-${refreshKey}`}
                onRefresh={() => setRefreshKey(prev => prev + 1)}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}