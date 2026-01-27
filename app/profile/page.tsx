'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/stores/auth-store'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const { user, updateDisplayName, signOut, resetPassword, loading } = useAuthStore()
  const [name, setName] = useState<string>(user?.display_name ?? '')
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    if (user?.display_name !== undefined) {
      setName(user.display_name ?? '')
    }
  }, [user?.display_name])

  const onSave = async () => {
    if (!name) {
      setStatus('Name cannot be empty')
      return
    }
    const res = await updateDisplayName(name)
    if (res?.error) {
      setStatus(res.error as string)
    } else {
      setStatus('Profile updated')
    }
  }

  const onLogout = async () => {
    await signOut()
  }

  const onReset = async () => {
    if (!user?.email) return
    const res = await resetPassword(user.email)
    if (res?.error) {
      setStatus(res.error as string)
    } else {
      setStatus('Password reset email sent')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-2xl w-full p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Email</Label>
              <div className="p-2 border rounded bg-muted/10">{user?.email ?? ''}</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Button onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={onReset}>Reset Password</Button>
            <Button variant="outline" onClick={onLogout}>Logout</Button>
          </div>
          {status && <div className="text-sm text-muted-foreground mt-2">{status}</div>}
        </div>
      </div>
    </ProtectedRoute>
  )
}
