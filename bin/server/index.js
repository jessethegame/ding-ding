"use strict";

var Hapi = require('hapi');
var moment = require('moment');
var _ = require('lodash');

require('colors');

var host = '0.0.0.0';
var port = process.env.PORT || 7771;

var server = new Hapi.Server(host, port, {
  // docs: true
  cors: true
});

server.on('log', function(event, tags) {
  var rawData = event.data;
  var data = _.isObject(rawData) ? JSON.stringify(rawData) : rawData;
  var tagsStr = '[' + Object.keys(tags).join(', ') + ']';
  var timeStr = moment().format('HH:mm:ss,YYYY-MM-DD');
  var prefix = timeStr + " " + tagsStr;

  if (_.has(tags, 'error')) {
    prefix = prefix.red;
  } else if (_.has(tags, 'debug')) {
    prefix = prefix.yellow;
  } else if (_.has(tags, 'success')) {
    prefix = prefix.green;
  } else {
    prefix = prefix.grey;
  }

  console.log(
    prefix + " " + ('' + data).cyan
  );
});

// Static file handler
server.route({
  method: 'GET',
  path: '/{file*}',
  config: {
    auth: false,
    handler: {
      directory: {
        path: __dirname + "/../../app/public"
      }
    }
  }
});

server.start(function() {
  var msg = "Server started at: " + server.info.uri;
  var prod = process.env.NODE_ENV === "production" ? " [production]" : "";

  server.pack.register(require('./hapi-socketio'), function (err) {
    if (err) {
      console.error('Failed to load plugin:', err);
    }
  });

  server.log(["debug"], msg + prod);
});