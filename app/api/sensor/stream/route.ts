import { type NextRequest } from "next/server"
import type { SensorData } from "@/lib/types"

// Store active connections for broadcasting
const activeConnections: Set<ReadableStreamDefaultController<Uint8Array>> = new Set()

/**
 * GET /api/sensor/stream
 * 
 * Server-Sent Events (SSE) endpoint for real-time sensor data streaming
 * 
 * Usage in frontend:
 * const eventSource = new EventSource('/api/sensor/stream')
 * eventSource.onmessage = (event) => {
 *   const sensorData = JSON.parse(event.data)
 *   // Update UI with sensor data
 * }
 */
export async function GET(request: NextRequest) {
  let controller: ReadableStreamDefaultController<Uint8Array> | null = null

  const stream = new ReadableStream({
    start(ctrl) {
      controller = ctrl
      activeConnections.add(ctrl)

      // Send initial connection confirmation
      const data = {
        type: "connected",
        message: "Connected to sensor data stream",
        timestamp: new Date().toISOString(),
      }
      ctrl.enqueue(
        new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`)
      )

      console.log("[SSE] Client connected. Active connections:", activeConnections.size)
    },

    cancel() {
      if (controller) {
        activeConnections.delete(controller)
        console.log(
          "[SSE] Client disconnected. Active connections:",
          activeConnections.size
        )
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for real-time delivery
    },
  })
}

/**
 * Internal function to broadcast sensor data to all connected clients
 * This is called when new data arrives from hardware
 */
export function broadcastSensorData(data: SensorData) {
  const message = `data: ${JSON.stringify({
    ...data,
    type: "sensor-update",
  })}\n\n`

  const encoded = new TextEncoder().encode(message)

  activeConnections.forEach((controller) => {
    try {
      controller.enqueue(encoded)
    } catch (error) {
      console.error("[SSE] Error broadcasting to client:", error)
      activeConnections.delete(controller)
    }
  })
}
