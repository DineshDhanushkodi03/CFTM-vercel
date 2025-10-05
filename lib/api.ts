// API configuration with environment variable support
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

export const api = {
  baseUrl: API_BASE_URL,

  // Sensor data endpoints
  getSensorData: (location?: string) => `${API_BASE_URL}/api/sensor/current${location ? `?location=${location}` : ""}`,
  getHistoricalData: (hours = 24, location?: string) =>
    `${API_BASE_URL}/api/sensor/history?hours=${hours}${location ? `&location=${location}` : ""}`,

  // AI prediction endpoints
  getPrediction: (location?: string) => `${API_BASE_URL}/api/prediction${location ? `?location=${location}` : ""}`,

  // Alert endpoints
  getAlerts: (location?: string) => `${API_BASE_URL}/api/alerts${location ? `?location=${location}` : ""}`,
  getAlertHistory: (limit = 10, location?: string) =>
    `${API_BASE_URL}/api/alerts/history?limit=${limit}${location ? `&location=${location}` : ""}`,
}

// Helper function to fetch with error handling
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    // Silently fail and let components handle with mock data
    // Only log in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[v0] API unavailable, using mock data")
    }
    throw error
  }
}

export async function fetchSensorData(location: string) {
  try {
    const data = await fetchApi<any>(api.getSensorData(location))
    return data
  } catch (error) {
    // Return mock data based on location
    const mockData: Record<string, any> = {
      "Anna Salai": {
        pm25: 85,
        pm10: 120,
        co2: 450,
        co: 2.8,
        no2: 65,
        temperature: 32,
        humidity: 68,
        status: "Moderate",
        location: "Anna Salai",
      },
      "Mount Road": {
        pm25: 92,
        pm10: 135,
        co2: 480,
        co: 3.2,
        no2: 72,
        temperature: 33,
        humidity: 65,
        status: "Moderate",
        location: "Mount Road",
      },
      "T. Nagar": {
        pm25: 105,
        pm10: 145,
        co2: 520,
        co: 3.8,
        no2: 78,
        temperature: 34,
        humidity: 62,
        status: "Severe",
        location: "T. Nagar",
      },
      Guindy: {
        pm25: 78,
        pm10: 110,
        co2: 420,
        co: 2.5,
        no2: 58,
        temperature: 31,
        humidity: 70,
        status: "Moderate",
        location: "Guindy",
      },
      Adyar: {
        pm25: 45,
        pm10: 75,
        co2: 380,
        co: 1.8,
        no2: 42,
        temperature: 30,
        humidity: 72,
        status: "Good",
        location: "Adyar",
      },
      Velachery: {
        pm25: 68,
        pm10: 95,
        co2: 410,
        co: 2.2,
        no2: 52,
        temperature: 31,
        humidity: 69,
        status: "Moderate",
        location: "Velachery",
      },
    }

    return mockData[location] || mockData["Anna Salai"]
  }
}
