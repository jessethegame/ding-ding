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
var Recorder = require('./recorder');

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

  servoMin: 170,
  servoMax: 180,

  // Also defines how many servos there are, and
  // what index they are
  servos: [
    {
      pin: 9
    },
    {
      pin: 10
    },
    {
      pin: 11
    },
    {
      pin: 6
    }
  ],

  defaultPlaySeq: [
    [0],
    [1],
    [2],
    [3],
    [0, 1],
    [2, 3],
    [1, 2, 3, 4]
  ],

  // How many key presses to record
  defaultRecordLength: 10
}

board.on("ready", function() {

  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  if (typeof process.stdin.setRawMode === 'function') {
    process.stdin.setRawMode(true);
  } // Else not needed?

  var playSequence = constants.defaultPlaySeq;

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

  var recorder = new Recorder({
    length: constants.defaultRecordLength
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
    var servo = servos[servoIndex];

    servo.max();
    setTimeout(function() {
      servo.min();
    }, constants.servoSwingSpeed);

    recorder.save(servoIndex);
    playSequence = recorder.saved;
  }

  function ledOnOff() {
    led.on();
    setTimeout(function() {
      led.off();
    }, constants.ledOnOffSpeed);
  }

  var keymap = {
    a: 0,
    s: 1,
    d: 2,
    f: 3,
  };

  var playKeyMap = function(key) {
    var servoIndex = keymap[key];
    if (servoIndex !== undefined) {
      swingServo(servoIndex);
      ledOnOff();
    }
  }

  var playServoIndex = function(index) {
    if ((index >= 0) &&
        (index < constants.servos.length)) {
      console.log("Swing", index);
      swingServo(index);
      ledOnOff();
    }
  }

  var setPlaySequence = function(seq) {
    playSequence = seq;
  }

  var debouncedPlay = _.debounce(function() {
    player.play(playSequence, function(indices) {
      console.log("keys:", indices);
      _.each(indices, function(index) {
        playServoIndex(index);
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
    playServo: playServoIndex,
    setPlaySequence: setPlaySequence
  });
});

module.exports = {
  onReady: boardDeferred.promise
};