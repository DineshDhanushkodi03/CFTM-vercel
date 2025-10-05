"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { api, fetchApi } from "@/lib/api"
import type { HistoricalDataPoint } from "@/lib/types"

type TimeRange = "24h" | "7d" | "30d"
type ChartType = "line" | "bar"

interface HistoricalTrendsProps {
  location: string
}

export function HistoricalTrends({ location }: HistoricalTrendsProps) {
  const [data, setData] = useState<HistoricalDataPoint[]>([])
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const [chartType, setChartType] = useState<ChartType>("line")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true)
      try {
        const hours = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720
        const response = await fetchApi<HistoricalDataPoint[]>(api.getHistoricalData(hours, location))
        setData(response)
      } catch (err) {
        const mockData = generateMockHistoricalData(timeRange, location)
        setData(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistoricalData()
  }, [timeRange, location])

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp)
    if (timeRange === "24h") {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    } else if (timeRange === "7d") {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const formattedData = data.map((point) => ({
    ...point,
    time: formatXAxis(point.timestamp),
  }))

  return (
    <Card className="bg-card border-border min-h-[600px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-sans">Historical Trends - {location}</CardTitle>
            <CardDescription>Analyze air quality patterns over time for this location</CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Select value={chartType} onValueChange={(value) => setChartType(value as ChartType)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pm25">PM2.5</TabsTrigger>
            <TabsTrigger value="pm10">PM10</TabsTrigger>
            <TabsTrigger value="co2">CO2</TabsTrigger>
            <TabsTrigger value="co">CO</TabsTrigger>
            <TabsTrigger value="no2">NO2</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                      name="PM2.5"
                    />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={false}
                      name="PM10"
                    />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={false}
                      name="CO2"
                    />
                    <Line
                      type="monotone"
                      dataKey="co"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={false}
                      name="CO"
                    />
                    <Line
                      type="monotone"
                      dataKey="no2"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      dot={false}
                      name="NO2"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pm25" fill="hsl(var(--chart-1))" name="PM2.5" />
                    <Bar dataKey="pm10" fill="hsl(var(--chart-2))" name="PM10" />
                    <Bar dataKey="co2" fill="hsl(var(--chart-3))" name="CO2" />
                    <Bar dataKey="co" fill="hsl(var(--chart-4))" name="CO" />
                    <Bar dataKey="no2" fill="hsl(var(--chart-5))" name="NO2" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pm25" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm25"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={false}
                      name="PM2.5"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pm25" fill="hsl(var(--chart-1))" name="PM2.5" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="pm10" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pm10"
                      stroke="hsl(var(--chart-2))"
                      strokeWidth={2}
                      dot={false}
                      name="PM10"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="pm10" fill="hsl(var(--chart-2))" name="PM10" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="co2" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="co2"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      dot={false}
                      name="CO2"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="co2" fill="hsl(var(--chart-3))" name="CO2" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="co" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="co"
                      stroke="hsl(var(--chart-4))"
                      strokeWidth={2}
                      dot={false}
                      name="CO"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="co" fill="hsl(var(--chart-4))" name="CO" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="no2" className="space-y-4">
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="no2"
                      stroke="hsl(var(--chart-5))"
                      strokeWidth={2}
                      dot={false}
                      name="NO2"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <YAxis stroke="#d1d5db" fontSize={12} style={{ fill: "#d1d5db" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="no2" fill="hsl(var(--chart-5))" name="NO2" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function generateMockHistoricalData(timeRange: TimeRange, location: string): HistoricalDataPoint[] {
  const now = new Date()
  const data: HistoricalDataPoint[] = []
  let points = 0
  let interval = 0

  if (timeRange === "24h") {
    points = 24
    interval = 60 * 60 * 1000
  } else if (timeRange === "7d") {
    points = 168
    interval = 60 * 60 * 1000
  } else {
    points = 30
    interval = 24 * 60 * 60 * 1000
  }

  // Location-specific pollution multipliers
  const locationFactors: Record<string, { pm: number; co2: number; co: number; no2: number }> = {
    "Anna Salai": { pm: 1.5, co2: 1.4, co: 1.6, no2: 1.5 },
    "Mount Road": { pm: 1.4, co2: 1.3, co: 1.5, no2: 1.4 },
    "T. Nagar": { pm: 1.6, co2: 1.5, co: 1.7, no2: 1.6 },
    Guindy: { pm: 1.3, co2: 1.6, co: 1.4, no2: 1.7 },
    Adyar: { pm: 1.1, co2: 1.2, co: 1.2, no2: 1.3 },
    Velachery: { pm: 1.2, co2: 1.3, co: 1.3, no2: 1.4 },
  }

  const factors = locationFactors[location] || { pm: 1, co2: 1, co: 1, no2: 1 }

  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval)
    const hour = timestamp.getHours()

    // Rush hour effect (8-10 AM and 6-9 PM)
    const rushHourMultiplier = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21) ? 1.4 : 1.0

    data.push({
      timestamp: timestamp.toISOString(),
      pm25: (25 + Math.random() * 20 + Math.sin(i / 5) * 10) * factors.pm * rushHourMultiplier,
      pm10: (40 + Math.random() * 30 + Math.sin(i / 5) * 15) * factors.pm * rushHourMultiplier,
      co2: (400 + Math.random() * 150 + Math.sin(i / 3) * 50) * factors.co2 * rushHourMultiplier,
      co: (2 + Math.random() * 3 + Math.sin(i / 4) * 1) * factors.co * rushHourMultiplier,
      no2: (30 + Math.random() * 40 + Math.sin(i / 6) * 20) * factors.no2 * rushHourMultiplier,
    })
  }

  return data
}
