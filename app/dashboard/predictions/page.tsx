"use client"

import { AIPrediction } from "@/components/dashboard/ai-prediction"
import { Suspense, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain } from "lucide-react"
import { LocationSelector } from "@/components/dashboard/location-selector"

export default function PredictionsPage() {
  const [selectedLocation, setSelectedLocation] = useState("Anna Salai")

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold font-sans">AI-Powered Predictions</h1>
          </div>
          <LocationSelector selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
        </div>
        <p className="text-muted-foreground">
          Machine learning forecasts for PM2.5 levels in Chennai&apos;s traffic-heavy areas based on vehicle density and
          weather patterns
        </p>
      </div>

      <Suspense fallback={<PredictionSkeleton />}>
        <AIPrediction location={selectedLocation} />
      </Suspense>
    </div>
  )
}

function PredictionSkeleton() {
  return <Skeleton className="h-64 w-full" />
}
