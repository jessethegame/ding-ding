/**
 * Ding ding
 */
"use strict";

var keypress = require('keypress');
var _ = require('lodash');

var five = require("johnny-five");
var board = new five.Board();

// Set up of the board
var pins = {
  pullUpButton: 2,  // Other pin in GND
  led: 0,          // Negative end in GND
  motor: 5,          // Other pin in GND
};

var constants = {
  servoSwingSpeed: 150,
  ledOnOffSpeed: 50,

  servoMin: 135,
  servoMax: 180,

  // Also defines how many servos there are, and
  // what index they are
  servos: [
    {
      pin: 6
    },
    {
      pin: 11
    },
    {
      pin: 10
    },
    {
      pin: 9
    }
  ]
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

  var servos = [];

  _.each(constants.servos,function(servoConfig, index) {
    servos[index] = new five.Servo({
      pin: servoConfig.pin,
      // Ding goes from min to max
      range: [constants.servoMin, constants.servoMax],
      startAt: constants.servoMin,
      isInverted: true
    });
  });



  board.repl.inject({
    servos: servos,
    button: button,
    led: led
  });

  button.on("down", function(value) {
    led.on();
  });

  button.on("up", function() {
    led.off();
  });

  /**
   * Generate a function to swing the servo
   *
   * @param  {integer} servoIndex
   * @return {function} Function to swing the servo
   */
  function swingServo(servoIndex) {
    return function() {
      var servo = servos[servoIndex];

      servo.max();
      setTimeout(function() {
        servo.min();
      }, constants.servoSwingSpeed);
    };
  }

  function ledOnOff() {
    led.on();
    setTimeout(function() {
      led.off();
    }, constants.ledOnOffSpeed);
  }

  var keymap = {
    a: swingServo(0),
    s: swingServo(1),
    d: swingServo(2),
    f: swingServo(3),
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