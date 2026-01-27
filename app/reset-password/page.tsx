"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuthStore } from '@/stores/auth-store';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const resetSchema = z.object({
  email: z.string().email('Invalid email address')
})

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const { resetPassword } = useAuthStore()
  const { register, handleSubmit, formState: { errors } } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema)
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const onSubmit = async (data: ResetFormData) => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await resetPassword(data.email)
      if (res && res.error) {
        setMessage(res.error.message)
      } else {
        setMessage('If an account with that email exists, a password reset link has been sent.')
      }
    } catch (e) {
      setMessage('Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-6 space-y-4 border rounded-md bg-card shadow">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <p className="text-muted-foreground text-sm">Enter your email to receive a password reset link.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <div className="flex items-center gap-2"><LoadingSpinner size="sm" />Sending...</div>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
        {message && <div className="text-sm mt-2">{message}</div>}
        <div className="text-center text-sm pt-2">
          <Link href="/login" className="text-primary hover:underline">Back to login</Link>
        </div>
      </div>
    </div>
  )
}
