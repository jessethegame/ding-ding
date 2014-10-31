/**
 * LED example
 *
 * Based off Johnny-five example: https://github.com/rwaldron/johnny-five/blob/master/docs/led.md
 */
"use strict";

var five = require("johnny-five");

var board = new five.Board();

// Set up of the board
var pins = {
  led: 13,          // Negative end in GND
};

board.on("ready", function() {
  var led = new five.Led(pins.led);

  this.repl.inject({
    led: led
  });

  led.strobe(500);
});
