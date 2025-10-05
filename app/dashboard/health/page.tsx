"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LocationSelector } from "@/components/dashboard/location-selector"
import { HeartPulse, AlertTriangle, CheckCircle2, Info, Users, Baby, Dumbbell, Wind } from "lucide-react"
import type { ChennaiLocation, SensorData } from "@/lib/types"
import { fetchSensorData } from "@/lib/api"

const userProfiles = [
  { id: "general", label: "General Public", icon: Users, color: "bg-blue-500" },
  { id: "children", label: "Children", icon: Baby, color: "bg-purple-500" },
  { id: "elderly", label: "Elderly", icon: HeartPulse, color: "bg-orange-500" },
  { id: "asthma", label: "Asthma/Respiratory", icon: Wind, color: "bg-red-500" },
  { id: "athlete", label: "Athletes", icon: Dumbbell, color: "bg-emerald-500" },
]

const healthRecommendations = {
  general: {
    good: [
      "Perfect conditions for outdoor activities",
      "Ideal time for exercise and sports",
      "Windows can be kept open for ventilation",
      "No special precautions needed",
    ],
    moderate: [
      "Limit prolonged outdoor activities",
      "Consider indoor exercise alternatives",
      "Keep windows closed during peak traffic hours",
      "Monitor air quality if symptoms develop",
    ],
    severe: [
      "Avoid outdoor activities",
      "Stay indoors with air purifiers",
      "Keep all windows and doors closed",
      "Wear N95 masks if going outside is necessary",
    ],
  },
  children: {
    good: [
      "Great time for outdoor play and sports",
      "School outdoor activities can proceed normally",
      "Encourage physical activities",
      "No restrictions on outdoor time",
    ],
    moderate: [
      "Reduce outdoor playtime to 1-2 hours",
      "Avoid strenuous activities during peak traffic",
      "Keep children indoors during rush hours (8-10 AM, 6-8 PM)",
      "Watch for coughing or breathing difficulties",
    ],
    severe: [
      "Keep children indoors at all times",
      "Cancel outdoor school activities",
      "Use air purifiers in children's rooms",
      "Seek medical attention if breathing problems occur",
    ],
  },
  elderly: {
    good: [
      "Safe for morning walks and outdoor activities",
      "Good time for gardening and light exercise",
      "Maintain regular outdoor routine",
      "Fresh air ventilation recommended",
    ],
    moderate: [
      "Limit outdoor activities to early morning or evening",
      "Avoid areas with heavy traffic",
      "Keep medications readily available",
      "Monitor for chest discomfort or breathlessness",
    ],
    severe: [
      "Stay indoors completely",
      "Keep emergency medications accessible",
      "Use air purifiers and keep windows closed",
      "Contact doctor if experiencing any respiratory symptoms",
    ],
  },
  asthma: {
    good: [
      "Safe for normal activities with inhaler nearby",
      "Good time for controlled outdoor exercise",
      "Maintain regular medication schedule",
      "Monitor symptoms as usual",
    ],
    moderate: [
      "Carry rescue inhaler at all times",
      "Avoid outdoor activities during peak pollution",
      "Consider increasing controller medication (consult doctor)",
      "Stay away from Anna Salai and Mount Road during rush hours",
    ],
    severe: [
      "Stay indoors with air purifier running",
      "Keep rescue inhaler and spacer ready",
      "Contact doctor immediately if symptoms worsen",
      "Avoid all outdoor exposure - use N95 mask if emergency",
    ],
  },
  athlete: {
    good: [
      "Optimal conditions for training and competition",
      "No restrictions on intensity or duration",
      "Ideal for outdoor endurance activities",
      "Peak performance conditions",
    ],
    moderate: [
      "Reduce training intensity by 30-40%",
      "Move workouts to indoor facilities",
      "Avoid high-intensity intervals outdoors",
      "Schedule training for early morning (before 7 AM)",
    ],
    severe: [
      "Cancel all outdoor training sessions",
      "Switch to indoor gym or home workouts",
      "Postpone competitions if possible",
      "Wear N95 mask if outdoor activity is unavoidable",
    ],
  },
}

export default function HealthAdvisorPage() {
  const [selectedLocation, setSelectedLocation] = useState<ChennaiLocation>("Anna Salai")
  const [selectedProfile, setSelectedProfile] = useState("general")
  const [sensorData, setSensorData] = useState<SensorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const data = await fetchSensorData(selectedLocation)
      setSensorData(data)
      setLoading(false)
    }
    loadData()
  }, [selectedLocation])

  const getAQIStatus = (pm25: number): "good" | "moderate" | "severe" => {
    if (pm25 <= 50) return "good"
    if (pm25 <= 100) return "moderate"
    return "severe"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-emerald-500 bg-emerald-500/10"
      case "moderate":
        return "text-amber-500 bg-amber-500/10"
      case "severe":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
        return <CheckCircle2 className="h-5 w-5" />
      case "moderate":
        return <Info className="h-5 w-5" />
      case "severe":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Info className="h-5 w-5" />
    }
  }

  const status = sensorData ? getAQIStatus(sensorData.pm25) : "moderate"
  const recommendations = healthRecommendations[selectedProfile as keyof typeof healthRecommendations][status]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight">Health Advisor</h1>
          <p className="text-muted-foreground mt-1">Personalized recommendations based on air quality</p>
        </div>
        <LocationSelector selectedLocation={selectedLocation} onLocationChange={setSelectedLocation} />
      </div>

      {/* User Profile Selection */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Select Your Profile
          </CardTitle>
          <CardDescription>Choose the profile that best matches your health needs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {userProfiles.map((profile) => {
              const Icon = profile.icon
              return (
                <Button
                  key={profile.id}
                  variant={selectedProfile === profile.id ? "default" : "outline"}
                  className={`h-auto py-4 flex flex-col gap-2 transition-all duration-200 ${
                    selectedProfile === profile.id ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  onClick={() => setSelectedProfile(profile.id)}
                >
                  <div className={`h-10 w-10 rounded-full ${profile.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center">{profile.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Air Quality Status */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-primary" />
            Current Air Quality at {selectedLocation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">PM2.5</p>
                <p className="text-2xl font-bold">{sensorData?.pm25}</p>
                <p className="text-xs text-muted-foreground">µg/m³</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">PM10</p>
                <p className="text-2xl font-bold">{sensorData?.pm10}</p>
                <p className="text-xs text-muted-foreground">µg/m³</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">CO2</p>
                <p className="text-2xl font-bold">{sensorData?.co2}</p>
                <p className="text-xs text-muted-foreground">ppm</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">CO</p>
                <p className="text-2xl font-bold">{sensorData?.co}</p>
                <p className="text-xs text-muted-foreground">ppm</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">NO2</p>
                <p className="text-2xl font-bold">{sensorData?.no2}</p>
                <p className="text-xs text-muted-foreground">ppb</p>
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center gap-3">
            <Badge className={`${getStatusColor(status)} px-4 py-2 text-sm font-medium flex items-center gap-2`}>
              {getStatusIcon(status)}
              {status.charAt(0).toUpperCase() + status.slice(1)} Air Quality
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Health Recommendations */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Personalized Health Recommendations
          </CardTitle>
          <CardDescription>
            Based on current air quality and your profile: {userProfiles.find((p) => p.id === selectedProfile)?.label}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
              >
                <div
                  className={`mt-0.5 h-6 w-6 rounded-full ${getStatusColor(status)} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location-Specific Advisory */}
      <Card className="border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Location-Specific Advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <h4 className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-400">About {selectedLocation}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedLocation === "Anna Salai" &&
                  "One of Chennai's busiest arterial roads with heavy vehicular traffic throughout the day. Peak pollution hours: 8-10 AM and 6-8 PM."}
                {selectedLocation === "Mount Road" &&
                  "Major commercial hub with continuous traffic flow. High concentration of diesel vehicles and buses. Avoid during rush hours."}
                {selectedLocation === "T. Nagar" &&
                  "Dense commercial area with narrow streets and heavy congestion. Poor air circulation makes pollution levels higher than average."}
                {selectedLocation === "Guindy" &&
                  "Industrial and residential mix with moderate traffic. Air quality affected by nearby factories and highway traffic."}
                {selectedLocation === "Adyar" &&
                  "Residential area with moderate traffic. Better air quality compared to commercial zones, especially near the river."}
                {selectedLocation === "Velachery" &&
                  "Rapidly developing area with increasing traffic. Air quality varies significantly between main roads and residential streets."}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <h4 className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-400">Best Times to Visit</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                For outdoor activities at {selectedLocation}, the best times are early morning (5-7 AM) before traffic
                builds up, or late evening (after 9 PM) when traffic subsides. Avoid peak hours for better air quality.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
