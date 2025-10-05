import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"
import { Wind } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Wind className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-sans">AirWatch</span>
          </Link>
          <h1 className="text-3xl font-bold font-sans">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account to access your dashboard</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
