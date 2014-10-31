// From https://gist.github.com/pauldenotter/9261976
"use strict";

var socketIO = require('socket.io');

exports.register = function(plugin, options, next) {
  // this is the hapi specific binding
  var io = socketIO.listen(plugin.servers[0].listener);

  io.on('connection', function (socket) {

    socket.on('button', function(data) {
      console.log(data);
    });

  });

  next();
};

exports.register.attributes = {
  pkg: {
    name: 'hapi-socketio'
  }
};