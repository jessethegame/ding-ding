"use strict";

var _ = require('lodash');

function Recorder(config) {
  var self = this;

  this.config = _.clone(config);

  this.saved = [];

  this.reset = function() {
    this.saved = [];
  };

  // TODO: Only works for 1 value at a time right now
  this.save = function(index) {
    if (self.saved.length > this.config.length) {
      // Delete first
      self.saved.shift();
    }
    // Push new value to the end
    self.saved.push([index]);
  };

  this.reset();
}

module.exports = Recorder;