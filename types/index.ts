export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  due_date?: string;
}

export interface User {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface TaskFormData {
  title: string;
  description?: string;
  status: Task['status'];
  priority: Task['priority'];
  due_date?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  displayName?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface TaskFilter {
  status?: Task['status'];
  priority?: Task['priority'];
  search?: string;
}

export type TaskSortBy = 'created_at' | 'updated_at' | 'title' | 'due_date' | 'priority';
export type SortOrder = 'asc' | 'desc';