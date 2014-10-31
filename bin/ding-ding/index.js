/**
 * Ding ding
 */
"use strict";

var five = require("johnny-five");
var board = new five.Board();

// Set up of the board
var pins = {
  pullUpButton: 2,  // Other pin in GND
  led: 13,          // Negative end in GND
  motor: 5          // Other pin in GND
};

board.on("ready", function() {

  var button = new five.Button({
    pin: pins.pullUpButton,
    isPullup: true
  });

  var led = new five.Led(pins.led);

  // Create a new `motor` hardware instance.
  var motor = new five.Motor({
    pin: pins.motor
  });

  board.repl.inject({
    motor: motor,
    button: button,
    led: led
  });

  button.on("down", function(value) {
    led.on();
    motor.start();
  });

  button.on("up", function() {
    led.off();
    motor.stop();
  });

  // Motor Event API
  motor.on("start", function(err, timestamp) {
    // motor.isOn === true
    console.log("start", timestamp);
  });

  motor.on("stop", function(err, timestamp) {
    // motor.isOn === false
    console.log("stop", timestamp);
  });
});