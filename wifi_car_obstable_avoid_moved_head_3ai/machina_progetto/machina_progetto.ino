#include <ArduinoWebsockets.h>
#include <ESP8266WiFi.h>
#include <Servo.h>

#define D5 14
#define D8 15
#define D1 5
#define D2 4
#define D3 0
#define D7 13 //echo
#define D6 12 //trig

const int trigPin = 12;
const int echoPin = 13;
const int STEP = 600;
int carSpeed = 723;
int stepTime = 450;

int readUltrasonic(){
  delay(100);

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
 
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  long duration = pulseIn(echoPin, HIGH);
  
  int distance= duration*0.034/2;
  Serial.print("Distance: ");
  Serial.println(distance);
  return distance;
}

const char* ssid = "Linux";
const char* password = "facciaml";

using namespace websockets;
WebsocketsServer server;
WebsocketsClient client;
Servo Servo1;

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
  analogWrite(D1, carSpeed);
  analogWrite(D2, 0);
  analogWrite(D3, carSpeed);
  analogWrite(D4, 0);
}

void back() {
  analogWrite(D1, 0);
  analogWrite(D2, carSpeed);
  analogWrite(D3, 0);
  analogWrite(D4, carSpeed);
}

void left() {
  analogWrite(D1, 0);
  analogWrite(D2, carSpeed);
  analogWrite(D3, carSpeed);
  analogWrite(D4, 0);
}

void right() {
  
  analogWrite(D1, carSpeed);
  analogWrite(D2, 0);
  analogWrite(D3, 0);
  analogWrite(D4, carSpeed);
}

void stop_motor() {
  analogWrite(D1, 0);
  analogWrite(D2, 0);
  analogWrite(D3, 0);
  analogWrite(D4, 0);
}

void setup() {
  Serial.begin(9600);
  wifi_connection();
  ws_server_init();
  init_dc_motor();
  Servo1.attach(15);
  Servo1.write(90);//testa avanti
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  pinMode(D5, OUTPUT);
}

void auto_motor() {
  int distance = readUltrasonic();
  come_on();
  if (distance <= 25) {
    Serial.println("ok");
    stop_motor();
    delay(STEP);
    Servo1.write(0);//testa destra
    delay(800);
    distance = readUltrasonic();
     
     if(distance <= 25){
      
        Servo1.write(270);//testa sinistra
        delay(800);
        distance = readUltrasonic();
        
        
     if(distance <= 25 ){
            
            Servo1.write(90);//testa avanti
            delay(800);
            right();
            delay(2*STEP);
            
      }else{
             
             Servo1.write(90);//testa avanti 
             delay(800);
             left();
             delay(STEP);
              
            }            
      }else{
             Servo1.write(90); //testa avanti
             delay(800);
             right();
             delay(STEP);
      }
     }else {
        come_on();
  }
}

void loop() {
  
  client = server.accept();
  
  if (client.available()) {
  
    WebsocketsMessage msg = client.readBlocking();
   
    String clientMessage = msg.data();


    if (clientMessage == "command|on#") {
      if(!autoModality)
        come_on();
        Serial.println("on");
    } else if (clientMessage == "command|back#") {
      if(!autoModality)
        back();
        Serial.println("back");
    } else if (clientMessage == "command|left#") {
      if(!autoModality)
        left();
        Serial.println("left");
    } else if (clientMessage == "command|right#") {
      if(!autoModality)
        right();
        Serial.println("right");
    } else if (clientMessage == "command|stop#") {
      if(!autoModality)
        stop_motor();
        Serial.println("stop-");
    } else if (clientMessage == "command|auto#") {
      autoModality = true;
      Serial.println("auto");
    } else if (clientMessage == "command|manual#") {
      autoModality = false;
      Serial.println("manual");
    } else if (clientMessage == "command|speedU#") {
      if(!autoModality) {
        if (carSpeed <= 1023)
           carSpeed +=50;
      }
      Serial.println("uP");
    } else if (clientMessage == "command|speedD#") {
      if(!autoModality) {
        if (carSpeed >= 323)
           carSpeed -=50;
      }
      Serial.println("dW");
    }
    client.close();
    delay(50);
  }

  if(autoModality) {
    carSpeed = 900;
    auto_motor();
  }
}
