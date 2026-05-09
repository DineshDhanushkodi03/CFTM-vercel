"use client"

import { useState, useEffect } from "react"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin } from "lucide-react"
import { LocationSelector } from "@/components/dashboard/location-selector"
import { PollutantCards } from "@/components/dashboard/pollutant-cards"
import { RealTimeChart } from "@/components/dashboard/real-time-chart"
import { ChennaiLocationsOverview } from "@/components/dashboard/chennai-locations-overview"
import type { PollutantData } from "@/lib/types"

function generateMockData(locationId: string): PollutantData {
  const baseValues: Record<string, Partial<PollutantData>> = {
    "anna-salai": { pm25: 85, pm10: 120, co2: 520, co: 8.5, no2: 95 },
    "mount-road": { pm25: 78, pm10: 110, co2: 480, co: 7.2, no2: 88 },
    "t-nagar": { pm25: 92, pm10: 135, co2: 550, co: 9.8, no2: 105 },
    guindy: { pm25: 105, pm10: 155, co2: 620, co: 12.5, no2: 125 },
    adyar: { pm25: 65, pm10: 95, co2: 420, co: 5.8, no2: 72 },
    velachery: { pm25: 88, pm10: 125, co2: 510, co: 8.9, no2: 98 },
  }

  const base = baseValues[locationId] || baseValues["anna-salai"]
  const variance = 0.1

  return {
    pm25: base.pm25! * (1 + (Math.random() - 0.5) * variance),
    pm10: base.pm10! * (1 + (Math.random() - 0.5) * variance),
    co2: base.co2! * (1 + (Math.random() - 0.5) * variance),
    co: base.co! * (1 + (Math.random() - 0.5) * variance),
    no2: base.no2! * (1 + (Math.random() - 0.5) * variance),
    timestamp: new Date().toISOString(),
  }
}

export default function DashboardPage() {
  const [selectedLocation, setSelectedLocation] = useState("anna-salai")
  const [pollutantData, setPollutantData] = useState<PollutantData | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setPollutantData(generateMockData("anna-salai"))
    setIsHydrated(true)
  }, [])

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location)
    setPollutantData(generateMockData(location))
  }

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold font-sans">Gas Detection Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time monitoring of CO₂, NO₂, PM2.5, and PM10 levels across Chennai&apos;s high-traffic zones
          </p>
        </div>
        <PollutantCardsSkeleton />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold font-sans">Gas Detection Dashboard</h1>
        </div>
        <p className="text-muted-foreground">
          Real-time monitoring of CO₂, NO₂, PM2.5, and PM10 levels across Chennai&apos;s high-traffic zones
        </p>
      </div>

      <LocationSelector selectedLocation={selectedLocation} onLocationChange={handleLocationChange} />

      <Suspense fallback={<PollutantCardsSkeleton />}>
        <PollutantCards data={pollutantData!} />
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <ChennaiLocationsOverview />
      </Suspense>

      <Suspense fallback={<ChartSkeleton />}>
        <RealTimeChart location={selectedLocation} />
      </Suspense>
    </div>
  )
}

function PollutantCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-40" />
      ))}
    </div>
  )
}

function ChartSkeleton() {
  return <Skeleton className="h-96 w-full" />
}
