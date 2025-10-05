"use client"

import { Card } from "@/components/ui/card"
import { MapPin, TrendingUp, Factory, Car, Building2 } from "lucide-react"
import type { PollutantData } from "@/lib/types"

interface LocationPollutionData {
  id: string
  name: string
  area: string
  pollutants: PollutantData
  predictedSource: string
  mostLikelySource: string
  sourceIcon: typeof Car
  sourceColor: string
}

const chennaiLocations: LocationPollutionData[] = [
  {
    id: "anna-salai",
    name: "Anna Salai",
    area: "Central Business District",
    pollutants: { pm25: 85, pm10: 120, co2: 520, co: 8.5, no2: 95, timestamp: new Date().toISOString() },
    predictedSource: "Heavy vehicular traffic during peak hours",
    mostLikelySource: "Vehicle Emissions (Cars, Buses, Two-wheelers)",
    sourceIcon: Car,
    sourceColor: "text-orange-600",
  },
  {
    id: "t-nagar",
    name: "T. Nagar",
    area: "Shopping District",
    pollutants: { pm25: 92, pm10: 135, co2: 550, co: 9.8, no2: 105, timestamp: new Date().toISOString() },
    predictedSource: "Dense commercial activity and traffic congestion",
    mostLikelySource: "Mixed Sources (Traffic + Commercial Activities)",
    sourceIcon: Building2,
    sourceColor: "text-red-600",
  },
  {
    id: "guindy",
    name: "Guindy",
    area: "Industrial Zone",
    pollutants: { pm25: 105, pm10: 155, co2: 620, co: 12.5, no2: 125, timestamp: new Date().toISOString() },
    predictedSource: "Industrial emissions and highway traffic",
    mostLikelySource: "Industrial Emissions (Factories, Manufacturing)",
    sourceIcon: Factory,
    sourceColor: "text-purple-600",
  },
  {
    id: "adyar",
    name: "Adyar",
    area: "Residential & IT Corridor",
    pollutants: { pm25: 65, pm10: 95, co2: 420, co: 5.8, no2: 72, timestamp: new Date().toISOString() },
    predictedSource: "Moderate traffic from IT commuters",
    mostLikelySource: "Vehicle Emissions (Commuter Traffic)",
    sourceIcon: Car,
    sourceColor: "text-blue-600",
  },
]

function getAQIStatus(pm25: number) {
  if (pm25 <= 30) return { label: "Good", color: "text-emerald-600", bg: "bg-emerald-50" }
  if (pm25 <= 60) return { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50" }
  if (pm25 <= 90) return { label: "Poor", color: "text-orange-600", bg: "bg-orange-50" }
  return { label: "Severe", color: "text-red-600", bg: "bg-red-50" }
}

export function ChennaiLocationsOverview() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Chennai High-Traffic Zones - Pollution Overview</h2>
      </div>
      <p className="text-sm text-muted-foreground">
        Real-time pollution data and source analysis for four major traffic hotspots in Chennai
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {chennaiLocations.map((location) => {
          const status = getAQIStatus(location.pollutants.pm25)
          const SourceIcon = location.sourceIcon

          return (
            <Card key={location.id} className="p-5 hover:shadow-lg transition-shadow duration-300">
              <div className="space-y-4">
                {/* Location Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">{location.area}</p>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Pollutant Levels */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">PM2.5</p>
                    <p className="text-lg font-bold">{location.pollutants.pm25.toFixed(1)} µg/m³</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">PM10</p>
                    <p className="text-lg font-bold">{location.pollutants.pm10.toFixed(1)} µg/m³</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">CO₂</p>
                    <p className="text-lg font-bold">{location.pollutants.co2.toFixed(0)} ppm</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">NO₂</p>
                    <p className="text-lg font-bold">{location.pollutants.no2.toFixed(0)} ppb</p>
                  </div>
                </div>

                {/* Pollution Source */}
                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Predicted Source
                    </p>
                  </div>
                  <p className="text-sm">{location.predictedSource}</p>

                  <div className="flex items-start gap-2 mt-3 p-3 rounded-lg bg-muted/50">
                    <SourceIcon className={`h-5 w-5 ${location.sourceColor} mt-0.5`} />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Most Likely Source</p>
                      <p className={`text-sm font-bold ${location.sourceColor}`}>{location.mostLikelySource}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
