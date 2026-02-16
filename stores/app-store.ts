import { create } from 'zustand'
import { Bookmark, BookmarkFilter, BookmarkSortBy, SortOrder, BookmarkFormData } from '@/types'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface BookmarkStore {
  bookmarks: Bookmark[]
  loading: boolean
  error: string | null
  filter: BookmarkFilter
  sortBy: BookmarkSortBy
  sortOrder: SortOrder
  realtimeChannel: RealtimeChannel | null
  
  // Actions
  fetchBookmarks: () => Promise<void>
  createBookmark: (bookmarkData: BookmarkFormData) => Promise<{ error?: string; bookmarkId?: string }>
  deleteBookmark: (id: string) => Promise<{ error?: string }>
  setFilter: (filter: BookmarkFilter) => void
  setSorting: (sortBy: BookmarkSortBy, sortOrder: SortOrder) => void
  clearError: () => void
  subscribeToRealtime: () => void
  unsubscribeFromRealtime: () => void
}

export const useAppStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,
  filter: {},
  sortBy: 'created_at',
  sortOrder: 'desc',
  realtimeChannel: null,

  subscribeToRealtime: () => {
    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          const { bookmarks } = get()
          
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            // Only add if not already in the list (prevents duplicates from own actions)
            if (!bookmarks.find(b => b.id === newBookmark.id)) {
              set({ bookmarks: [newBookmark, ...bookmarks] })
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedBookmark = payload.old as Bookmark
            set({ bookmarks: bookmarks.filter(b => b.id !== deletedBookmark.id) })
          }
        }
      )
      .subscribe()

    set({ realtimeChannel: channel })
  },

  unsubscribeFromRealtime: () => {
    const { realtimeChannel } = get()
    if (realtimeChannel) {
      supabase.removeChannel(realtimeChannel)
      set({ realtimeChannel: null })
    }
  },

  fetchBookmarks: async () => {
    try {
      set({ loading: true, error: null })
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ error: 'User not authenticated', loading: false })
        return
      }

      let query = supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)

      // Apply sorting
      const { sortBy, sortOrder } = get()
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      const { data, error } = await query

      if (error) {
        set({ error: error.message, loading: false })
        return
      }

      set({ bookmarks: data || [], loading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch bookmarks', 
        loading: false 
      })
    }
  },

  createBookmark: async (bookmarkData: BookmarkFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { error: 'User not authenticated' }
      }

      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          ...bookmarkData,
          user_id: user.id
        })
        .select()
        .single()

      if (error) {
        return { error: error.message }
      }

      // Don't manually add to state - let realtime handle it
      // This ensures consistency across tabs

      return { bookmarkId: data.id }
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to create bookmark' 
      }
    }
  },

  deleteBookmark: async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', id)

      if (error) {
        return { error: error.message }
      }

      // Don't manually remove from state - let realtime handle it
      // This ensures consistency across tabs

      return {}
    } catch (error) {
      return { 
        error: error instanceof Error ? error.message : 'Failed to delete bookmark' 
      }
    }
  },

  setFilter: (filter: BookmarkFilter) => {
    set({ filter })
  },

  setSorting: (sortBy: BookmarkSortBy, sortOrder: SortOrder) => {
    set({ sortBy, sortOrder })
    get().fetchBookmarks() // Refetch with new sorting
  },

  clearError: () => {
    set({ error: null })
  }
}))

// Computed values
export const useFilteredBookmarks = () => {
  const bookmarks = useAppStore(state => state.bookmarks)
  const filter = useAppStore(state => state.filter)
  
  return bookmarks.filter(bookmark => {
    if (filter.search) {
      const searchLower = filter.search.toLowerCase()
      return (
        bookmark.title.toLowerCase().includes(searchLower) ||
        bookmark.url.toLowerCase().includes(searchLower)
      )
    }
    return true
  })
}

export const useBookmarkStats = () => {
  const bookmarks = useAppStore(state => state.bookmarks)
  
  return {
    total: bookmarks.length
  }
}
