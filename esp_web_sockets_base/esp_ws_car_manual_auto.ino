#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

#define D1 5
#define D2 4
#define D3 0
#define D4 2

const char* ssid = "your_ssid";
const char* password = "your_password";

using namespace websockets;
WebsocketsServer server;
WebsocketsClient client;

bool autoModality = false;

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
}

void ws_server_init() {
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

void come_on() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

void back() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, LOW);
  digitalWrite(D4, HIGH);
}

void left() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, HIGH);
}

void right() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

void stop_motor() {
  digitalWrite(D1, LOW);
  digitalWrite(D2, LOW);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

void setup() {
  Serial.begin(9600);
  wifi_connection();
  ws_server_init();
  init_dc_motor();
}

void auto_motor() {
    come_on();
    delay(200);
    stop_motor();
    delay(200);
    back();
    delay(200);
    stop_motor();
    delay(200);
}

void loop() {
  
  client = server.accept();
  
  if (client.available()) {
    //Serial.println("[DEBUG] client.available() ...");
    WebsocketsMessage msg = client.readBlocking();
    //Serial.print("Got Message: ");
    String clientMessage = msg.data();
    //Serial.println(clientMessage);
    //Serial.println(autoModality);

    if (clientMessage == "command|on#") {
      if(!autoModality)
        come_on();
    } else if (clientMessage == "command|back#") {
      if(!autoModality)
        back();
    } else if (clientMessage == "command|left#") {
      if(!autoModality)
        left();
    } else if (clientMessage == "command|right#") {
      if(!autoModality)
        right();
    } else if (clientMessage == "command|stop#") {
      if(!autoModality)
        stop_motor();
    } else if (clientMessage == "command|auto#") {
      autoModality = true;
    } else if (clientMessage == "command|manual#") {
      autoModality = false;
    }
    client.close();
    delay(50);
  }

  if(autoModality) {
    auto_motor();
  }
}
