#include <Servo.h>

int right_back_paw_pin = 12;
int right_back_leg_pin = 11;
int left_back_paw_pin = 10;
int left_back_leg_pin = 9;
int right_front_paw_pin = 8;
int right_front_leg_pin = 7;
int left_front_paw_pin = 6;
int left_front_leg_pin = 5;

Servo right_back_paw;
Servo right_back_leg;
Servo left_back_paw;
Servo left_back_leg;
Servo right_front_paw;
Servo right_front_leg;
Servo left_front_paw;
Servo left_front_leg;

int pause_move = 100;

void setup() {
  set_pins();
  attach_servos();
  set_all_home();
}

void set_pins() {
  pinMode(right_back_paw_pin, OUTPUT);
  pinMode(right_back_leg_pin, OUTPUT);
  pinMode(left_back_paw_pin, OUTPUT);
  pinMode(left_back_leg_pin, OUTPUT);
  pinMode(right_front_paw_pin, OUTPUT);
  pinMode(right_front_leg_pin, OUTPUT);
  pinMode(left_front_paw_pin, OUTPUT);
  pinMode(left_front_leg_pin, OUTPUT);
}

void attach_servos() {
  right_back_paw.attach(right_back_paw_pin);
  right_back_leg.attach(right_back_leg_pin);
  left_back_paw.attach(left_back_paw_pin);
  left_back_leg.attach(left_back_leg_pin);
  right_front_paw.attach(right_front_paw_pin);
  right_front_leg.attach(right_front_leg_pin);
  left_front_paw.attach(left_front_paw_pin);
  left_front_leg.attach(left_front_leg_pin);
}

void set_all_home() {
  home_leg(right_back_leg, right_back_paw);
  home_leg(left_back_leg, left_back_paw);
  home_leg(right_front_leg, right_front_paw);
  home_leg(left_front_leg, left_front_paw);
}

void home_leg(Servo leg, Servo paw) {
  leg.write(90);
  //delay(200);
  paw.write(90);
  delay(pause_move);
}

void back_leg_r(Servo leg, Servo paw) {
  paw.write(60);
  delay(pause_move);
  leg.write(20);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void back_leg_l(Servo leg, Servo paw) {
  paw.write(120);
  delay(pause_move);
  leg.write(160);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void front_leg_r(Servo leg, Servo paw) {
  paw.write(120);
  delay(pause_move);
  leg.write(120);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void front_leg_l(Servo leg, Servo paw) {
  paw.write(60);
  delay(pause_move);
  leg.write(60);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void front_leg_r_back(Servo leg, Servo paw) {
  paw.write(60);
  delay(pause_move);
  leg.write(60);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void front_leg_l_back(Servo leg, Servo paw) {
  paw.write(120);
  delay(pause_move);
  leg.write(120);
  delay(pause_move);
  paw.write(90);
  delay(pause_move);
}

void walking_front() {
  front_leg_r(right_front_leg, right_front_paw);
  home_leg(right_front_leg, right_front_paw);
  //delay(pause_move);
  front_leg_r_back(right_back_leg, right_back_paw);
  home_leg(right_back_leg, right_back_paw);
  //delay(pause_move);
  front_leg_l(left_front_leg, left_front_paw);
  home_leg(left_front_leg, left_front_paw);
  //delay(pause_move);
  front_leg_l_back(left_back_leg, left_back_paw);
  home_leg(left_back_leg, left_back_paw);
  delay(pause_move);
}

void turn_right() {
  front_leg_r(right_front_leg, right_front_paw);
  home_leg(right_front_leg, right_front_paw);
  front_leg_l_back(left_back_leg, left_back_paw);
  home_leg(left_back_leg, left_back_paw);
  delay(pause_move);
}

void turn_left() {
  front_leg_l(left_front_leg, left_front_paw);
  home_leg(left_front_leg, left_front_paw);
  front_leg_r_back(right_back_leg, right_back_paw);
  home_leg(right_back_leg, right_back_paw);
  delay(pause_move);
}

void walking_back() {
  back_leg_r(right_back_leg, right_back_paw);
  home_leg(right_back_leg, right_back_paw);
  delay(pause_move);
  back_leg_l(left_back_leg, left_back_paw);
  home_leg(left_back_leg, left_back_paw);
  delay(pause_move);
}

void loop() {
  for (int i = 0; i < 10; i++)
    walking_front();
  delay(1000);
  for (int i = 0; i < 10; i++)
    turn_left();
  delay(1000);
  for (int i = 0; i < 10; i++)
    turn_right();
  delay(1000);
}
