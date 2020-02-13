#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

#define D1 5
#define D2 4
#define D3 0
#define D4 2

const char* ssid = "hotspot_name";
const char* password = "hotspot_password";

using namespace websockets;
WebsocketsServer server;

void setup() {
  wifiInit();
  wsServerInit();
  carInit();
  carStop();
}

void wifiInit() {
  Serial.begin(9600);
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

void wsServerInit() {
  server.listen(8000);
  Serial.print("Is server live? ");
  Serial.println(server.available());
}

void carInit() {
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
}

void carOn() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

void carDown() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, LOW);
  digitalWrite(D4, HIGH);
}

void carRight() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

void carLeft() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, HIGH);
}

void carStop() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

void loop() {
  
  WebsocketsClient client = server.accept();
  
  if (client.available()) {
    
    WebsocketsMessage msg = client.readBlocking();
    String robotMsg = msg.data();
    Serial.print("[INFO] Robot-car msg: ");
    Serial.println(robotMsg);

    if (robotMsg == "command|on#") {
      carOn();
    } else if (robotMsg == "command|back#") {
      carDown();
    } else if (robotMsg == "command|left#") {
      carLeft();
    } else if (robotMsg == "command|right#") {
      carRight();
    } else if (robotMsg == "command|stop#") {
      carStop();
    }
    client.close();
  }
  delay(50);
}
