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

void wifi_connection() {
  
  WiFi.begin(ssid, password);
  for (int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.listen(8000);
  Serial.print("[INFO] server available: ");
  Serial.println(server.available());
}

void init_dc_motor() {
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);
  pinMode(D3, OUTPUT);
  pinMode(D4, OUTPUT);
  stop_motor();
}

void setup() {
  Serial.begin(9600);
  wifi_connection();
  init_dc_motor();
}

void come_on() {
  digitalWrite(D1, HIGH);
  digitalWrite(D4, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
}

void back() {
  digitalWrite(D2, HIGH);
  digitalWrite(D3, HIGH);
  digitalWrite(D1, LOW);
  digitalWrite(D4, LOW);
}

void left() {
  digitalWrite(D2, HIGH);
  digitalWrite(D4, HIGH);
  digitalWrite(D1, LOW);
  digitalWrite(D3, LOW);
}

void right() {
  digitalWrite(D1, HIGH);
  digitalWrite(D3, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D4, LOW);
}

void stop_motor() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

void loop() {
  WebsocketsClient client = server.accept();
  if (client.available()) {
    
    WebsocketsMessage msg = client.readBlocking();
    Serial.print("Got Message: ");
    Serial.println(msg.data());

    if (msg.data() == "command|on#") {
      come_on();
    } else if (msg.data() == "command|back#") {
      back();
    } else if (msg.data() == "command|left#") {
      left();
    } else if (msg.data() == "command|right#") {
      right();
    } else if (msg.data() == "command|stop#") {
      stop_motor();
    }
    
    client.send("Echo: " + msg.data());
    client.close();
  }
  delay(100);
}
