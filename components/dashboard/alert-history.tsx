"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Clock } from "lucide-react"
import { api, fetchApi } from "@/lib/api"
import type { Alert } from "@/lib/types"

export function AlertHistory() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAlertHistory = async () => {
      try {
        const response = await fetchApi<Alert[]>(api.getAlertHistory(20))
        setAlerts(response)
      } catch (err) {
        const mockAlerts = generateMockAlertHistory()
        setAlerts(mockAlerts)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAlertHistory()
    const interval = setInterval(fetchAlertHistory, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return null
  }

  return (
    <Card className="bg-card border-border transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center transition-transform hover:scale-110 duration-300">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-sans">Alert History</CardTitle>
            <CardDescription>Recent air quality threshold breaches in Chennai traffic zones</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No alerts recorded</p>
          </div>
        ) : (
          <div className="rounded-md border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">Threshold</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert, index) => (
                  <TableRow
                    key={alert.id}
                    className="transition-colors duration-200 hover:bg-muted/50 animate-in fade-in duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {alert.level === "critical" ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                        ) : (
                          <Bell className="h-4 w-4 text-yellow-500" />
                        )}
                        {alert.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={alert.level === "critical" ? "destructive" : "default"}
                        className={
                          alert.level === "warning"
                            ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 transition-all duration-300"
                            : "transition-all duration-300"
                        }
                      >
                        {alert.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{alert.message}</TableCell>
                    <TableCell className="text-right font-mono">{alert.value.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-mono">{alert.threshold}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(alert.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function generateMockAlertHistory(): Alert[] {
  const alerts: Alert[] = []
  const now = new Date()

  for (let i = 0; i < 15; i++) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000 - Math.random() * 60 * 60 * 1000)
    const type: Alert["type"] = Math.random() > 0.5 ? "PM25" : "CO2"
    const level: Alert["level"] = Math.random() > 0.6 ? "critical" : "warning"

    const alertData = {
      PM25: {
        value: level === "critical" ? 55 + Math.random() * 20 : 35 + Math.random() * 15,
        threshold: level === "critical" ? 55 : 35,
        message: level === "critical" ? "PM2.5 levels are dangerously high" : "PM2.5 levels are elevated",
      },
      CO2: {
        value: level === "critical" ? 2000 + Math.random() * 500 : 1000 + Math.random() * 500,
        threshold: level === "critical" ? 2000 : 1000,
        message: level === "critical" ? "CO2 levels are critically high" : "CO2 levels are above normal",
      },
    }

    const data = alertData[type]

    alerts.push({
      id: `alert-${i}`,
      type,
      level,
      message: data.message,
      value: data.value,
      threshold: data.threshold,
      timestamp: timestamp.toISOString(),
    })
  }

  return alerts
}
