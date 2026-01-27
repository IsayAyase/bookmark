'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoadingSpinner } from '../components/ui/loading-spinner'
import { useAuthStore } from '../stores/auth-store'

export default function Home() {
  const { user, loading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
      </div>
    </div>
  )
}