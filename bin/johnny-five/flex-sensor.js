/**
 * Flex sensor example
 *
 * Similar setup to flexSensor (light dependent resistor)
 *
 * Based off Johnny-five example: https://github.com/rwaldron/johnny-five/blob/master/docs/flexSensor.md
 */
"use strict";

var five = require("johnny-five");

var board = new five.Board();

var pins = {
  flex: "A1"
};

board.on("ready", function() {

  var flexSensor = new five.Sensor({
    // Connect one side to power, and one
    // side to the the pin. Connect the pin also to a
    // 47k resistor, through to ground.
    pin: pins.flex,
    freq: 250
  });

  board.repl.inject({
    flex: flexSensor
  });

  flexSensor.on("data", function() {
    console.log(this.value);
  });
});