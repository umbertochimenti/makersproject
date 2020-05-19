#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

const char* ssid = "Redmi";
const char* password = "aaaabc13";

using namespace websockets;
WebsocketsServer server;
WebsocketsClient client;

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

void setup() {
  Serial.begin(9600);
  wifi_connection();
  ws_server_init();
  pinMode(0, OUTPUT);
}

void loop() {
  
  client = server.accept();
  
  if (client.available()) {
    
    Serial.println("[DEBUG] client.available() ...");
    WebsocketsMessage msg = client.readBlocking();
    String clientMessage = msg.data();
    Serial.print("[INFO] Msg: ");
    Serial.println(clientMessage);
    
    if (clientMessage == "command|led_on#") {
      digitalWrite(0,1);
      client.send("led|on");
    } else if (clientMessage == "command|led_off#") {
      digitalWrite(0,0);
      client.send("led|off");
    }
    
    client.close();
    delay(500);
  }  
}
