"use strict";

var five = require("johnny-five");
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Constants
var CHANGE_THRESHOLD = 2;
var DEFAULT_FREQUENCY = 250;

/**
 * Sensor helper object to make it nicer to
 * use sensor data
 *
 * @param sensorPin {string} The sensor pin value
 * @param board {object} Johnny five board
 * @param options {object} extra options
 *   @property {integer} freq Frequency to check
 *   the sensor. In milliseconds
 *   @property {integer} threshold Threshold in change of value to register a read
 *
 * @fires Sensor#value
 *
 * @example For Sensor connected to the "A0" pin
 *   var pot = new Sensor("A0");
 *   pot.on("read", function(value) {
 *     console.log("A0 value: " + value);
 *   });
 */
var Sensor = function(sensorPin, board, options) {
  // Call `EventEmitter` contructor
  EventEmitter.call(this);

  var self = this;

  options = options || {};
  var checkFreq = options.freq || DEFAULT_FREQUENCY;
  var changeThreshold = options.threshold || CHANGE_THRESHOLD;

  self.val = 0;
  self.prev = 0;

  self.hasChanged = function() {
    return Math.abs(this.val - this.prev) > changeThreshold;
  };

  self.toString = function() {
    return this.val;
  };

  self.sensor = new five.Sensor({
    pin: sensorPin,
    freq: checkFreq
  });

  self.sensor.on("read", function( err, value ) {
    self.val = value;

    if (self.hasChanged()) {
      /**
       * Value change event
       *
       * @emit Sensor#value
       * @type {integer}
       */
      self.emit("read", self.val);
      self.prev = self.val;
    }
  });

  // Inject the `sensor` hardware into
  // the Repl instance's context.
  // Allows direct command line access
  board.repl.inject({
    pot: self.sensor
  });
};

// Inherit EventEmitter, so it can listen/register events
util.inherits(Sensor, EventEmitter);

module.exports = Sensor;