import type React from "react"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AlertBanner } from "@/components/dashboard/alert-banner"
import { AirQualityChatbot } from "@/components/dashboard/air-quality-chatbot"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AlertBanner />
      <DashboardNav />
      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">{children}</main>
      <AirQualityChatbot location="Anna Salai" />
    </div>
  )
}
