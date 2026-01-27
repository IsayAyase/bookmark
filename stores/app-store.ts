import { create } from 'zustand'
import { Task, TaskFilter, TaskSortBy, SortOrder, TaskFormData } from '@/types'
import { supabase } from '@/lib/supabase'

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  filter: TaskFilter
  sortBy: TaskSortBy
  sortOrder: SortOrder
  
  // Actions
  fetchTasks: () => Promise<void>
  createTask: (taskData: TaskFormData) => Promise<{ error?: string; taskId?: string }>
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<{ error?: string }>
  deleteTask: (id: string) => Promise<{ error?: string }>
  setFilter: (filter: TaskFilter) => void
  setSorting: (sortBy: TaskSortBy, sortOrder: SortOrder) => void
  clearError: () => void
}

export const useAppStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  filter: {},
  sortBy: 'created_at',
  sortOrder: 'desc',

  fetchTasks: async () => {
    try {
      set({ loading: true, error: null })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ error: 'User not authenticated', loading: false })
        return
      }

      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)

      // Apply filters
      const { filter } = get()
      if (filter.status) {
        query = query.eq('status', filter.status)
      }
      if (filter.priority) {
        query = query.eq('priority', filter.priority)
      }
      if (filter.search) {
        query = query.ilike('title', `%${filter.search}%`)
      }

      // Apply sorting
      const { sortBy, sortOrder } = get()
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) {
        set({ error: error.message, loading: false })
        return
      }

      set({ tasks: data || [], loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch tasks', 
        loading: false 
      })
    }
  },

  createTask: async (taskData: TaskFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      set(state => ({
        tasks: [data, ...state.tasks]
      }))

      return { taskId: data.id }
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to create task' 
      }
    }
  },

  updateTask: async (id: string, taskData: Partial<TaskFormData>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...taskData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === id ? data : task
        )
      }))

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to update task' 
      }
    }
  },

  deleteTask: async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) {
        return { error: error.message }
      }

      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }))

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to delete task' 
      }
    }
  },

  setFilter: (filter: TaskFilter) => {
    set({ filter })
    get().fetchTasks() // Refetch with new filter
  },

  setSorting: (sortBy: TaskSortBy, sortOrder: SortOrder) => {
    set({ sortBy, sortOrder })
    get().fetchTasks() // Refetch with new sorting
  },

  clearError: () => {
    set({ error: null })
  }
}))

// Computed values
export const useFilteredTasks = () => {
  const tasks = useAppStore(state => state.tasks)
  const filter = useAppStore(state => state.filter)
  
  return tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.search && !task.title.toLowerCase().includes(filter.search.toLowerCase())) return false
    return true
  })
}

export const useTaskStats = () => {
  const tasks = useAppStore(state => state.tasks)
  
  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  }
}