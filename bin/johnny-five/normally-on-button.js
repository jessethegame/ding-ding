/**
 * Button that is Normally Open (NO) example.
 * See http://en.wikipedia.org/wiki/Switch
 *
 * Based off Johnny-five example: https://github.com/rwaldron/johnny-five/blob/master/docs/button-pullup.md
 */
"use strict";

var five = require("johnny-five");

var board = new five.Board();

// Set up of the board
var pins = {
  led: 13,          // Negative end in GND
  pullUpButton: 4   // Other pin in GND
};

board.on("ready", function() {
  var led = new five.Led(pins.led);

  var button = new five.Button({
    pin: pins.pullUpButton,
    isPullup: true
  });

  this.repl.inject({
    led: led,
    button: button
  });

  // Down is off
  button.on("down", function(value) {
    led.off();
  });

  // Up is on
  button.on("up", function() {
    led.on();
  });
});
