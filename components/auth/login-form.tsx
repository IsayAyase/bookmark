'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

export function LoginForm() {
  const { signIn, loading, error } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    const result = await signIn(data.email, data.password)
    
    if (result.error) {
      setError('root', { message: typeof result.error === 'string' ? result.error : 'Login failed' })
    }
    setIsSubmitting(false)
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-muted-foreground mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register('email')}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            disabled={isSubmitting}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {(error || errors.root?.message) && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {error || errors.root?.message}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Don't have an account? </span>
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>

      <div className="text-center">
        <Link 
          href="/reset-password" 
          className="text-sm text-primary hover:underline"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}