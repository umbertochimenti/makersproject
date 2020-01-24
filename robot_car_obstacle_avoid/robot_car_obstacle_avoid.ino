#include <Servo.h> 

const int trigPin = 6;
const int echoPin = 5;
const int STEP = 500;

int servoPin = 3; 
Servo Servo1;

int readUltrasonic() {
  
  delay(100);
  // Clears the trigPin
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  long duration = pulseIn(echoPin, HIGH);
  // Calculating the distance
  int distance= duration*0.034/2;
  // Prints the distance on the Serial Monitor
  Serial.print("Distance: ");
  Serial.println(distance);
  //delay(40);
  return distance;
}

void on() {
  
  digitalWrite(13,HIGH);
  digitalWrite(11,HIGH);
  digitalWrite(10,LOW);
  digitalWrite(12,LOW);

}

void back() {
  
  digitalWrite(13,LOW);
  digitalWrite(11,LOW);
  digitalWrite(10,HIGH);
  digitalWrite(12,HIGH);
}

void left() {
  
  digitalWrite(10,LOW);
  digitalWrite(11,HIGH);
  digitalWrite(12,HIGH);
  digitalWrite(13,LOW);
}

void right() {
  
  digitalWrite(10,HIGH);
  digitalWrite(11,LOW);
  digitalWrite(12,LOW);
  digitalWrite(13,HIGH);
}

void stopmotor() {
  
  for (int i=10; i<=13; i++) {
    digitalWrite(i,LOW);
  }
}

void setup() {
  Servo1.attach(servoPin); 
  pinMode(13,OUTPUT); 
  pinMode(12,OUTPUT); 
  pinMode(11,OUTPUT); 
  pinMode(10,OUTPUT);
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
  Serial.begin(9600); // Starts the serial communication
  Servo1.write(90);//avanti
  delay(1000);
}

void loop() {
  
  int distance = readUltrasonic();
  if (distance <= 30) {
    Serial.println("ok");
    stopmotor();
    delay(1000);
    Servo1.write(0);//testa destra
    delay(1000);
    distance = readUltrasonic();
    
    if(distance <= 30) {
      Servo1.write(180);//testa sinistra
      delay(1000);
      distance = readUltrasonic();
      if (distance <= 30 ) {
        Servo1.write(90);//testa avanti
        delay(1000);
        right();
        delay(2000);
      } else {
        Servo1.write(90);//testa avanti 
        delay(1000);
        left();
        delay(1000);
      }
    } else {
      Servo1.write(90); //testa avanti
      delay(1000);
      right();
      delay(1200);
    }
  } else {
    on();
  }
}
