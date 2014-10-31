/**
 * Servo controlled by a button
 */

var five = require("johnny-five");

var pins = {
  servo: 10,
  pullUpButton: 2,  // Other pin in GND
  led: 13,          // Negative end in GND
};

five.Board().on("ready", function() {
  console.log("Connected");

  var button = new five.Button({
    pin: pins.pullUpButton,
    isPullup: true
  });

  var led = new five.Led(pins.led);

  // Initialize the servo
  var servo = new five.Servo({
    pin: pins.servo,
    fps: 0 // As fast as possible
  });

  // Add servo to REPL (optional)
  this.repl.inject({
    servo: servo
  });

  function swingServo() {
    servo.max();
    setTimeout(function() {
      servo.center();
    }, 200);
  }

  button.on("down", function(value) {
    led.on();
    swingServo();
  });

  button.on("up", function() {
    led.off();
  });

});