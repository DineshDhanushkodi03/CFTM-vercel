"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Activity } from "lucide-react"

interface ChartDataPoint {
  time: string
  pm25: number
  pm10: number
  co2: number
  co: number
  no2: number
}

interface RealTimeChartProps {
  location: string
}

export function RealTimeChart({ location }: RealTimeChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    // Initialize with mock data based on location
    const now = new Date()
    const initialData: ChartDataPoint[] = []

    const baseValues: Record<string, any> = {
      "anna-salai": { pm25: 85, pm10: 120, co2: 520, co: 8.5, no2: 95 },
      "mount-road": { pm25: 78, pm10: 110, co2: 480, co: 7.2, no2: 88 },
      "t-nagar": { pm25: 92, pm10: 135, co2: 550, co: 9.8, no2: 105 },
      guindy: { pm25: 105, pm10: 155, co2: 620, co: 12.5, no2: 125 },
      adyar: { pm25: 65, pm10: 95, co2: 420, co: 5.8, no2: 72 },
      velachery: { pm25: 88, pm10: 125, co2: 510, co: 8.9, no2: 98 },
    }

    const base = baseValues[location] || baseValues["anna-salai"]

    for (let i = 20; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000)
      initialData.push({
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        pm25: base.pm25 + (Math.random() - 0.5) * 10,
        pm10: base.pm10 + (Math.random() - 0.5) * 15,
        co2: base.co2 + (Math.random() - 0.5) * 50,
        co: base.co + (Math.random() - 0.5) * 2,
        no2: base.no2 + (Math.random() - 0.5) * 10,
      })
    }

    setData(initialData)

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prevData) => {
        const newData = [...prevData.slice(1)]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          pm25: base.pm25 + (Math.random() - 0.5) * 10,
          pm10: base.pm10 + (Math.random() - 0.5) * 15,
          co2: base.co2 + (Math.random() - 0.5) * 50,
          co: base.co + (Math.random() - 0.5) * 2,
          no2: base.no2 + (Math.random() - 0.5) * 10,
        })
        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [location])

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="font-sans">Real-Time Pollutant Levels</CardTitle>
            <CardDescription>Live readings updated every 5 seconds</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="time" stroke="#d1d5db" fontSize={12} tickLine={false} style={{ fill: "#d1d5db" }} />
            <YAxis stroke="#d1d5db" fontSize={12} tickLine={false} style={{ fill: "#d1d5db" }} />
            {/* </CHANGE> */}
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
            <Line
              type="monotone"
              dataKey="pm25"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2.5}
              dot={false}
              name="PM2.5 (µg/m³)"
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="pm10"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2.5}
              dot={false}
              name="PM10 (µg/m³)"
              animationDuration={500}
            />
            <Line
              type="monotone"
              dataKey="no2"
              stroke="hsl(var(--chart-4))"
              strokeWidth={2.5}
              dot={false}
              name="NO₂ (ppb)"
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
