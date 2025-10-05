"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Settings, Save, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ThresholdSettings {
  pm25Warning: number
  pm25Critical: number
  pm10Warning: number
  pm10Critical: number
  co2Warning: number
  co2Critical: number
  coWarning: number
  coCritical: number
  no2Warning: number
  no2Critical: number
}

const DEFAULT_THRESHOLDS: ThresholdSettings = {
  pm25Warning: 35,
  pm25Critical: 55,
  pm10Warning: 50,
  pm10Critical: 150,
  co2Warning: 1000,
  co2Critical: 2000,
  coWarning: 9,
  coCritical: 15,
  no2Warning: 100,
  no2Critical: 200,
}

export default function SettingsPage() {
  const [thresholds, setThresholds] = useState<ThresholdSettings>(DEFAULT_THRESHOLDS)
  const { toast } = useToast()

  useEffect(() => {
    const saved = localStorage.getItem("airQualityThresholds")
    if (saved) {
      setThresholds(JSON.parse(saved))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("airQualityThresholds", JSON.stringify(thresholds))
    toast({
      title: "Settings Saved",
      description: "Your custom alert thresholds have been updated.",
    })
  }

  const handleReset = () => {
    setThresholds(DEFAULT_THRESHOLDS)
    localStorage.removeItem("airQualityThresholds")
    toast({
      title: "Settings Reset",
      description: "Alert thresholds have been reset to default values.",
    })
  }

  const updateThreshold = (key: keyof ThresholdSettings, value: string) => {
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setThresholds((prev) => ({ ...prev, [key]: numValue }))
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <h1 className="text-3xl font-bold font-sans">Alert Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Customize alert thresholds based on your health conditions and sensitivity
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Alert Thresholds</CardTitle>
          <CardDescription>
            Set personalized thresholds for patients with respiratory conditions, asthma, or other sensitivities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* PM2.5 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">PM2.5 (µg/m³)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pm25Warning">Warning Level</Label>
                <Input
                  id="pm25Warning"
                  type="number"
                  value={thresholds.pm25Warning}
                  onChange={(e) => updateThreshold("pm25Warning", e.target.value)}
                  min="0"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">Default: 35 µg/m³</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pm25Critical">Critical Level</Label>
                <Input
                  id="pm25Critical"
                  type="number"
                  value={thresholds.pm25Critical}
                  onChange={(e) => updateThreshold("pm25Critical", e.target.value)}
                  min="0"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">Default: 55 µg/m³</p>
              </div>
            </div>
          </div>

          {/* PM10 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">PM10 (µg/m³)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pm10Warning">Warning Level</Label>
                <Input
                  id="pm10Warning"
                  type="number"
                  value={thresholds.pm10Warning}
                  onChange={(e) => updateThreshold("pm10Warning", e.target.value)}
                  min="0"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">Default: 50 µg/m³</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pm10Critical">Critical Level</Label>
                <Input
                  id="pm10Critical"
                  type="number"
                  value={thresholds.pm10Critical}
                  onChange={(e) => updateThreshold("pm10Critical", e.target.value)}
                  min="0"
                  step="1"
                />
                <p className="text-xs text-muted-foreground">Default: 150 µg/m³</p>
              </div>
            </div>
          </div>

          {/* CO2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">CO2 (ppm)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="co2Warning">Warning Level</Label>
                <Input
                  id="co2Warning"
                  type="number"
                  value={thresholds.co2Warning}
                  onChange={(e) => updateThreshold("co2Warning", e.target.value)}
                  min="0"
                  step="50"
                />
                <p className="text-xs text-muted-foreground">Default: 1000 ppm</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="co2Critical">Critical Level</Label>
                <Input
                  id="co2Critical"
                  type="number"
                  value={thresholds.co2Critical}
                  onChange={(e) => updateThreshold("co2Critical", e.target.value)}
                  min="0"
                  step="50"
                />
                <p className="text-xs text-muted-foreground">Default: 2000 ppm</p>
              </div>
            </div>
          </div>

          {/* CO */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">CO (ppm)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="coWarning">Warning Level</Label>
                <Input
                  id="coWarning"
                  type="number"
                  value={thresholds.coWarning}
                  onChange={(e) => updateThreshold("coWarning", e.target.value)}
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">Default: 9 ppm</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coCritical">Critical Level</Label>
                <Input
                  id="coCritical"
                  type="number"
                  value={thresholds.coCritical}
                  onChange={(e) => updateThreshold("coCritical", e.target.value)}
                  min="0"
                  step="0.1"
                />
                <p className="text-xs text-muted-foreground">Default: 15 ppm</p>
              </div>
            </div>
          </div>

          {/* NO2 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">NO2 (ppb)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="no2Warning">Warning Level</Label>
                <Input
                  id="no2Warning"
                  type="number"
                  value={thresholds.no2Warning}
                  onChange={(e) => updateThreshold("no2Warning", e.target.value)}
                  min="0"
                  step="10"
                />
                <p className="text-xs text-muted-foreground">Default: 100 ppb</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="no2Critical">Critical Level</Label>
                <Input
                  id="no2Critical"
                  type="number"
                  value={thresholds.no2Critical}
                  onChange={(e) => updateThreshold("no2Critical", e.target.value)}
                  min="0"
                  step="10"
                />
                <p className="text-xs text-muted-foreground">Default: 200 ppb</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
            <Button onClick={handleReset} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
