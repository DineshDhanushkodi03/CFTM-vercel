# Detailed Hardware to Software Connection Guide

## System Overview

```
Arduino (with sensors) 
    ↓ (Serial UART)
NodeMCU (WiFi Module)
    ↓ (HTTP/WiFi)
Backend API (Your Vercel App)
    ↓ (Server-Sent Events)
Web Dashboard (Real-time Display)
```

---

## STEP 1: Deploy Your Backend to Vercel

### What You Need
- Your GitHub account (already connected)
- Internet connection

### Detailed Instructions

#### 1.1 Commit Changes to GitHub
Open Terminal/Command Prompt and run:

```bash
cd /vercel/share/v0-project
git add .
git commit -m "Add hardware integration backend"
git push origin hardware-to-software-backend
```

**What this does:** Saves all the new API files and components to your GitHub branch.

#### 1.2 Create a Pull Request
1. Go to GitHub: https://github.com/DineshDhanushkodi03/CFTM-vercel
2. Click **"Pull requests"** tab
3. Click **"New pull request"**
4. Select:
   - Base: `main`
   - Compare: `hardware-to-software-backend`
5. Click **"Create pull request"**
6. Click **"Merge pull request"**
7. Click **"Confirm merge"**

**What this does:** Merges your hardware backend code into the main branch.

#### 1.3 Get Your Deployed URL
1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Click on your project `CFTM-vercel`
3. Look at the top - you'll see a URL like:
   - `cftm-vercel.vercel.app` (or similar)

**Copy this URL - you'll need it in Step 2**

---

## STEP 2: Update NodeMCU Firmware with Your Details

### What You Need
- Text editor (Notepad, VS Code, etc.)
- The Vercel URL from Step 1

### Detailed Instructions

#### 2.1 Download the Firmware File
1. Go to: `/vercel/share/v0-project/hardware/nodemcu-firmware.cpp`
2. Copy all the code

#### 2.2 Edit in Arduino IDE

1. **Open Arduino IDE**
   - Download from: https://www.arduino.cc/en/software
   - Install it

2. **Create New Sketch**
   - File → New

3. **Paste the firmware code**
   - Paste the code from Step 2.1

4. **Find These Lines and Update Them**

   **Line ~20:** Find this:
   ```cpp
   const char* SSID = "YOUR_WIFI_SSID";
   ```
   Replace with your actual WiFi name:
   ```cpp
   const char* SSID = "MyHome";  // Change to your WiFi name
   ```

   **Line ~21:** Find this:
   ```cpp
   const char* PASSWORD = "YOUR_WIFI_PASSWORD";
   ```
   Replace with your WiFi password:
   ```cpp
   const char* PASSWORD = "MyPassword123";  // Change to your WiFi password
   ```

   **Line ~22:** Find this:
   ```cpp
   const char* API_HOST = "your-app.vercel.app";
   ```
   Replace with your Vercel URL from Step 1:
   ```cpp
   const char* API_HOST = "cftm-vercel.vercel.app";  // Your actual URL
   ```

5. **Save the file**
   - File → Save As
   - Name it: `NodeMCU_Sensor_Gateway`

#### 2.3 Example of Completed Lines
```cpp
const char* SSID = "MyHomeWiFi";
const char* PASSWORD = "Password@123";
const char* API_HOST = "cftm-vercel.vercel.app";
const uint16_t API_PORT = 443;  // HTTPS
```

**What this does:** Tells your NodeMCU which WiFi to connect to and where to send data.

---

## STEP 3: Connect Wires Between Arduino and NodeMCU

### What You Need
- Jumper wires (3 wires minimum)
- Your Arduino board
- NodeMCU board

### Detailed Instructions

#### 3.1 Arduino Pin Configuration

Your Arduino code uses **SoftwareSerial** on:
- Pin 2 (TX - transmit)
- Pin 3 (RX - receive)

#### 3.2 Wiring Diagram

```
ARDUINO → NODEMCU

Arduino Pin 2 (TX)  →  NodeMCU RX Pin (GPIO3)
Arduino Pin 3 (RX)  →  NodeMCU TX Pin (GPIO1)
Arduino GND         →  NodeMCU GND
```

#### 3.3 Step-by-Step Wiring

1. **Take a black jumper wire**
   - Connect Arduino **GND** pin
   - To NodeMCU **GND** pin
   - (Ground/common reference)

2. **Take a yellow/orange jumper wire**
   - Connect Arduino **Pin 2** (TX)
   - To NodeMCU **RX** (labeled as GPIO3)
   - (Data from Arduino to NodeMCU)

3. **Take a blue/green jumper wire**
   - Connect Arduino **Pin 3** (RX)
   - To NodeMCU **TX** (labeled as GPIO1)
   - (Data from NodeMCU to Arduino)

#### 3.4 Power Connections

**Arduino:**
- Power it via USB cable (normal setup)

**NodeMCU:**
- Power it via USB cable OR
- Use Arduino 5V → NodeMCU VIN (with resistor voltage divider if needed)

**Important:** Make sure both boards share the same GND (ground). This is critical!

#### 3.5 Visual Example

```
┌─────────────┐              ┌─────────────┐
│   Arduino   │              │  NodeMCU    │
│             │              │             │
│ Pin2 ┌──────┼──────────────┼─RX (GPIO3)
│      │      │              │             │
│ Pin3 │      └──────────────┼──TX (GPIO1)
│      │                     │             │
│ GND ─┼─────────────────────┼─ GND
└─────────────┘              └─────────────┘
  (TX to RX)      (RX to TX)
```

---

## STEP 4: Upload Firmware to NodeMCU

### What You Need
- Arduino IDE with the firmware code from Step 2
- USB cable to connect NodeMCU to computer
- Arduino IDE with ESP8266 board support

### Detailed Instructions

#### 4.1 Install ESP8266 Board Support

1. **Open Arduino IDE**

2. **Go to Preferences**
   - File → Preferences

3. **Add Board Manager URL**
   - Find field: "Additional Board Manager URLs"
   - Add this URL:
   ```
   http://arduino.esp8266.com/stable/package_esp8266com_index.json
   ```
   - Click OK

4. **Install ESP8266 Package**
   - Go to Tools → Board → Board Manager
   - Search: "ESP8266"
   - Click Install (by ESP8266 Community)
   - Wait for installation to complete

#### 4.2 Select NodeMCU Board

1. **In Arduino IDE**
   - Click Tools → Board
   - Search and select: **NodeMCU 1.0 (ESP-12E Module)**

2. **Select Port**
   - Plug NodeMCU into computer with USB cable
   - Tools → Port
   - Select your COM port (e.g., COM3, /dev/ttyUSB0, etc.)
   - If you don't see it, install CH340 driver for your OS

3. **Set Upload Speed**
   - Tools → Upload Speed
   - Select: **115200**

#### 4.3 Upload the Firmware

1. **In Arduino IDE**
   - Make sure your firmware code is open and edited (Step 2)

2. **Click Upload Button**
   - Look for the arrow icon (→) in top left
   - Click it
   - Wait 10-30 seconds

3. **You'll see messages like:**
   ```
   Compiling sketch...
   Uploading...
   ..............................
   Leaving... Hard resetting via RTS pin...
   ```

4. **Success!**
   - You'll see: "Done uploading" or similar
   - NodeMCU will restart

#### 4.4 Verify Upload Worked

1. **Open Serial Monitor**
   - Tools → Serial Monitor
   - Set Baud Rate to: **115200** (bottom right)

2. **You should see messages like:**
   ```
   Starting WiFi connection...
   WiFi Connected!
   IP: 192.168.1.100
   Listening for Arduino data on SoftwareSerial...
   ```

3. **If you see errors:**
   - Check WiFi SSID and password are correct
   - Check your API_HOST URL is correct
   - Check internet connection on your WiFi

**What this does:** Programs the NodeMCU to connect to WiFi and listen for data from Arduino.

---

## STEP 5: Test & View Real-Time Data

### What You Need
- Arduino running and sending sensor data
- NodeMCU powered and connected to wires
- Computer with internet

### Detailed Instructions

#### 5.1 Check Serial Output

1. **Keep Serial Monitor open** (from Step 4.4)

2. **You should see something like:**
   ```
   Starting WiFi connection...
   Connected to: MyHomeWiFi
   IP: 192.168.1.105
   Listening for Arduino data...
   
   Received from Arduino: 28.5,65,150,45,980
   Sending to API...
   Response: {"success":true}
   
   Received from Arduino: 28.6,64,148,46,985
   Sending to API...
   Response: {"success":true}
   ```

   This means:
   - ✅ NodeMCU connected to WiFi
   - ✅ Receiving data from Arduino
   - ✅ Sending data to backend

#### 5.2 View Data on Dashboard

1. **Open your deployed app**
   - Go to: `https://your-app-url.vercel.app`
   - (Use the URL from Step 1.3)

2. **Look for the Real-Time Sensor Display**
   - You should see cards showing:
     - Temperature
     - Humidity
     - MQ6 (Gas sensor)
     - CO (Carbon Monoxide)
     - Dust

3. **Watch for Live Updates**
   - Data should update every 5 seconds
   - Values should match what's in Serial Monitor
   - No page refresh needed

#### 5.3 Troubleshooting

**If no data appears on dashboard:**

1. Check Serial Monitor shows "Response: {success:true}"
   - If not, API_HOST URL might be wrong

2. Check API endpoint is working:
   - Open in browser: `https://your-url.vercel.app/api/sensor/current`
   - Should show JSON like:
   ```json
   {
     "temperature": 28.5,
     "humidity": 65,
     "mq6": 150,
     "co": 45,
     "dust": 980,
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

3. Check browser console for errors:
   - Press F12 in browser
   - Click Console tab
   - Look for red error messages

4. Check WiFi connection:
   - Restart NodeMCU (unplug and replug USB)
   - Make sure WiFi SSID/password are correct

**If data appears but is wrong:**

1. Check Arduino is sending correct data (monitor Arduino serial)
2. Check sensor wiring on Arduino
3. Check serial baud rate (must be 9600 in both Arduino code and NodeMCU firmware)

---

## Summary Table

| Step | Component | Action | Time |
|------|-----------|--------|------|
| 1 | Backend | Push to GitHub & deploy to Vercel | 5 min |
| 2 | Firmware | Edit WiFi/URL details in Arduino IDE | 5 min |
| 3 | Wiring | Connect 3 jumper wires between Arduino & NodeMCU | 5 min |
| 4 | Upload | Upload firmware to NodeMCU via Arduino IDE | 10 min |
| 5 | Test | Check Serial Monitor & view dashboard | 5 min |

**Total Time: ~30 minutes**

---

## Common Issues & Solutions

### Issue: "WiFi Connection Failed"
- **Solution:** Check SSID and PASSWORD in firmware match your WiFi
- **Solution:** Make sure WiFi is 2.4GHz (NodeMCU doesn't support 5GHz)

### Issue: "Upload failed - device not found"
- **Solution:** Check COM port is selected correctly in Tools → Port
- **Solution:** Install CH340 USB driver for NodeMCU
- **Solution:** Try different USB cable

### Issue: "Data not appearing on dashboard"
- **Solution:** Check Vercel URL is correct in firmware
- **Solution:** Check Serial Monitor shows successful API responses
- **Solution:** Restart NodeMCU with power cycle

### Issue: "Garbled text in Serial Monitor"
- **Solution:** Change baud rate to 115200 in bottom right of Serial Monitor
- **Solution:** Make sure Upload Speed in Tools is also set to 115200

---

## Next Steps (Optional)

After everything works:

1. **Deploy to Production**
   - Keep the app running on Vercel
   - NodeMCU will connect automatically after power cycles

2. **Add Database Storage**
   - Modify `/api/sensor/receive` to save to Supabase/Neon
   - Keep historical data instead of just current values

3. **Add Alerts**
   - Send email/SMS when sensor exceeds threshold
   - Add push notifications to dashboard

4. **Mobile App**
   - Use React Native to access same API endpoints
   - Monitor from phone in real-time

---

## Questions?

If something doesn't work:
1. Check Serial Monitor output first
2. Verify WiFi SSID/password and Vercel URL
3. Try power cycling NodeMCU (unplug USB, wait 5 sec, plug back in)
4. Check browser console for JavaScript errors (F12)
