"use client"

import { useEffect, useState } from "react"
import { Wind, Droplets, Factory, AlertTriangle } from "lucide-react"
import { Card } from "@/components/ui/card"
import type { PollutantData } from "@/lib/types"

interface PollutantCardsProps {
  data: PollutantData
}

const pollutants = [
  {
    key: "pm25" as keyof PollutantData,
    label: "PM2.5",
    unit: "µg/m³",
    icon: Wind,
    thresholds: { good: 30, moderate: 60, poor: 90 },
    description: "Fine Particulate Matter",
  },
  {
    key: "pm10" as keyof PollutantData,
    label: "PM10",
    unit: "µg/m³",
    icon: Droplets,
    thresholds: { good: 50, moderate: 100, poor: 150 },
    description: "Coarse Particulate Matter",
  },
  {
    key: "co2" as keyof PollutantData,
    label: "CO₂",
    unit: "ppm",
    icon: Factory,
    thresholds: { good: 400, moderate: 600, poor: 800 },
    description: "Carbon Dioxide",
  },
  {
    key: "no2" as keyof PollutantData,
    label: "NO₂",
    unit: "ppb",
    icon: AlertTriangle,
    thresholds: { good: 40, moderate: 80, poor: 180 },
    description: "Nitrogen Dioxide",
  },
]

function getStatus(value: number, thresholds: { good: number; moderate: number; poor: number }) {
  if (value <= thresholds.good) return { label: "Good", color: "text-emerald-500", bg: "bg-emerald-500/10" }
  if (value <= thresholds.moderate) return { label: "Moderate", color: "text-amber-500", bg: "bg-amber-500/10" }
  if (value <= thresholds.poor) return { label: "Poor", color: "text-orange-500", bg: "bg-orange-500/10" }
  return { label: "Severe", color: "text-red-500", bg: "bg-red-500/10" }
}

export function PollutantCards({ data }: PollutantCardsProps) {
  const [liveData, setLiveData] = useState<PollutantData>(data)

  useEffect(() => {
    // Initialize with provided data
    setLiveData(data)

    // Update data every 5 seconds with slight variations to simulate real-time monitoring
    const interval = setInterval(() => {
      setLiveData((prevData) => ({
        pm25: data.pm25 + (Math.random() - 0.5) * 5,
        pm10: data.pm10 + (Math.random() - 0.5) * 8,
        co2: data.co2 + (Math.random() - 0.5) * 30,
        no2: data.no2 + (Math.random() - 0.5) * 6,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [data])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {pollutants.map((pollutant) => {
        const value = liveData[pollutant.key] as number
        const status = getStatus(value, pollutant.thresholds)
        const Icon = pollutant.icon

        return (
          <Card
            key={pollutant.key}
            className="p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg cursor-pointer border-border bg-card group"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`h-9 w-9 rounded-md ${status.bg} flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                <Icon className={`h-4 w-4 ${status.color}`} />
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${status.bg} ${status.color} uppercase tracking-wide`}
              >
                {status.label}
              </span>
            </div>
            <div className="space-y-1.5">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">
                {pollutant.description}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight">{value.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground font-medium">{pollutant.unit}</span>
              </div>
              <p className="text-xs font-bold text-foreground/80">{pollutant.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
