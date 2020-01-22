void setup() {
  pinMode(2, INPUT_PULLUP);
  digitalWrite(12, OUTPUT); //for buzzer
  pinMode(13, OUTPUT); //for led
  Serial.begin(9600);
}

int min = 500;
int max = 1000;

int points = 0;

void loop() {

  bool exit_loop = false;
  int count = 0;
  int timeOut = random(min, max);
  bool button_reflex_ok = false;
  
  Serial.print("Punti: ");
  Serial.print(points);
  Serial.println();
  
  digitalWrite(13, 1);
  while(!exit_loop) {
    if (digitalRead(2) == 0) {
      Serial.println("ok, jon");
      button_reflex_ok = true;
    }
    if(count >= timeOut) {
      exit_loop = true;
    }
    delay(1);
    count++;
  }

  if(button_reflex_ok)
    points++;
  else {
    digitalWrite(12, 1);
    delay(300);
    digitalWrite(12, 0);
  }
  
  digitalWrite(13, 0);
  timeOut = random(min, max);
  delay(timeOut);
}
