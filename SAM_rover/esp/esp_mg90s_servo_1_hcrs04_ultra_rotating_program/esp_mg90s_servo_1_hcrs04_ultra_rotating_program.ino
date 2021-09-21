/*
 * Circuit:
 * 1. HC-RS04: trig1Pin (D1), echo1Pin (D2)
 * 2. mg90s servo_pin (D6)
 * Warning: in order to work connect GND(sensor)->G(esp), Vcc(sensor)->VV(esp)
*/

#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <Servo.h>

// esp_pin section
#define D1 5 //IN-OUT
#define D2 4 //IN-OUT
#define D3 0 //OUT
#define D5 14 //IN-OUT
#define D6 12 //IN-OUT
#define D7 13 //IN-OUT

// wifi section
const char* ssid = "Redmi";
const char* password = "aaaabc13";

// websockets section
using namespace websockets;
WebsocketsServer server;
WebsocketsClient client;
Servo rotating_servo;

// ultrasonic section
const int trig1Pin = D1; //OUT
const int echo1Pin = D2; //IN
int distance;
int distances[13] = {0};
const int servo_pin = D6;

void wifiConnect () {
  
  WiFi.begin(ssid, password);
  for(int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void wsClientInit() {
  
  String websockets_server_host = "192.168.43.19";
  int websockets_server_port = 9000;
  
  bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
  
  if(connected) {
    Serial.println("[INFO] Send msg: DISTANCE = (" + String(distance) + ")");
    //client.send("DISTANCE = (" + String(distanceU) + "|" + String(distanceD) + ")");
    String json_distances = "{";
    for (int i = 0; i <= 12; i++) {
      json_distances += "\"" + String(i) + "\":\"" + String(distances[i]) + "\"";
      if(i < 12)
        json_distances += ",";
    }
    json_distances += "}";
    client.send(json_distances);
  } else {
    Serial.println("Not Connected!");
  }
  
  client.onMessage([&](WebsocketsMessage message) {
    Serial.print("Got Message: ");
    Serial.println(message.data());
  });
}

void ledNotify() {
  
  pinMode(LED_BUILTIN, OUTPUT);
  for (int i = 0; i <= 10; i++) {
    digitalWrite(LED_BUILTIN, (i%2));
    delay(100);
  }
}

void ultrasonicInit() {
  pinMode(trig1Pin, OUTPUT);
  pinMode(echo1Pin, INPUT);
}

int scanOn(int trig, int echo) {
  
  long duration = -1.0;
  int distance = -1;
  Serial.println("[INFO] scanning ...");
  // Clears the trigPin
  digitalWrite(trig, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  duration = pulseIn(echo, HIGH);
  // Calculating the distance
  distance = (duration * 0.034)/2;
  delay(50);
  return distance;
}

void setup() {
  Serial.begin(9600);
  wifiConnect();
  ultrasonicInit();
  //ledNotify();
  rotating_servo.attach(servo_pin);
  rotating_servo.write(0);
  delay(300); 
}

void loop() {
  
  int servo_angle = 0; //{0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180}
  for (int i = 0; i <= 12; i++) {
    rotating_servo.write(servo_angle);
    delay(200);
    distance = scanOn(trig1Pin, echo1Pin);
    delay(50);
    distances[i] = distance;
    servo_angle += 15;
  }
  Serial.println("***********");
  String json_distances = "{";
  for (int i = 0; i <= 12; i++) {
    json_distances += "\"" + String(i) + "\":\"" + String(distances[i]) + "\"";
    if(i < 12)
      json_distances += ",";
  }
  json_distances += "}";
  
  Serial.println(json_distances);
  delay(200);
  rotating_servo.write(0);
  wsClientInit();
  delay(1000); 
}
