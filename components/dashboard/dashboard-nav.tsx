"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BarChart3, Brain, Bell, LogOut, Settings, HeartPulse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Real-time air quality data",
  },
  {
    title: "Analytics",
    href: "/dashboard/trends",
    icon: BarChart3,
    description: "Historical analysis",
  },
  {
    title: "Predictions",
    href: "/dashboard/predictions",
    icon: Brain,
    description: "Future forecasts",
  },
  {
    title: "Health Advisor",
    href: "/dashboard/health",
    icon: HeartPulse,
    description: "Health recommendations",
  },
  {
    title: "Alerts",
    href: "/dashboard/alerts",
    icon: Bell,
    description: "Alert history",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Alert thresholds",
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    window.location.href = "/login"
  }

  return (
    <nav className="border-b border-border bg-white/95 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-8 w-8 rounded-md bg-primary/20 flex items-center justify-center transition-all group-hover:bg-primary/30 group-hover:scale-110">
                <LayoutDashboard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight">CFTM</h1>
                <p className="text-[10px] text-muted-foreground">Chennai Traffic Monitor</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "gap-2 h-9 transition-all duration-200 hover:bg-muted",
                        isActive
                          ? "bg-primary/10 text-primary hover:bg-primary/15"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="gap-2 h-9 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Logout</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex gap-1 pb-2 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 h-8 whitespace-nowrap transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs">{item.title}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
