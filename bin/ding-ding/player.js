var _ = require('lodash');

function Player(config) {
  var self = this;

  this.config = _.clone(config);
  this.config.interval = this.config.interval || 500;

  this.isPlaying = false;

  this.currentTick = 0;

  this.reset = function() {
    self.currentTick = 0;
  }

  /**
   * Play the sequence
   * @param {array} seq
   * @param {function} Function to execute at each interval
   */
  this.play = function(seq, playFunc) {
    self.isPlaying = true;
    var length = seq.length;

    var playTick = function(tick) {
      console.log("playTick", tick);
      if (tick < length) {
        var vals = seq[tick];

        // Cancel previous timeout
        clearTimeout(self.currentTimeout);

        // Run play function
        playFunc(vals);

        // Play next tick after interval
        self.currentTimeout = setTimeout(function() {
          self.currentTick++;
          playTick(self.currentTick);
        }, self.config.interval);
      } else {
        self.reset();
      }
    };

    playTick(self.currentTick);
  };

  self.reset();
}

module.exports = Player;