export interface Bookmark {
  id: string;
  user_id: string;
  title: string;
  url: string;
  created_at: string;
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

export interface BookmarkFormData {
  title: string;
  url: string;
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

export interface BookmarkFilter {
  search?: string;
}

export type BookmarkSortBy = 'created_at' | 'title';
export type SortOrder = 'asc' | 'desc';
