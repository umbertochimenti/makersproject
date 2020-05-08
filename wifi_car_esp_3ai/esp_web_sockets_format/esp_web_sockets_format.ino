/*E' NECESSARIO SCARICARE E INCLUDERE LA LIBRERIA 
  ArduinoWebsockets E LA LIBRERIA ESP8266Wifi PER
  POTER GESTIRE I 2 MICROCONTROLLORI*/
#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

/*DICHIARAZIONE PIN ESP8266*/
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15



/*INSERIMENTO DATI DISPOSITIVO CHE FUNGE DA HOTSPOT 
  E DA PILOTA*/
const char* ssid = "HUAWEI Mate 20 lite";
const char* password = "Antonio03";

using namespace websockets;
WebsocketsServer server;

void wifi_connection() {
  /*INIZIO CONNESSIONE MONITOR SERIALE*/
  WiFi.begin(ssid, password);
  for (int i = 0; i < 15 && WiFi.status() != WL_CONNECTED; i++) {
      Serial.print(".");
      delay(1000);
  }
  /*STAMPA SU MONITOR SERIALE LO STATO DI CONNESSIONE*/
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.listen(8000);
  Serial.print("[INFO] server available: ");
  Serial.println(server.available());
}

/*DICHIARAZIONE PIN MOTORI*/
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

/*AVANTI*/
void come_on() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, LOW);
  digitalWrite(D3, HIGH);
  digitalWrite(D4, LOW);
}

/*INDIETRO*/
void back() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

/*SINISTRA*/
void left() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

/*DESTRA*/
void right() {
  digitalWrite(D1, HIGH);
  digitalWrite(D2, HIGH);
  digitalWrite(D3, LOW);
  digitalWrite(D4, LOW);
}

/*ARRESTO DI TUTTI I MOTORI*/
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
  come_on();
  delay(1000);
  stop_motor();
  delay(1000);
}
