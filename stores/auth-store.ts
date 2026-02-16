import { supabase } from '@/lib/supabase'
import { AuthState, User } from '@/types'
import { AuthError } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore extends AuthState {
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,

      initializeAuth: async () => {
        try {
          set({ loading: true, error: null })

          const { data: { session }, error } = await supabase.auth.getSession()

          if (error) {
            set({ error: error.message, loading: false })
            return
          }

          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name,
              created_at: session.user.created_at
            }
            set({ user, loading: false, error: null })
          } else {
            set({ user: null, loading: false, error: null })
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            loading: false
          })
        }
      },

      signInWithGoogle: async () => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: `${window.location.origin}/dashboard`
            }
          })

          if (error) {
            set({ error: error.message, loading: false })
            return { error }
          }

          return { error: null }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Google sign in failed'
          set({ error: errorMessage, loading: false })
          return { error: new AuthError(errorMessage) }
        }
      },

      signOut: async () => {
        try {
          await supabase.auth.signOut()
          set({ user: null, loading: false, error: null })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
          set({ error: errorMessage })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
)

// Set up auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
  const { initializeAuth } = useAuthStore.getState()

  if (event === 'SIGNED_IN' && session?.user) {
    const user: User = {
      id: session.user.id,
      email: session.user.email!,
      display_name: session.user.user_metadata?.display_name || session.user.user_metadata?.full_name,
      created_at: session.user.created_at
    }
    useAuthStore.setState({ user, loading: false, error: null })
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, loading: false, error: null })
  } else if (event === 'TOKEN_REFRESHED') {
    await initializeAuth()
  }
})
