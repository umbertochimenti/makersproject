const {Board, Servo} = require("johnny-five");
const board = new Board();

board.on("ready", () => {
  var servo = new Servo({
    id: "MyServo",     // User defined id
    pin: 10,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 1,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
  });

  var servo2 = new Servo({
    id: "MyServo",     // User defined id
    pin: 11,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 1,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
  });

  var servo3 = new Servo({
    id: "MyServo",     // User defined id
    pin: 12,           // Which pin is it attached to?
    type: "standard",  // Default: "standard". Use "continuous" for continuous rotation servos
    range: [0,180],    // Default: 0-180
    fps: 1,          // Used to calculate rate of movement between positions
    invert: false,     // Invert all specified positions
    startAt: 90,       // Immediately move to a degree
    center: true,      // overrides startAt if true and moves the servo to the center of the range
  });


  var i = 0;
  var rotation = false;

  setInterval(() => {
    servo.to(i);
    servo2.to(i);
    servo3.to(i+90);

    if (!rotation)
      i +=10;
    else
      i -=10;

    if(i >= 100)
      rotation = true;
    else if(i < 10)
      rotation = false;
      
  }, 500);

});
