'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
          return
        }

        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            display_name: session.user.user_metadata?.display_name,
            created_at: session.user.created_at
          }
          setAuthState({ user, loading: false, error: null })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      } catch (error) {
        setAuthState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : 'Unknown error', 
          loading: false 
        }))
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            display_name: session.user.user_metadata?.display_name,
            created_at: session.user.created_at
          }
          setAuthState({ user, loading: false, error: null })
        } else {
          setAuthState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      router.push('/dashboard')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }))
      
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
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }))
        return { error }
      }

      setAuthState(prev => ({ ...prev, loading: false }))
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { error: errorMessage }
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setAuthState({ user: null, loading: false, error: null })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      setAuthState(prev => ({ ...prev, error: errorMessage }))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      return { error }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset failed' }
    }
  }

  const value: AuthContextType = {
    ...authState,
    signIn,
    signUp,
    signOut,
    resetPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}