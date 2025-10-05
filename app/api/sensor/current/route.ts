import { type NextRequest, NextResponse } from "next/server"

/**
 * API Route: Get Current Sensor Data
 *
 * This endpoint returns real-time sensor readings for air quality monitoring.
 *
 * HARDWARE INTEGRATION GUIDE:
 * ---------------------------
 * To integrate your real hardware sensors:
 *
 * 1. Replace the mock data generation with actual sensor readings
 * 2. Connect to your sensor hardware using appropriate libraries:
 *    - For Arduino/ESP32: Use serial communication or HTTP requests
 *    - For Raspberry Pi: Use GPIO libraries or I2C/SPI protocols
 *    - For IoT platforms: Use MQTT, WebSockets, or REST APIs
 *
 * 3. Expected sensor data format:
 *    {
 *      pm25: number,    // PM2.5 in µg/m³
 *      pm10: number,    // PM10 in µg/m³
 *      co2: number,     // CO2 in ppm
 *      no2: number,     // NO2 in ppb
 *      temperature: number,  // Temperature in °C
 *      humidity: number,     // Humidity in %
 *      location: string,     // Sensor location
 *      timestamp: string     // ISO timestamp
 *    }
 *
 * 4. Example hardware integration:
 *    ```typescript
 *    import { SerialPort } from 'serialport'
 *    const port = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 })
 *    const sensorData = await readFromSensor(port)
 *    ```
 *
 * 5. For database storage, consider using:
 *    - PostgreSQL with TimescaleDB for time-series data
 *    - InfluxDB for high-frequency sensor data
 *    - MongoDB for flexible schema
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Anna Salai"

    // TODO: Replace this with actual sensor hardware integration
    // Example: const sensorData = await readFromHardwareSensor(location)

    const mockData = generateMockSensorData(location)

    return NextResponse.json(mockData, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("[API] Error fetching sensor data:", error)
    return NextResponse.json({ error: "Failed to fetch sensor data" }, { status: 500 })
  }
}

// Mock data generator - Replace this with actual hardware readings
function generateMockSensorData(location: string) {
  const baseValues: Record<string, any> = {
    "Anna Salai": { pm25: 85, pm10: 120, co2: 450, no2: 65 },
    "Mount Road": { pm25: 92, pm10: 135, co2: 480, no2: 72 },
    "T. Nagar": { pm25: 105, pm10: 145, co2: 520, no2: 78 },
    Guindy: { pm25: 78, pm10: 110, co2: 420, no2: 58 },
    Adyar: { pm25: 45, pm10: 75, co2: 380, no2: 42 },
    Velachery: { pm25: 68, pm10: 95, co2: 410, no2: 52 },
  }

  const base = baseValues[location] || baseValues["Anna Salai"]

  return {
    pm25: base.pm25 + (Math.random() - 0.5) * 10,
    pm10: base.pm10 + (Math.random() - 0.5) * 15,
    co2: base.co2 + (Math.random() - 0.5) * 50,
    no2: base.no2 + (Math.random() - 0.5) * 10,
    temperature: 30 + (Math.random() - 0.5) * 5,
    humidity: 65 + (Math.random() - 0.5) * 10,
    location,
    timestamp: new Date().toISOString(),
    status: calculateAQIStatus(base.pm25),
  }
}

function calculateAQIStatus(pm25: number): string {
  if (pm25 <= 50) return "Good"
  if (pm25 <= 100) return "Moderate"
  if (pm25 <= 150) return "Unhealthy for Sensitive Groups"
  if (pm25 <= 200) return "Unhealthy"
  if (pm25 <= 300) return "Very Unhealthy"
  return "Hazardous"
}
