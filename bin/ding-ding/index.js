/**
 * Ding ding
 */
"use strict";

var keypress = require('keypress');

var five = require("johnny-five");
var board = new five.Board();

// Set up of the board
var pins = {
  pullUpButton: 2,  // Other pin in GND
  led: 13,          // Negative end in GND
  servo: 10,
  motor: 5          // Other pin in GND
};

var constants = {
  servoSwingSpeed: 150,
  ledOnOffSpeed: 50,

  servoMin: 135,
  servoMax: 180
}

board.on("ready", function() {

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(true);
  } // Else not needed?

  var button = new five.Button({
    pin: pins.pullUpButton,
    isPullup: true
  });

  var led = new five.Led(pins.led);

  var servo = new five.Servo({
    pin: pins.servo,
    // Ding goes from min to max
    range: [constants.servoMin, constants.servoMax],
    startAt: constants.servoMin
  });

  board.repl.inject({
    servo: servo,
    button: button,
    led: led
  });

  button.on("down", function(value) {
    led.on();
  });

  button.on("up", function() {
    led.off();
  });

  function swingServo() {
    servo.max();
    setTimeout(function() {
      servo.min();
    }, constants.servoSwingSpeed);
  }

  function ledOnOff() {
    led.on();
    setTimeout(function() {
      led.off();
    }, constants.ledOnOffSpeed);
  }

  var keymap = {
    a: swingServo
  };

  process.stdin.on("keypress", function(ch, key) {
    if (!key) {
      return;
    }

    var keyMapFunc = keymap[key.name];
    if (keyMapFunc) {
      keyMapFunc();
      ledOnOff();
    }

  });
});