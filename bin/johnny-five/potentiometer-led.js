/**
 * Potentiometer example
 *
 * Based off Johnny-five example: https://github.com/rwaldron/johnny-five/blob/master/docs/potentiometer.md
 */
"use strict";

var five = require("johnny-five");
var Sensor = require("./lib/Sensor");
var helper = require("./lib/helper");

var board = new five.Board();

var NORM_MIN = 0;
var NORM_MAX = 1.0;

var LED_MIN = 0;
var LED_MAX = 255;

var POT_MIN = 0;
var POT_MAX = 1023;

var pins = {
  led: 11, // Negative end in GND. Also need a PWM pin
  pot: "A2"
};

board.on("ready", function() {

  var led = new five.Led(pins.led);
  var potentiometer = new five.Sensor({
    pin: pins.pot,
    freq: 250
  });

  board.repl.inject({
    led: led,
    pot: potentiometer
  });

  potentiometer.on("data", function(value) {
    var value = this.value;
    var normVal = helper.inRange(value, POT_MIN, POT_MAX, NORM_MIN, NORM_MAX);
    var ledVal = helper.inRange(value, POT_MIN, POT_MAX, LED_MIN, LED_MAX);

    console.log(value, normVal, ledVal);
    led.brightness(ledVal);
  });
});