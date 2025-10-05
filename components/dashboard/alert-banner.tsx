"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, X, Bell, MapPin, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api, fetchApi } from "@/lib/api"
import type { Alert as AlertType } from "@/lib/types"

export function AlertBanner() {
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [dismissingAlerts, setDismissingAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetchApi<AlertType[]>(api.getAlerts())
        setAlerts(response)
      } catch (err) {
        if (Math.random() > 0.97) {
          const mockAlert = generateDetailedMockAlert()
          setAlerts([mockAlert])
        }
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000)
    return () => clearInterval(interval)
  }, [])

  const activeAlerts = alerts.filter((alert) => !dismissedAlerts.has(alert.id))

  const dismissAlert = (alertId: string) => {
    setDismissingAlerts((prev) => new Set(prev).add(alertId))
    setTimeout(() => {
      setDismissedAlerts((prev) => new Set(prev).add(alertId))
      setDismissingAlerts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(alertId)
        return newSet
      })
    }, 300)
  }

  if (activeAlerts.length === 0) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 space-y-2 p-4">
      {activeAlerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.level === "critical" ? "destructive" : "default"}
          className={`${
            alert.level === "critical" ? "bg-red-500/10 border-red-500/50" : "bg-yellow-500/10 border-yellow-500/50"
          } backdrop-blur-sm transition-all duration-300 shadow-lg ${
            dismissingAlerts.has(alert.id)
              ? "animate-out slide-out-to-top-5 opacity-0"
              : "animate-in slide-in-from-top-5"
          }`}
        >
          <div className="flex items-start gap-3">
            {alert.level === "critical" ? (
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            ) : (
              <Bell className="h-5 w-5 text-yellow-600 shrink-0" />
            )}
            <div className="flex-1 space-y-2">
              <AlertTitle className="font-semibold flex items-center gap-2">
                {alert.type} {alert.level === "critical" ? "Critical Alert" : "Warning"}
                {alert.location && (
                  <span className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {alert.location}
                  </span>
                )}
              </AlertTitle>
              <AlertDescription className="space-y-2">
                <p className="font-medium">{alert.message}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Current: <strong>{alert.value.toFixed(1)}</strong>
                  </span>
                  <span>
                    Threshold: <strong>{alert.threshold}</strong>
                  </span>
                  <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>
                {alert.healthAdvice && (
                  <div className="mt-2 p-2 bg-background/50 rounded text-sm border border-border/50">
                    <p className="font-medium text-xs uppercase tracking-wide mb-1">Health Advisory:</p>
                    <p>{alert.healthAdvice}</p>
                  </div>
                )}
              </AlertDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dismissAlert(alert.id)}
              className="shrink-0 h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all duration-200 rounded-full group"
              aria-label="Close alert"
              title="Close alert"
            >
              <X className="h-5 w-5 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
            </Button>
          </div>
        </Alert>
      ))}
    </div>
  )
}

function generateDetailedMockAlert(): AlertType {
  const locations = ["Anna Salai", "Mount Road", "T. Nagar", "Guindy", "Adyar", "Velachery"]
  const location = locations[Math.floor(Math.random() * locations.length)]

  const alertTypes = [
    {
      type: "PM2.5" as const,
      critical: {
        value: 55 + Math.random() * 30,
        threshold: 55,
        message: `Hazardous PM2.5 levels detected at ${location} monitoring station due to heavy traffic congestion and vehicle emissions`,
        healthAdvice:
          "Avoid outdoor activities. Keep windows closed. Use N95 masks if going outside is necessary. Vulnerable groups (children, elderly, asthma patients) should stay indoors with air purifiers running.",
      },
      warning: {
        value: 35 + Math.random() * 15,
        threshold: 35,
        message: `Elevated PM2.5 levels at ${location} - likely from increased vehicular traffic during rush hour`,
        healthAdvice:
          "Limit prolonged outdoor exposure. Sensitive individuals should reduce strenuous activities. Consider wearing masks during commute.",
      },
    },
    {
      type: "PM10" as const,
      critical: {
        value: 150 + Math.random() * 50,
        threshold: 150,
        message: `Critical PM10 concentration at ${location} - construction dust and road debris contributing to poor air quality`,
        healthAdvice:
          "Stay indoors. Close all windows. Avoid physical exertion. Patients with respiratory conditions should monitor symptoms closely.",
      },
      warning: {
        value: 50 + Math.random() * 80,
        threshold: 50,
        message: `Moderate PM10 levels detected at ${location} monitoring point`,
        healthAdvice: "Reduce outdoor activities. Sensitive groups should take precautions.",
      },
    },
    {
      type: "CO2" as const,
      critical: {
        value: 2000 + Math.random() * 500,
        threshold: 2000,
        message: `Dangerously high CO2 levels at ${location} intersection - heavy traffic congestion with poor air circulation`,
        healthAdvice:
          "Avoid the area if possible. If commuting through, keep vehicle windows closed and use AC recirculation mode. Pedestrians should use alternate routes.",
      },
      warning: {
        value: 1000 + Math.random() * 800,
        threshold: 1000,
        message: `Elevated CO2 concentration at ${location} due to increased traffic volume`,
        healthAdvice: "Minimize time spent in traffic. Consider using public transport or carpooling.",
      },
    },
    {
      type: "CO" as const,
      critical: {
        value: 15 + Math.random() * 10,
        threshold: 15,
        message: `Critical carbon monoxide levels at ${location} - primarily from vehicle exhaust in congested traffic`,
        healthAdvice:
          "Immediate health risk. Avoid the area. Symptoms include headache, dizziness, nausea. Seek medical attention if experiencing symptoms.",
      },
      warning: {
        value: 9 + Math.random() * 5,
        threshold: 9,
        message: `Elevated CO levels detected at ${location} traffic junction`,
        healthAdvice: "Limit exposure. Avoid idling in traffic. Heart patients should be especially cautious.",
      },
    },
    {
      type: "NO2" as const,
      critical: {
        value: 200 + Math.random() * 100,
        threshold: 200,
        message: `Severe nitrogen dioxide pollution at ${location} - diesel vehicle emissions and industrial activity`,
        healthAdvice:
          "Stay indoors. Close windows. Asthmatics should keep rescue inhalers accessible. Avoid outdoor exercise completely.",
      },
      warning: {
        value: 100 + Math.random() * 80,
        threshold: 100,
        message: `Increased NO2 levels at ${location} from traffic emissions`,
        healthAdvice: "Reduce outdoor time. Respiratory patients should monitor symptoms.",
      },
    },
  ]

  const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
  const level: "critical" | "warning" = Math.random() > 0.5 ? "critical" : "warning"
  const data = alertType[level]

  return {
    id: `alert-${Date.now()}-${Math.random()}`,
    type: alertType.type,
    level,
    message: data.message,
    value: data.value,
    threshold: data.threshold,
    timestamp: new Date().toISOString(),
    location,
    healthAdvice: data.healthAdvice,
  }
}
