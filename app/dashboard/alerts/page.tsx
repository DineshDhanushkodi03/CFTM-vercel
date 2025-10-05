"use client"

import { AlertHistory } from "@/components/dashboard/alert-history"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell } from "lucide-react"

export default function AlertsPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold font-sans">Alert History</h1>
        </div>
        <p className="text-muted-foreground">
          Track air quality threshold breaches and pollution spikes during peak traffic hours in Chennai
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <AlertHistory />
      </Suspense>
    </div>
  )
}

function TableSkeleton() {
  return <Skeleton className="h-96 w-full" />
}
