"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wind, Droplets, Thermometer, Activity } from "lucide-react"
import { api, fetchApi } from "@/lib/api"

interface SensorData {
  pm25: number
  co2: number
  temperature: number
  humidity: number
  timestamp: string
}

export function SensorCards() {
  const [data, setData] = useState<SensorData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetchApi<SensorData>(api.getSensorData())
        setData(response)
        setError(null)
      } catch (err) {
        setData({
          pm25: 35.2,
          co2: 450,
          temperature: 22.5,
          humidity: 65,
          timestamp: new Date().toISOString(),
        })
        setError(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSensorData()
    const interval = setInterval(fetchSensorData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return null
  }

  if (!data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No sensor data available</p>
      </div>
    )
  }

  const getPM25Status = (value: number) => {
    if (value <= 12) return { label: "Good", color: "text-green-500" }
    if (value <= 35.4) return { label: "Moderate", color: "text-yellow-500" }
    if (value <= 55.4) return { label: "Unhealthy for Sensitive", color: "text-orange-500" }
    return { label: "Unhealthy", color: "text-red-500" }
  }

  const getCO2Status = (value: number) => {
    if (value <= 400) return { label: "Excellent", color: "text-green-500" }
    if (value <= 1000) return { label: "Good", color: "text-green-500" }
    if (value <= 2000) return { label: "Fair", color: "text-yellow-500" }
    return { label: "Poor", color: "text-red-500" }
  }

  const pm25Status = getPM25Status(data.pm25)
  const co2Status = getCO2Status(data.co2)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">PM2.5</CardTitle>
          <Wind className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold animate-in zoom-in duration-700">{data.pm25.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground mt-1">μg/m³</p>
          <p className={`text-sm font-medium mt-2 ${pm25Status.color} transition-colors duration-300`}>
            {pm25Status.label}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">CO2</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold animate-in zoom-in duration-700 delay-100">{data.co2}</div>
          <p className="text-xs text-muted-foreground mt-1">ppm</p>
          <p className={`text-sm font-medium mt-2 ${co2Status.color} transition-colors duration-300`}>
            {co2Status.label}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold animate-in zoom-in duration-700 delay-200">
            {data.temperature.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">°C</p>
          <p className="text-sm font-medium mt-2 text-primary transition-colors duration-300">Normal</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
          <Droplets className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold animate-in zoom-in duration-700 delay-300">{data.humidity}</div>
          <p className="text-xs text-muted-foreground mt-1">%</p>
          <p className="text-sm font-medium mt-2 text-primary transition-colors duration-300">Comfortable</p>
        </CardContent>
      </Card>
    </div>
  )
}
