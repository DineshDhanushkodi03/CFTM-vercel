# Hardware Integration Setup Guide

This guide explains how to connect your Arduino-based air quality sensor system to the CFTM backend for real-time data visualization.

## System Overview

```
Arduino (with DHT11, MQ sensors)
        ↓ (Serial: pins 2-3)
   NodeMCU (WiFi)
        ↓ (HTTP POST)
Backend API (/api/sensor/receive)
        ↓ (SSE Stream)
Dashboard (Real-time display)
```

## Hardware Components

Your system consists of:

### Arduino Side
- **DHT11**: Temperature & Humidity sensor
- **MQ6 Sensor** (ga1/A0): LPG/Propane detection (ppm)
- **CO Sensor** (ga2/A1): Carbon Monoxide detection (ppm)
- **Dust/PM Sensor**: Particulate matter detection (µg/m³)
- **SoftwareSerial**: Communication with NodeMCU (pins 2-3)
- **GSM Module**: Alert functionality (optional)

### NodeMCU Side
- **WiFi**: For internet connectivity
- **Serial Communication**: Receives data from Arduino

## Step-by-Step Setup

### 1. Prepare the Arduino Code

Your Arduino code already sends data in the correct format:
```
temperature,humidity,mq6,co,dust;
```

This is sent via `SoftwareSerial nodemcu(2, 3)` at 9600 baud.

**No changes needed to your Arduino code!**

### 2. Set Up NodeMCU Firmware

#### Hardware Wiring:
Connect NodeMCU to Arduino via serial:
- Arduino Pin 2 (TX) → NodeMCU RX (GPIO3/D9)
- Arduino Pin 3 (RX) → NodeMCU TX (GPIO1/D10)
- Common Ground

#### Software Installation:

1. **Install Arduino IDE (if not already installed)**
   - Download from https://www.arduino.cc/en/software

2. **Add ESP8266 Board Support:**
   - File → Preferences
   - Paste in "Additional Boards Manager URLs":
     ```
     https://arduino.esp8266.com/stable/package_esp8266com_index.json
     ```
   - Tools → Board → Boards Manager
   - Search "ESP8266" and install latest version

3. **Install ArduinoJson Library:**
   - Sketch → Include Library → Manage Libraries
   - Search "ArduinoJson" and install version 6.x or higher

4. **Upload NodeMCU Firmware:**
   - Open `/hardware/nodemcu-firmware.cpp`
   - Update these lines with your WiFi credentials:
     ```cpp
     const char* SSID = "YOUR_WIFI_SSID";
     const char* PASSWORD = "YOUR_WIFI_PASSWORD";
     const char* API_HOST = "your-deployed-app.vercel.app";
     ```
   - Select Tools → Board → NodeMCU 1.0 (ESP-12E Module)
   - Select the correct COM port
   - Click Upload

5. **Monitor NodeMCU Output:**
   - Tools → Serial Monitor (115200 baud)
   - You should see:
     ```
     === CFTM Air Quality Sensor - NodeMCU ===
     Connecting to WiFi...
     WiFi Connected!
     IP address: 192.168.x.x
     ```

### 3. Deploy Your Backend

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Run Local Development:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   ```

3. **Deploy to Vercel:**
   - Push code to GitHub
   - Connect repo to Vercel
   - Auto-deploys on every push
   - Note your deployed URL (e.g., `your-app.vercel.app`)

4. **Update NodeMCU with Your URL:**
   - Re-upload NodeMCU firmware with the correct `API_HOST`

### 4. Test the Connection

#### 1. Check Arduino Serial Output:
Open Arduino IDE Serial Monitor (9600 baud):
```
Temp:28C
Humid:65%
MQ6:150ppm
CO:45ppm
Dust:120
```

#### 2. Check NodeMCU Serial Output:
Open Arduino IDE Serial Monitor (115200 baud):
```
Received from Arduino: 28,65,150,45,120
Parsed - Temp: 28.00°C, Humidity: 65.00%...
Sending data to: https://your-app.vercel.app/api/sensor/receive
Payload: {"temperature":28,"humidity":65,"mq6":150,"co":45,"dust":120}
Response: {"success":true,"message":"Sensor data received"...}
```

#### 3. Check Backend Logs:
Watch your backend server logs:
```
[API] Received sensor data: {
  temperature: 28,
  humidity: 65,
  mq6: 150,
  co: 45,
  dust: 120,
  timestamp: '2024-01-15T10:30:45.123Z'
}
```

#### 4. View Real-Time Dashboard:
Visit your deployed app and see data updating in real-time on the dashboard!

## API Endpoints

### Receive Sensor Data (NodeMCU → Backend)
```
POST /api/sensor/receive
Content-Type: application/json

{
  "temperature": 28.5,
  "humidity": 65,
  "mq6": 150,
  "co": 45,
  "dust": 120
}

Response:
{
  "success": true,
  "message": "Sensor data received",
  "data": {
    "temperature": 28.5,
    "humidity": 65,
    "mq6": 150,
    "co": 45,
    "dust": 120,
    "timestamp": "2024-01-15T10:30:45.123Z"
  }
}
```

### Stream Real-Time Data (Backend → Frontend)
```
GET /api/sensor/stream
Content-Type: text/event-stream

data: {"type":"sensor-update","temperature":28.5,"humidity":65,...}
data: {"type":"sensor-update",...}
```

### Get Latest Reading
```
GET /api/sensor/receive

Response:
{
  "temperature": 28.5,
  "humidity": 65,
  "mq6": 150,
  "co": 45,
  "dust": 120,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Troubleshooting

### Arduino not sending data to NodeMCU
- Check SoftwareSerial pins (2-3) are correctly wired
- Verify baud rate is 9600 on both sides
- Test with Serial.print to Arduino monitor first

### NodeMCU not connecting to WiFi
- Check SSID and password are correct
- Ensure NodeMCU is within WiFi range
- Try a 2.4GHz network (some NodeMCUs don't support 5GHz)

### Data not reaching backend
- Check `API_HOST` is correct (no https://, no trailing slash)
- Verify internet connection on NodeMCU
- Check backend is deployed and running
- Look for HTTP errors in NodeMCU Serial Monitor

### Dashboard showing no data
- Check browser console for errors (F12)
- Verify EventSource connection succeeds
- Check that sensor data is being received by backend

### Data not updating on dashboard
- Check browser Network tab for SSE connection
- Verify `broadcastSensorData()` is being called
- Check for any JavaScript errors in console

## Alert Thresholds

The system triggers alerts when:
- **MQ6 > 200 ppm**: Warning level (LPG leak)
- **CO > 100 ppm**: Critical level (Dangerous)
- **Dust > 1000 µg/m³**: Critical level (Hazardous)

These are checked in the Arduino code and frontend display.

## Production Considerations

For production deployment:

1. **Database Storage:**
   - Currently uses in-memory storage (resets on server restart)
   - Recommended: Add PostgreSQL with TimescaleDB
   - Example schema in HARDWARE_INTEGRATION.md

2. **Data Persistence:**
   - Implement database layer in `/api/sensor/receive`
   - Create data history endpoints

3. **Scaling:**
   - Use Redis for real-time broadcasts instead of in-memory
   - Implement proper SSE connection pooling

4. **Security:**
   - Add API authentication (API keys, JWT tokens)
   - Add rate limiting
   - Validate all incoming data

5. **Monitoring:**
   - Add health checks
   - Monitor connection uptime
   - Log all sensor readings

## Next Steps

1. ✓ Deploy backend to Vercel
2. ✓ Upload NodeMCU firmware
3. ✓ View real-time data on dashboard
4. [ ] Add historical data storage
5. [ ] Implement alert notifications (email/SMS)
6. [ ] Add multiple sensor locations
7. [ ] Create data analytics dashboard

## Support & Resources

- NodeMCU Documentation: https://nodemcu.readthedocs.io/
- Arduino to WiFi: https://create.arduino.cc/
- Server-Sent Events: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
- Vercel Deployment: https://vercel.com/docs

## File Locations

- NodeMCU Firmware: `/hardware/nodemcu-firmware.cpp`
- Backend API (Receive): `/app/api/sensor/receive/route.ts`
- Backend API (Stream): `/app/api/sensor/stream/route.ts`
- Frontend Component: `/components/dashboard/realtime-sensor-display.tsx`
- Type Definitions: `/lib/types.ts`
