#include <ESP8266WiFi.h>
#include <WebSocketsServer.h>

const char* ssid = "FASTWEB-92A60B";
const char* password = "CMKKR6M36T";

#define D1  5
#define D2  4
#define D5  14
#define D6  12
#define D7  13

// avvio di un web socket server su porta 1200
WebSocketsServer webSocket = WebSocketsServer(1200);

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {
    case WStype_DISCONNECTED:
      Serial.printf("[%u] Disconnected!\n", num);
    break;
    
    case WStype_CONNECTED: {
      IPAddress ip = webSocket.remoteIP(num);
      Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);
      webSocket.sendTXT(num, "Connected");
    }
    break;

    // quando l'esp riceve un messaggio dal client elabora una funzione d'esempio (in questo caso send_distance)
    // crea un pacchetto dati di risposta e la invia al client
    case WStype_TEXT:
      Serial.printf("[%u] get Text: %s\n", num, payload);
      String msg((char*)payload);
      if (msg == "car_front#") {
        digitalWrite(D1, LOW);
        digitalWrite(D5, HIGH);
        digitalWrite(D6, HIGH);
        digitalWrite(D7, LOW);
        String d_string = "Car: ";
        d_string += String();
        uint8_t dataArray[d_string.length()+1];
        d_string.getBytes(dataArray, d_string.length()+1);
        webSocket.sendTXT(num, dataArray);
      }if (msg == "car_left#"){
        digitalWrite(D1, LOW);
        digitalWrite(D5, HIGH);
        digitalWrite(D6, LOW);
        digitalWrite(D7, HIGH);
        String d_string = "Car: ";
        d_string += String();
        uint8_t dataArray[d_string.length()+1];
        d_string.getBytes(dataArray, d_string.length()+1);
        webSocket.sendTXT(num, dataArray);
      }if (msg == "car_right#"){
        digitalWrite(D1, HIGH);
        digitalWrite(D5, LOW);
        digitalWrite(D6, HIGH);
        digitalWrite(D7, LOW);
        String d_string = "Car: ";
        d_string += String();
        uint8_t dataArray[d_string.length()+1];
        d_string.getBytes(dataArray, d_string.length()+1);
        webSocket.sendTXT(num, dataArray);
      }if (msg == "car_back#"){
        digitalWrite(D1, HIGH);
        digitalWrite(D5, LOW);
        digitalWrite(D6, LOW);
        digitalWrite(D7, HIGH);
        String d_string = "Car: ";
        d_string += String();
        uint8_t dataArray[d_string.length()+1];
        d_string.getBytes(dataArray, d_string.length()+1);
        webSocket.sendTXT(num, dataArray);
      }if (msg == "car_stop#"){     
        digitalWrite(D1, LOW);
        digitalWrite(D5, LOW);
        digitalWrite(D6, LOW);
        digitalWrite(D7, LOW);
        String d_string = "Car: ";
        d_string += String();
        uint8_t dataArray[d_string.length()+1];
        d_string.getBytes(dataArray, d_string.length()+1);
        webSocket.sendTXT(num, dataArray);
      }
     break;
  }
}

void wifi_connection() {
  //connessione all'hotspot del cellulare
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

void setPinout () {
  //setting dei pin sulla base delle esigenze
  pinMode(D1, OUTPUT);
  pinMode(D5, OUTPUT);
  pinMode(D6, OUTPUT);
  pinMode(D7, OUTPUT);
  Serial.begin(9600);
}

//funzione d'esempio che elabora un valore numerico
void setup() {
  Serial.begin(9600);
  wifi_connection();
  setPinout();
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);  
}

void loop() {
  webSocket.loop();
}
