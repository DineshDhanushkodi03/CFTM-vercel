# Hardware Integration Guide for CFTM

This guide explains how to integrate real hardware sensors with the CFTM (Chennai Traffic Monitor) application.

## Current Architecture

The application currently uses **mock data** for demonstration purposes. All sensor readings are simulated in the frontend and backend API routes.

## Backend API Structure

The application has a proper backend API built with Next.js API routes:

- **`/api/sensor/current`** - Returns current real-time sensor readings
- **`/api/sensor/history`** - Returns historical sensor data for trend analysis
- **`/api/alerts`** - Returns active air quality alerts

## Hardware Integration Steps

### 1. Choose Your Hardware Platform

**Recommended Sensors:**
- **PM2.5/PM10**: PMS5003, SDS011, or Honeywell HPMA115S0
- **CO2**: MH-Z19B or SCD30
- **NO2**: MiCS-2714 or MQ-135 (requires calibration)
- **Temperature/Humidity**: DHT22 or BME280

**Microcontroller Options:**
- **ESP32/ESP8266**: WiFi-enabled, perfect for IoT
- **Arduino + WiFi Shield**: Classic option
- **Raspberry Pi**: For more complex processing

### 2. Set Up Data Collection

**Option A: Direct HTTP Requests (Recommended for ESP32)**

\`\`\`cpp
// ESP32 Example
#include <WiFi.h>
#include <HTTPClient.h>

void sendSensorData() {
  HTTPClient http;
  http.begin("https://your-app-url.vercel.app/api/sensor/current");
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"pm25\":" + String(pm25Value) + 
                   ",\"pm10\":" + String(pm10Value) +
                   ",\"co2\":" + String(co2Value) +
                   ",\"no2\":" + String(no2Value) +
                   ",\"location\":\"Anna Salai\"}";
  
  int httpCode = http.POST(payload);
  http.end();
}
\`\`\`

**Option B: MQTT (For Multiple Sensors)**

\`\`\`javascript
// Backend MQTT subscriber
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

client.on('message', (topic, message) => {
  const sensorData = JSON.parse(message.toString())
  // Store in database
  await saveSensorReading(sensorData)
})
\`\`\`

### 3. Database Setup

**Recommended: PostgreSQL with TimescaleDB**

\`\`\`sql
-- Create hypertable for time-series data
CREATE TABLE sensor_readings (
  id SERIAL,
  location VARCHAR(100) NOT NULL,
  pm25 DECIMAL(10,2),
  pm10 DECIMAL(10,2),
  co2 DECIMAL(10,2),
  no2 DECIMAL(10,2),
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convert to hypertable for efficient time-series queries
SELECT create_hypertable('sensor_readings', 'timestamp');

-- Create indexes
CREATE INDEX idx_location_time ON sensor_readings (location, timestamp DESC);
\`\`\`

### 4. Update API Routes

Replace the mock data in `/app/api/sensor/current/route.ts`:

\`\`\`typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get("location") || "Anna Salai"

  // Fetch latest reading from database
  const result = await pool.query(
    'SELECT * FROM sensor_readings WHERE location = $1 ORDER BY timestamp DESC LIMIT 1',
    [location]
  )

  return NextResponse.json(result.rows[0])
}
\`\`\`

### 5. Real-Time Updates

**Option A: Server-Sent Events (SSE)**

\`\`\`typescript
// app/api/sensor/stream/route.ts
export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const interval = setInterval(async () => {
        const data = await fetchLatestSensorData()
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`)
      }, 5000)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    }
  })
}
\`\`\`

**Option B: WebSockets**

\`\`\`typescript
// Use Socket.io or native WebSockets
io.on('connection', (socket) => {
  const interval = setInterval(async () => {
    const data = await fetchLatestSensorData()
    socket.emit('sensor-update', data)
  }, 5000)
})
\`\`\`

### 6. Alert System

Implement threshold monitoring:

\`\`\`typescript
async function checkThresholds(reading: SensorReading) {
  const alerts = []

  // WHO guidelines
  if (reading.pm25 > 35) {
    alerts.push({
      pollutant: 'PM2.5',
      level: reading.pm25 > 75 ? 'Severe' : 'Moderate',
      message: 'PM2.5 levels exceed WHO guidelines'
    })
  }

  if (reading.no2 > 40) {
    alerts.push({
      pollutant: 'NO2',
      level: 'Moderate',
      message: 'NO2 levels elevated'
    })
  }

  // Save alerts to database
  if (alerts.length > 0) {
    await saveAlerts(alerts)
  }
}
\`\`\`

### 7. Calibration

**Important**: Calibrate your sensors regularly!

\`\`\`cpp
// Example calibration for MQ sensors
float calibrateSensor() {
  float sum = 0;
  for(int i = 0; i < 100; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(10);
  }
  return sum / 100.0;
}
\`\`\`

### 8. Testing

1. **Test with mock data first** - Ensure the API works correctly
2. **Test single sensor** - Verify one sensor sends data correctly
3. **Test multiple locations** - Deploy sensors to different locations
4. **Load testing** - Ensure system handles multiple sensors

### 9. Deployment Checklist

- [ ] Sensors calibrated and tested
- [ ] Database schema created
- [ ] API routes updated with real data sources
- [ ] Environment variables configured
- [ ] Alert thresholds configured
- [ ] Monitoring and logging set up
- [ ] Backup system in place

## Environment Variables

Add these to your `.env.local`:

\`\`\`bash
DATABASE_URL=postgresql://user:password@host:5432/cftm
MQTT_BROKER_URL=mqtt://broker.hivemq.com
ALERT_EMAIL=alerts@example.com
\`\`\`

## Support

For questions about hardware integration, refer to:
- Sensor datasheets for wiring and specifications
- Next.js API routes documentation
- Your database provider's documentation

## Example Complete Setup

See `/examples/esp32-sensor-node` for a complete ESP32 sensor node implementation.
