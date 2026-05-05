"use client"

import { useEffect, useState } from "react"
import type { SensorData } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Cloud, Droplets, Flame, Wind, AlertCircle } from "lucide-react"

interface RealtimeSensorDisplayProps {
  autoConnect?: boolean
}

export function RealtimeSensorDisplay({ autoConnect = true }: RealtimeSensorDisplayProps) {
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("disconnected")
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [messageCount, setMessageCount] = useState(0)

  useEffect(() => {
    if (!autoConnect) return

    let eventSource: EventSource | null = null
    let reconnectTimeout: NodeJS.Timeout | null = null

    const connectToStream = () => {
      console.log("[v0] Connecting to sensor stream...")
      setConnectionStatus("connecting")

      try {
        eventSource = new EventSource("/api/sensor/stream")

        eventSource.onopen = () => {
          console.log("[v0] SSE connection opened")
          setIsConnected(true)
          setConnectionStatus("connected")
        }

        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            console.log("[v0] Received sensor data:", data)

            if (data.type === "sensor-update") {
              setSensorData({
                temperature: data.temperature,
                humidity: data.humidity,
                mq6: data.mq6,
                co: data.co,
                dust: data.dust,
                timestamp: data.timestamp,
              })
              setLastUpdate(new Date().toLocaleTimeString())
              setMessageCount((prev) => prev + 1)
            }
          } catch (error) {
            console.error("[v0] Error parsing sensor data:", error)
          }
        }

        eventSource.onerror = () => {
          console.error("[v0] SSE connection error")
          setIsConnected(false)
          setConnectionStatus("disconnected")
          eventSource?.close()

          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(() => {
            connectToStream()
          }, 3000)
        }
      } catch (error) {
        console.error("[v0] Failed to create EventSource:", error)
        setConnectionStatus("disconnected")
      }
    }

    connectToStream()

    return () => {
      if (eventSource) {
        eventSource.close()
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout)
      }
    }
  }, [autoConnect])

  if (!sensorData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Real-Time Sensor Data</span>
            <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "connected" && "Live"}
              {connectionStatus === "disconnected" && "Offline"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <AlertCircle className="w-12 h-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              {connectionStatus === "connecting" && "Connecting to sensor stream..."}
              {connectionStatus === "disconnected" && "No sensor data available. Check your NodeMCU connection."}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Real-Time Sensor Data</span>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500">
              Live
            </Badge>
            <span className="text-xs text-muted-foreground">
              {messageCount} updates
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          {/* Temperature and Humidity Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Temperature</span>
                <Cloud className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {sensorData.temperature.toFixed(1)}°C
              </div>
            </div>

            <div className="bg-cyan-50 dark:bg-cyan-950 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Humidity</span>
                <Droplets className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-3xl font-bold text-cyan-600">
                {sensorData.humidity.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* MQ6 and CO Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">MQ6 (LPG)</span>
                <Flame className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {sensorData.mq6.toFixed(0)} ppm
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">CO</span>
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-600">
                {sensorData.co.toFixed(0)} ppm
              </div>
            </div>
          </div>

          {/* Dust Density */}
          <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Dust (PM)</span>
              <Wind className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-600">
              {sensorData.dust.toFixed(0)} µg/m³
            </div>
          </div>

          {/* Status Information */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last Update: {lastUpdate}</span>
              <span>{sensorData.timestamp}</span>
            </div>
          </div>

          {/* Alert Thresholds */}
          <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-200 mb-2">Alert Status:</p>
            <div className="space-y-1 text-xs">
              {sensorData.mq6 > 200 && (
                <p className="text-amber-600 dark:text-amber-400">⚠️ MQ6 above 200 ppm</p>
              )}
              {sensorData.co > 100 && (
                <p className="text-red-600 dark:text-red-400">🚨 CO above 100 ppm</p>
              )}
              {sensorData.dust > 1000 && (
                <p className="text-red-600 dark:text-red-400">🚨 Dust above 1000 µg/m³</p>
              )}
              {sensorData.mq6 <= 200 && sensorData.co <= 100 && sensorData.dust <= 1000 && (
                <p className="text-green-600 dark:text-green-400">✓ All readings within normal range</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
