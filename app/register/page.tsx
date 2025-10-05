import { RegisterForm } from "@/components/auth/register-form"
import Link from "next/link"
import { Wind } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Wind className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold font-sans">AirWatch</span>
          </Link>
          <h1 className="text-3xl font-bold font-sans">Create an account</h1>
          <p className="text-muted-foreground">Start monitoring air quality with AI-powered insights</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
