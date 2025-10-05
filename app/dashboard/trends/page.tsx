"use client"

import { HistoricalTrends } from "@/components/dashboard/historical-trends"
import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"
import { LocationSelector } from "@/components/dashboard/location-selector"

export default function TrendsPage() {
  const [selectedLocation, setSelectedLocation] = useState("Anna Salai")

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold font-sans">Historical Trends</h1>
          </div>
          <LocationSelector selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
        </div>
        <p className="text-muted-foreground">
          Analyze air quality patterns across Chennai&apos;s busiest traffic corridors over time
        </p>
      </div>

      <Suspense fallback={<ChartSkeleton />}>
        <HistoricalTrends location={selectedLocation} />
      </Suspense>
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-96 w-full" />
}
