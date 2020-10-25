#include "MeMCore.h"
MeDCMotor motor1(M1);
MeDCMotor motor2(M2);

/* value: between -255 and 255. */
int motorSpeed = 100;

int time_delay = 710;
int distance = 15;
MeUltrasonicSensor ultraSensor(PORT_3);

MeLineFollower lineFinder(PORT_2);

void vaiAvanti() {
  motor1.run(-motorSpeed); 
  motor2.run(motorSpeed);
}

void vaiDietro() {
  motor1.run(motorSpeed); 
  motor2.run(-motorSpeed);
}

void fermati() {
  motor1.stop();
  motor2.stop();
}

void vaiADestra() {
  motor1.run(-motorSpeed); 
  motor2.run(-motorSpeed);
}

void vaiASinistra() {
  motor1.run(motorSpeed); 
  motor2.run(motorSpeed);
}

void setup() {
  Serial.begin(9600);
}

void wifi_car_ctrl(int msg) {
  if (msg == 119) { // carattere w
        vaiAvanti();
  } else if (msg == 115) { // carattere s
    vaiDietro();
  } else if (msg == 100) { // carattere d
    vaiADestra();
  } else if (msg == 97) { // carattere a
    vaiASinistra();
  } else if (msg == 102) { // carattere f
    fermati();
  }
}

void obstacle_avoid() {
  int ultra_distance = 0;
  ultra_distance = ultraSensor.distanceCm();
  Serial.print("[INFO] Distance: ");
  Serial.print(ultra_distance );
  delay(100);

  if (ultra_distance < distance) {
    vaiADestra();
    delay(time_delay);
    fermati();
    ultra_distance = ultraSensor.distanceCm();
    delay(100);
    if (ultra_distance < distance) {
      vaiASinistra();
      delay(time_delay*2);
      vaiAvanti();
    }
    fermati();
    ultra_distance = ultraSensor.distanceCm();
    delay(100);
    if (ultra_distance < distance) {
      vaiASinistra();
      delay(time_delay);
      vaiAvanti();
    }
  } else {
    vaiAvanti();
  }
}

void follow_line () {
  
  int sensorState = lineFinder.readSensors();
  switch(sensorState) {
    case S1_IN_S2_IN: 
      Serial.println("Sensore di sx (1) e di dx (2) all'interno della linea nera!");
      Serial.println("Prosegui dritto!!!");
      vaiAvanti();
      break;
    case S1_OUT_S2_OUT: 
      Serial.println("Sensore di sx (1) e di dx (2) all'esterno della linea nera!");
      Serial.println("Fermati!!!");
      //fermati();
      vaiDietro();
      break;
    case S1_IN_S2_OUT: 
      Serial.println("Sensore di sx (1) all'interno e di dx (2) all'esterno della linea nera!");
      Serial.println("Ruotare a sinistra!!!");
      vaiASinistra();
      break;
    case S1_OUT_S2_IN: 
      Serial.println("Sensore di sx (1) all'esterno e di dx (2) all'interno della linea nera!");
      Serial.println("Ruotare a destra!!!");
      vaiADestra();
      break;
    default: 
      break;
  }
  delay(50);
}

int msg = 0;
bool wifi_ctrl_mode = true;
bool obstacle_avoid_mode = false;
bool follow_line_mode = false;

void loop() {
  Serial.println("");
  delay(10);
  if (Serial.available() > 0) {
    msg = Serial.read();
    Serial.println(msg);
    
    if (msg == 121) { // carattere y: wifi_ctrl_mode_on
        wifi_ctrl_mode = true;
        obstacle_avoid_mode = false;
        follow_line_mode = false;
        fermati();
    } else if (msg == 117) { // carattere u: obstacle_avoid_mode_on
        wifi_ctrl_mode = false;
        obstacle_avoid_mode = true;
        follow_line_mode = false;
        fermati();
    } else if (msg == 105) { // carattere i: follow_line_mode_on
        wifi_ctrl_mode = false;
        obstacle_avoid_mode = false;
        follow_line_mode = true;
        fermati();
    } else if (msg == 43) { // carattere i: speed +
        motorSpeed++;
    } else if (msg == 45) { // carattere i: speed -
        motorSpeed--;
    }
  }
  
  if (wifi_ctrl_mode)
      wifi_car_ctrl(msg);
  else if (obstacle_avoid_mode)
    obstacle_avoid();
  else if (follow_line_mode)
    follow_line();
      
}
