import { SignupForm } from '../../../components/auth/signup-form'

export default function SignupPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  )
}