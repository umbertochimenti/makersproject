#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>

#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13

const int trigUPin = D3; //OUT
const int echoUPin = D7; //IN
int distanceU;

int carSpeed = 623;
int stepTime = 450;
int obstacleDistance = 20;

const char* ssid = "Redmi";
const char* password = "aaaabc13";

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
  pinMode(D5, OUTPUT);
  pinMode(D6, OUTPUT);
  stop_motor();
}

void ultrasonicInit() {
  
  pinMode(trigUPin, OUTPUT);
  pinMode(echoUPin, INPUT);
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
  Serial.print("distance: ");
  Serial.print(distance);
  delay(40);
  return distance;
}

void left() {
  analogWrite(D1, carSpeed);
  analogWrite(D2, 0);
  analogWrite(D5, carSpeed);
  analogWrite(D6, 0);
}

void right() {
  analogWrite(D1, 0);
  analogWrite(D2, carSpeed);
  analogWrite(D5, 0);
  analogWrite(D6, carSpeed);
}

void come_on() {
  analogWrite(D1, carSpeed);
  analogWrite(D2, 0);
  analogWrite(D5, 0);
  analogWrite(D6, carSpeed);
}

void back() {
  analogWrite(D1, 0);
  analogWrite(D2, carSpeed);
  analogWrite(D5, carSpeed);
  analogWrite(D6, 0);
}

void stop_motor() {
  analogWrite(D1, 0);
  analogWrite(D2, 0);
  analogWrite(D5, 0);
  analogWrite(D6, 0);
}

void setup() {
  Serial.begin(9600);
  wifi_connection();
  ws_server_init();
  init_dc_motor();
  ultrasonicInit();
}

void obstacle_avoid() {
  distanceU = scanOn(trigUPin, echoUPin);
  if(distanceU < obstacleDistance) {
    stop_motor();
    delay(stepTime);
    right();
    delay(stepTime);
    distanceU = scanOn(trigUPin, echoUPin);
    if(distanceU < obstacleDistance) {
      stop_motor();
      delay(stepTime);
      left();
      delay(stepTime*2);
      distanceU = scanOn(trigUPin, echoUPin);
      if(distanceU < obstacleDistance) {
        stop_motor();
        delay(stepTime);
        left();
        delay(stepTime);
      }
    }
  } else {
    come_on();
  }
}

void loop() {
    
  client = server.accept();
  
  if (client.available()) {
    //Serial.println("[DEBUG] client.available() ...");
    WebsocketsMessage msg = client.readBlocking();
    Serial.print("Got Message: ");
    String clientMessage = msg.data();
    Serial.println(clientMessage);
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
    } else if (clientMessage == "command|speedU#") {
      if(!autoModality) {
        if (carSpeed <= 1023)
           carSpeed +=50;
      }
    } else if (clientMessage == "command|speedD#") {
      if(!autoModality) {
        if (carSpeed >= 323)
           carSpeed -=50;
      }
    } else if (clientMessage == "command|auto#") {
      autoModality = true;
    } else if (clientMessage == "command|manual#") {
      autoModality = false;
    }
    client.close();
    delay(50);
  }

  if(autoModality) {
    carSpeed = 623;
    obstacle_avoid();
  }
}
