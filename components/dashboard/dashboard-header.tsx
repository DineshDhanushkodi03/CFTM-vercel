"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Wind, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export function DashboardHeader() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState("")

  useEffect(() => {
    const isAuth = localStorage.getItem("isAuthenticated")
    const email = localStorage.getItem("userEmail")

    if (!isAuth) {
      router.push("/login")
    } else {
      setUserEmail(email || "")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userName")
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Wind className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-sans">AirWatch</h1>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userEmail}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  )
}
