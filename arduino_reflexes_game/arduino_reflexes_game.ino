void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(13, OUTPUT); //for led
  Serial.begin(9600);
}

int min = 500;
int max = 600;

int points = 0;
int life = 3;
bool exit_game = false;

void loop() {

  while(!exit_game) {
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
        button_reflex_ok = true;
      }
      if(count >= timeOut) {
        exit_loop = true;
      }
      delay(1);
      count++;
    }
  
    if(button_reflex_ok) {
      points++;
      if(min > 60) {
        min = min - 10;
        max = max - 10;
      }
    }
    else {
      life--;
      if(life == 0) {
        exit_game = true;
        Serial.println("GAME OVER!!!");
      }
    }

    bool button_reflex_err = false;
    timeOut = random(min, max);
    digitalWrite(13, 0);
    exit_loop = false;
    while(!exit_loop) {
      if (digitalRead(2) == 0) {
        button_reflex_err = true;
      }
      if(count >= timeOut) {
        exit_loop = true;
      }
      delay(1);
      count++;
    }

    if(button_reflex_err) {
      life--;
      Serial.println("PRESS ERROR!!!!");
      if(life == 0) {
        exit_game = true;
        Serial.println("GAME OVER!!!");
      }
    }
    
    delay(timeOut); 
  }
}
