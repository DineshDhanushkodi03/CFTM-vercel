import { type NextRequest, NextResponse } from "next/server"

/**
 * API Route: Get Historical Sensor Data
 *
 * This endpoint returns historical sensor readings for trend analysis.
 *
 * HARDWARE INTEGRATION GUIDE:
 * ---------------------------
 * To integrate with your database storing sensor readings:
 *
 * 1. Connect to your time-series database:
 *    ```typescript
 *    import { Pool } from 'pg'
 *    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
 *
 *    const result = await pool.query(
 *      'SELECT * FROM sensor_readings WHERE location = $1 AND timestamp > NOW() - INTERVAL $2 ORDER BY timestamp DESC',
 *      [location, `${hours} hours`]
 *    )
 *    ```
 *
 * 2. For real-time data aggregation, consider:
 *    - Averaging readings over time intervals (e.g., 5-minute averages)
 *    - Downsampling for longer time ranges to reduce data transfer
 *    - Caching frequently accessed historical data
 *
 * 3. Database schema suggestion:
 *    CREATE TABLE sensor_readings (
 *      id SERIAL PRIMARY KEY,
 *      location VARCHAR(100),
 *      pm25 DECIMAL(10,2),
 *      pm10 DECIMAL(10,2),
 *      co2 DECIMAL(10,2),
 *      no2 DECIMAL(10,2),
 *      temperature DECIMAL(5,2),
 *      humidity DECIMAL(5,2),
 *      timestamp TIMESTAMPTZ DEFAULT NOW()
 *    );
 *    CREATE INDEX idx_location_timestamp ON sensor_readings(location, timestamp DESC);
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")
    const location = searchParams.get("location") || "Anna Salai"

    // TODO: Replace with actual database query
    // Example: const historicalData = await fetchFromDatabase(location, hours)

    const mockData = generateMockHistoricalData(location, hours)

    return NextResponse.json(mockData, {
      headers: {
        "Cache-Control": "public, max-age=300", // Cache for 5 minutes
      },
    })
  } catch (error) {
    console.error("[API] Error fetching historical data:", error)
    return NextResponse.json({ error: "Failed to fetch historical data" }, { status: 500 })
  }
}

// Mock data generator - Replace with database queries
function generateMockHistoricalData(location: string, hours: number) {
  const data = []
  const now = new Date()
  const interval = hours <= 24 ? 60 * 60 * 1000 : hours <= 168 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  const points = hours <= 24 ? 24 : hours <= 168 ? 168 : 30

  const baseValues: Record<string, any> = {
    "Anna Salai": { pm25: 85, pm10: 120, co2: 450, no2: 65 },
    "Mount Road": { pm25: 92, pm10: 135, co2: 480, no2: 72 },
    "T. Nagar": { pm25: 105, pm10: 145, co2: 520, no2: 78 },
    Guindy: { pm25: 78, pm10: 110, co2: 420, no2: 58 },
    Adyar: { pm25: 45, pm10: 75, co2: 380, no2: 42 },
    Velachery: { pm25: 68, pm10: 95, co2: 410, no2: 52 },
  }

  const base = baseValues[location] || baseValues["Anna Salai"]

  for (let i = points; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * interval)
    const hour = timestamp.getHours()
    const rushHourMultiplier = (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21) ? 1.4 : 1.0

    data.push({
      timestamp: timestamp.toISOString(),
      pm25: (base.pm25 + (Math.random() - 0.5) * 20) * rushHourMultiplier,
      pm10: (base.pm10 + (Math.random() - 0.5) * 30) * rushHourMultiplier,
      co2: (base.co2 + (Math.random() - 0.5) * 100) * rushHourMultiplier,
      no2: (base.no2 + (Math.random() - 0.5) * 20) * rushHourMultiplier,
    })
  }

  return data
}
