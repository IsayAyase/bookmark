import { LoginForm } from '../../../components/auth/login-form'

export default function LoginPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  )
}