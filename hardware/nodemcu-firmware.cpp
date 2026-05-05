/**
 * NodeMCU Firmware for CFTM Air Quality Sensor
 * 
 * This firmware receives sensor data from Arduino via SoftwareSerial
 * and sends it to the backend API via HTTP POST requests.
 * 
 * Hardware Setup:
 * - NodeMCU RX (GPIO3/D9) -> Arduino TX (pin 3)
 * - NodeMCU TX (GPIO1/D10) -> Arduino RX (pin 2)
 * - Common Ground between NodeMCU and Arduino
 * 
 * Wiring:
 * Arduino Pin 2 (SoftwareSerial TX) -> NodeMCU RX
 * Arduino Pin 3 (SoftwareSerial RX) -> NodeMCU TX
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

// ===== WiFi Configuration =====
const char* SSID = "YOUR_WIFI_SSID";           // Change to your WiFi SSID
const char* PASSWORD = "YOUR_WIFI_PASSWORD";   // Change to your WiFi password

// ===== Backend API Configuration =====
const char* API_HOST = "your-app.vercel.app";  // Change to your deployed app URL
const char* API_ENDPOINT = "/api/sensor/receive";

// ===== Serial Communication =====
// NodeMCU serial pins (RX on GPIO3/D9, TX on GPIO1/D10 by default)
// Data format from Arduino: "temperature,humidity,mq6,co,dust;"

float temperature = 0;
float humidity = 0;
float mq6 = 0;
float co = 0;
float dust = 0;

unsigned long lastSendTime = 0;
const unsigned long SEND_INTERVAL = 5000; // Send every 5 seconds

void setup() {
  Serial.begin(115200); // NodeMCU serial monitor
  delay(1000);
  
  Serial.println("\n\n");
  Serial.println("=== CFTM Air Quality Sensor - NodeMCU ===");
  Serial.println("Connecting to WiFi...");
  
  // Connect to WiFi
  WiFi.mode(WIFI_STA);
  WiFi.begin(SSID, PASSWORD);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.println("WiFi Connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println("Failed to connect to WiFi");
  }
}

void loop() {
  // Check if data is available from Arduino
  while (Serial.available() > 0) {
    String data = Serial.readStringUntil(';');
    
    if (data.length() > 0) {
      Serial.print("Received from Arduino: ");
      Serial.println(data);
      
      // Parse the comma-separated values
      // Format: "temperature,humidity,mq6,co,dust"
      parseArduinoData(data);
      
      // Send to backend API if WiFi is connected
      if (WiFi.status() == WL_CONNECTED) {
        sendToBackend();
      } else {
        Serial.println("WiFi not connected. Buffering data...");
      }
    }
  }
  
  // Reconnect to WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    reconnectWiFi();
  }
}

/**
 * Parse comma-separated sensor data from Arduino
 * Format: "temperature,humidity,mq6,co,dust"
 */
void parseArduinoData(String data) {
  int firstComma = data.indexOf(',');
  int secondComma = data.indexOf(',', firstComma + 1);
  int thirdComma = data.indexOf(',', secondComma + 1);
  int fourthComma = data.indexOf(',', thirdComma + 1);
  
  temperature = data.substring(0, firstComma).toFloat();
  humidity = data.substring(firstComma + 1, secondComma).toFloat();
  mq6 = data.substring(secondComma + 1, thirdComma).toFloat();
  co = data.substring(thirdComma + 1, fourthComma).toFloat();
  dust = data.substring(fourthComma + 1).toFloat();
  
  Serial.print("Parsed - Temp: ");
  Serial.print(temperature);
  Serial.print("°C, Humidity: ");
  Serial.print(humidity);
  Serial.print("%, MQ6: ");
  Serial.print(mq6);
  Serial.print(" ppm, CO: ");
  Serial.print(co);
  Serial.print(" ppm, Dust: ");
  Serial.print(dust);
  Serial.println(" µg/m³");
}

/**
 * Send sensor data to backend API
 */
void sendToBackend() {
  if (millis() - lastSendTime < SEND_INTERVAL) {
    return; // Skip if not enough time has passed
  }
  
  WiFiClient client;
  HTTPClient http;
  
  String url = "https://";
  url += API_HOST;
  url += API_ENDPOINT;
  
  Serial.print("Sending data to: ");
  Serial.println(url);
  
  http.begin(client, url);
  http.addHeader("Content-Type", "application/json");
  
  // Create JSON payload
  StaticJsonDocument<256> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["mq6"] = mq6;
  doc["co"] = co;
  doc["dust"] = dust;
  
  String jsonString;
  serializeJson(doc, jsonString);
  
  Serial.print("Payload: ");
  Serial.println(jsonString);
  
  // Send POST request
  int httpCode = http.POST(jsonString);
  
  if (httpCode == HTTP_CODE_OK) {
    String response = http.getString();
    Serial.print("Response: ");
    Serial.println(response);
    lastSendTime = millis();
  } else {
    Serial.print("HTTP Error: ");
    Serial.println(httpCode);
  }
  
  http.end();
}

/**
 * Reconnect to WiFi
 */
void reconnectWiFi() {
  static unsigned long lastReconnectAttempt = 0;
  
  if (millis() - lastReconnectAttempt > 30000) { // Try reconnect every 30 seconds
    Serial.println("Attempting to reconnect WiFi...");
    WiFi.reconnect();
    lastReconnectAttempt = millis();
  }
}

/**
 * INSTALLATION INSTRUCTIONS:
 * 
 * 1. Install ESP8266 board in Arduino IDE:
 *    - Go to File > Preferences
 *    - Add this URL to "Additional Boards Manager URLs":
 *      https://arduino.esp8266.com/stable/package_esp8266com_index.json
 *    - Go to Tools > Board > Boards Manager
 *    - Search for "ESP8266" and install the latest version
 * 
 * 2. Install required libraries:
 *    - Sketch > Include Library > Manage Libraries
 *    - Search for "ArduinoJson" and install version 6.x
 * 
 * 3. Configure settings:
 *    - Replace "YOUR_WIFI_SSID" with your WiFi name
 *    - Replace "YOUR_WIFI_PASSWORD" with your WiFi password
 *    - Replace "your-app.vercel.app" with your actual app URL
 * 
 * 4. Upload to NodeMCU:
 *    - Select Tools > Board > NodeMCU 1.0 (ESP-12E Module)
 *    - Select the correct COM port
 *    - Click Upload
 * 
 * 5. Monitor the output:
 *    - Open Tools > Serial Monitor (115200 baud)
 *    - You should see "Received from Arduino:" messages
 */
