# Quick Start: Hardware Integration

Get your air quality sensors connected in 5 minutes!

## What You'll Need

- Arduino (with your sensor code)
- NodeMCU or ESP8266
- USB cables for both
- WiFi network
- Your deployed backend URL

## The 5-Minute Setup

### 1. Get Your Backend URL (1 min)
Deploy to Vercel:
```bash
git push origin main
```
Your URL will be: `your-app.vercel.app`

### 2. Update NodeMCU Firmware (1 min)
Edit `/hardware/nodemcu-firmware.cpp`:
```cpp
const char* SSID = "YOUR_WIFI_SSID";
const char* PASSWORD = "YOUR_WIFI_PASSWORD";
const char* API_HOST = "your-app.vercel.app";  // Your deployed URL
```

### 3. Upload to NodeMCU (2 min)
```
Arduino IDE:
1. Tools → Board → NodeMCU 1.0 (ESP-12E Module)
2. Select COM Port
3. Click Upload
```

### 4. Test Connection (1 min)
Open Serial Monitor on NodeMCU (115200 baud):
```
You should see:
✓ WiFi Connected!
✓ Received from Arduino: 28,65,150,45,120
✓ Response: {"success":true}
```

## View Your Data

Visit: `https://your-app.vercel.app`

You should see your sensor readings updating in real-time!

## Wiring Reference

```
Arduino → NodeMCU
Pin 2 (TX) → RX (GPIO3)
Pin 3 (RX) → TX (GPIO1)
GND → GND
```

## Data Format

Your Arduino sends: `temperature,humidity,mq6,co,dust;`

Backend receives:
```json
{
  "temperature": 28.5,
  "humidity": 65,
  "mq6": 150,
  "co": 45,
  "dust": 120
}
```

## What's Happening Behind the Scenes

1. Arduino reads sensors → sends via SoftwareSerial
2. NodeMCU receives data → sends HTTP POST to backend
3. Backend receives → broadcasts via SSE to all connected browsers
4. Dashboard receives → updates in real-time

## Still Not Working?

Check the full guide: `/HARDWARE_SETUP.md`

## Success Indicators

- ✓ NodeMCU connects to WiFi
- ✓ NodeMCU receives data from Arduino
- ✓ Backend receives HTTP POST from NodeMCU
- ✓ Dashboard shows live sensor readings
- ✓ Data updates every 5 seconds

Done! Your hardware is now integrated! 🎉
