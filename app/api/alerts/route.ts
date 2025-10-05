import { type NextRequest, NextResponse } from "next/server"

/**
 * API Route: Get Active Alerts
 *
 * This endpoint returns active air quality alerts based on threshold violations.
 *
 * HARDWARE INTEGRATION GUIDE:
 * ---------------------------
 * To integrate real-time alert generation:
 *
 * 1. Set up threshold monitoring:
 *    - Monitor sensor readings in real-time
 *    - Compare against WHO/EPA air quality standards
 *    - Generate alerts when thresholds are exceeded
 *
 * 2. Alert thresholds (WHO guidelines):
 *    - PM2.5: >35 µg/m³ (24-hour average)
 *    - PM10: >50 µg/m³ (24-hour average)
 *    - NO2: >40 µg/m³ (annual average), >200 µg/m³ (1-hour average)
 *    - CO2: >1000 ppm (indoor air quality)
 *
 * 3. Implement alert persistence:
 *    ```typescript
 *    CREATE TABLE alerts (
 *      id SERIAL PRIMARY KEY,
 *      location VARCHAR(100),
 *      pollutant VARCHAR(50),
 *      level VARCHAR(50),
 *      message TEXT,
 *      created_at TIMESTAMPTZ DEFAULT NOW(),
 *      resolved_at TIMESTAMPTZ
 *    );
 *    ```
 *
 * 4. Consider implementing:
 *    - Push notifications for critical alerts
 *    - Email/SMS notifications for subscribed users
 *    - Alert escalation for prolonged threshold violations
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location")

    // TODO: Replace with actual alert monitoring system
    // Example: const alerts = await checkThresholds(location)

    const mockAlerts = generateMockAlerts(location)

    return NextResponse.json(mockAlerts, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    })
  } catch (error) {
    console.error("[API] Error fetching alerts:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

// Mock alert generator - Replace with real threshold monitoring
function generateMockAlerts(location: string | null) {
  // Simulate occasional alerts (5% chance)
  if (Math.random() > 0.95) {
    return [
      {
        id: Date.now().toString(),
        location: location || "T. Nagar",
        pollutant: "PM2.5",
        level: "Moderate",
        message: "PM2.5 levels are elevated. Sensitive groups should limit outdoor activities.",
        timestamp: new Date().toISOString(),
      },
    ]
  }

  return []
}
