/**
 * Potentiometer example
 *
 * Based off Johnny-five example: https://github.com/rwaldron/johnny-five/blob/master/docs/potentiometer.md
 */
"use strict";

var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {

  var potentiometer = new five.Sensor({
    pin: "A2",
    freq: 250
  });

  board.repl.inject({
    pot: potentiometer
  });

  potentiometer.on("data", function() {
    console.log(this.value, this.raw);
  });
});