import { supabase } from '@/lib/supabase'
import { AuthState, User } from '@/types'
import { AuthError } from '@supabase/supabase-js'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  initializeAuth: () => Promise<void>
  updateDisplayName: (displayName: string) => Promise<{ error: AuthError | null }>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
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
              display_name: session.user.user_metadata?.display_name,
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

      updateDisplayName: async (displayName: string) => {
        try {
          await supabase.auth.updateUser({ data: { display_name: displayName } })
          const { data: { session } } = await supabase.auth.getSession()
          if (session?.user) {
            const user: User = {
              id: session.user.id,
              email: session.user.email!,
              display_name: session.user.user_metadata?.display_name,
              created_at: session.user.created_at
            }
            set({ user, loading: false, error: null })
            return { error: null }
          }
          return { error: null }
        } catch (error) {
          const msg = error instanceof Error ? error.message : 'Update failed'
          set({ error: msg, loading: false })
          return { error: new AuthError(msg) }
        }
      },

      signIn: async (email: string, password: string) => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) {
            set({ error: error.message, loading: false })
            return { error }
          }

          set({ loading: false })
          return { error: null }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
          set({ error: errorMessage, loading: false })
          return { error: new AuthError(errorMessage) }
        }
      },

      signUp: async (email: string, password: string, displayName?: string) => {
        try {
          set({ loading: true, error: null })

          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: displayName
              }
            }
          })

          if (error) {
            set({ error: error.message, loading: false })
            return { error }
          }

          set({ loading: false })
          return { error: null }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
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
      },

      resetPassword: async (email: string) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email)
          return { error }
        } catch (error) {
          return { error: new AuthError(error instanceof Error ? error.message : 'Reset password failed') }
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
      display_name: session.user.user_metadata?.display_name,
      created_at: session.user.created_at
    }
    useAuthStore.setState({ user, loading: false, error: null })
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, loading: false, error: null })
  } else if (event === 'TOKEN_REFRESHED') {
    await initializeAuth()
  }
})
