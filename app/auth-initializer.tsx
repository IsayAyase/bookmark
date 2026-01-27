'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().initializeAuth()
  }, [])

  return <>{children}</>
}