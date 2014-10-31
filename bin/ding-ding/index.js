/**
 * Ding ding
 */
"use strict";

var keypress = require('keypress');
var _ = require('lodash');
var Q = require('q');

var five = require("johnny-five");
var board = new five.Board();
var boardDeferred = Q.defer();

var Player = require('./player');

// Set up of the board
var pins = {
  pullUpButton: 2, // Other pin in GND
  led: 4,          // Negative end in GND
  playLed: 8,      // Negative end in GND
  motor: 5,        // Other pin in GND
  bigRedButton: 7  // Other pin in GND
};

var constants = {
  servoSwingSpeed: 150,
  ledOnOffSpeed: 50,

  buttonDebounce: 200,

  servoMin: 175,
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

  // var button = new five.Button({
  //   pin: pins.pullUpButton,
  //   isPullup: true
  // });

  var bigRedButton = new five.Button({
    pin: pins.bigRedButton,
    isPullup: true
  });

  var led = new five.Led(pins.led);
  var playLed = new five.Led(pins.playLed);

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

  var player = new Player({
    interval: 500,
    onStart: function() {
      playLed.on();
    },
    onStop: function() {
      playLed.off();
    }
  });

  board.repl.inject({
    servos: servos,
    // button: button,
    led: led
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

  var playKeyMap = function(key) {
    var keyMapFunc = keymap[key];
    if (keyMapFunc) {
      keyMapFunc();
      ledOnOff();
    }
  }

  var playServoIndex = function(index) {
    if ((index >= 0) &&
        (index < constants.servos.length)) {
      console.log("Swing", index);
      swingServo(index)();
      ledOnOff();
    }
  }

  var debouncedPlay = _.debounce(function() {
    player.play([
      ['a'],
      ['s'],
      ['d'],
      ['f'],
      ['a', 's'],
      ['d', 'f'],
      ['a', 's', 'd', 'f']
    ], function(keys) {
      console.log("keys:", keys);
      _.each(keys, function(key) {
        playKeyMap(key);
      });
    });
  }, constants.buttonDebounce);

  // A normally on button, so need it to read `up`
  // button.on("down", function(value) {
  //   debouncedPlay();
  // });

  // A normally on button, so need it to read `up`
  bigRedButton.on("up", function(value) {
    debouncedPlay();
  });

  // Play key map when key is pressed
  process.stdin.on("keypress", function(ch, key) {
    if (!key) {
      return;
    }

    playKeyMap(key.name);
  });

  // Return the board and some info
  boardDeferred.resolve({
    board: board,
    playServo: playServoIndex
  });
});

module.exports = {
  onReady: boardDeferred.promise
};