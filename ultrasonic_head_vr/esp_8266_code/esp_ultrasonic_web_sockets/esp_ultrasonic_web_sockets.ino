/*
 * Circuit:
 * 1. Ultrasonic up (HC-RS04 trigUPin = D1, echoUPin = D2)
 * 2. Ultrasonic left (HC-RS04 trigLPin = D3, echoLPin = D5)
 * 3. Ultrasonic left (HC-RS04 trigRPin = D6, echoRPin = D7)
 * Warning: in order to work connect GDN(sensor)->G(esp), Vcc(sensor)->VV(esp)
*/

#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

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

// ultrasonic section
const int trigUPin = D1; //OUT
const int echoUPin = D2; //IN
const int trigLPin = D3; //OUT
const int echoLPin = D5; //IN
const int trigRPin = D6; //OUT
const int echoRPin = D7; //IN
int distanceU, distanceL, distanceR;

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
    Serial.println("[INFO] Send msg: DISTANCE = (" + String(distanceL) + "|" + String(distanceU) + "|" + String(distanceR) + ")");
    client.send("DISTANCE = (" + String(distanceL) + "|" + String(distanceU) + "|" + String(distanceR) + ")");
  } else {
    Serial.println("Not Connected!");
  }
  
  client.onMessage([&](WebsocketsMessage message) {
    Serial.print("Got Message: ");
    Serial.println(message.data());
  });
}

void wsClientSendMsg() {
  
  if(client.available()) {
    client.send("DISTANCE = (" + String(distanceL) + "|" + String(distanceU) + "|" + String(distanceR) + ")");
  }
}

void ledNotify() {
  
  pinMode(LED_BUILTIN, OUTPUT);
  for (int i = 0; i <= 10; i++) {
    digitalWrite(LED_BUILTIN, (i%2));
    delay(100);
  }
}

void ultrasonicInit() {
  
  pinMode(trigUPin, OUTPUT);
  pinMode(echoUPin, INPUT);
  pinMode(trigLPin, OUTPUT);
  pinMode(echoLPin, INPUT);
  pinMode(trigRPin, OUTPUT);
  pinMode(echoRPin, INPUT);
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

void readUltrasonicsDistance() {
  
  distanceU = scanOn(trigUPin, echoUPin);
  distanceL = scanOn(trigLPin, echoLPin);
  distanceR = scanOn(trigRPin, echoRPin);
  
  Serial.print("[INFO] distance: ");
  Serial.print(distanceL);
  Serial.print("|");
  Serial.print(distanceU);
  Serial.print("|");
  Serial.print(distanceR);
  Serial.println("|");
}

void setup() {
  Serial.begin(9600);
  wifiConnect();
  ultrasonicInit();
  ledNotify();
}

void loop() {
  readUltrasonicsDistance();
  wsClientInit();
  delay(300);
}
