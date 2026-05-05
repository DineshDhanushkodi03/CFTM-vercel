import { type NextRequest, NextResponse } from "next/server"
import type { SensorData } from "@/lib/types"
import { broadcastSensorData } from "../stream/route"

// In-memory storage for the latest sensor reading
// NOTE: In production, use a database (PostgreSQL, Supabase, etc.) and Redis for real-time updates
let latestSensorData: SensorData | null = null

/**
 * POST /api/sensor/receive
 * 
 * Endpoint for NodeMCU to send sensor data
 * 
 * Expected body format:
 * {
 *   "temperature": 28.5,
 *   "humidity": 65,
 *   "mq6": 150,
 *   "co": 45,
 *   "dust": 120
 * }
 * 
 * This corresponds to Arduino data format:
 * "temperature,humidity,mq6,co,dust;"
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Parse and validate the sensor data from NodeMCU
    const sensorData: SensorData = {
      temperature: parseFloat(body.temperature) || 0,
      humidity: parseFloat(body.humidity) || 0,
      mq6: parseFloat(body.mq6) || 0,
      co: parseFloat(body.co) || 0,
      dust: parseFloat(body.dust) || 0,
      timestamp: new Date().toISOString(),
    }

    console.log("[API] Received sensor data:", sensorData)

    // Store the latest reading
    latestSensorData = sensorData

    // Broadcast to all connected SSE clients
    broadcastSensorData(sensorData)

    return NextResponse.json(
      { success: true, message: "Sensor data received", data: sensorData },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API] Error receiving sensor data:", error)
    return NextResponse.json(
      { error: "Failed to receive sensor data", details: String(error) },
      { status: 400 }
    )
  }
}

/**
 * GET /api/sensor/receive
 * 
 * Returns the latest sensor reading received from hardware
 */
export async function GET() {
  if (!latestSensorData) {
    return NextResponse.json(
      { error: "No sensor data received yet" },
      { status: 404 }
    )
  }

  return NextResponse.json(latestSensorData, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  })
}

export function getLatestSensorData() {
  return latestSensorData
}
