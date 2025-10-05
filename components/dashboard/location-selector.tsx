"use client"

import { MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CHENNAI_LOCATIONS } from "@/lib/types"

interface LocationSelectorProps {
  selectedLocation: string
  onLocationChange: (location: string) => void
}

export function LocationSelector({ selectedLocation, onLocationChange }: LocationSelectorProps) {
  const currentLocation = CHENNAI_LOCATIONS.find((loc) => loc.id === selectedLocation)

  return (
    <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <MapPin className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Monitoring Location</p>
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-full border-0 p-0 h-auto focus:ring-0 font-semibold text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CHENNAI_LOCATIONS.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                <div>
                  <div className="font-semibold">{location.name}</div>
                  <div className="text-xs text-muted-foreground">{location.area}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
