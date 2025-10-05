export interface PollutantData {
  pm25: number // µg/m³
  pm10: number // µg/m³
  co2: number // ppm
  co: number // ppm
  no2: number // ppb
  timestamp: string
}

export interface LocationData {
  location: string
  area: string
  pollutants: PollutantData
  aqi: number
  status: "Good" | "Moderate" | "Poor" | "Severe"
}

export interface SensorData {
  pm25: number
  co2: number
  temperature: number
  humidity: number
  timestamp: string
}

export interface HistoricalDataPoint {
  timestamp: string
  pm25: number
  pm10: number
  co2: number
  co: number
  no2: number
}

export interface Prediction {
  predictedPM25: number
  riskLevel: "Good" | "Moderate" | "Severe"
  confidence: number
  accuracy: number
  timestamp: string
}

export interface Alert {
  id: string
  type: "PM25" | "PM10" | "CO2" | "CO" | "NO2"
  level: "warning" | "critical"
  message: string
  value: number
  threshold: number
  timestamp: string
  location?: string // Made location optional for backward compatibility
  healthAdvice?: string // Added health advice field
}

export const CHENNAI_LOCATIONS = [
  { id: "anna-salai", name: "Anna Salai", area: "Central Business District" },
  { id: "mount-road", name: "Mount Road", area: "Commercial Hub" },
  { id: "t-nagar", name: "T. Nagar", area: "Shopping District" },
  { id: "guindy", name: "Guindy", area: "Industrial Zone" },
  { id: "adyar", name: "Adyar", area: "Residential & IT Corridor" },
  { id: "velachery", name: "Velachery", area: "High-Traffic Junction" },
]
