(function() {
  "use strict";
  var socketIOUrl = 'http://localhost:7771';
  var socket = io(socketIOUrl);

  var keyServoIndex = {
    97: 0, // 'a',
    115: 1, // 's',
    100: 2, // 'd',
    102: 3 // 'f'
  }

  function clickButton(index) {
    console.log('emit', index);
    socket.emit('button', { index: index });
  }

  _.each(_.range(4), function(index) {
    var elemSel = '.servo-' + index;
    $(elemSel).click(function() {
      clickButton(index);
    });
  });

  socket.on('connect', function (data) {
    console.log("Connected to", socketIOUrl);
  });

  $(document).keypress(function(event) {
    console.log( "Key", event.which);

    var servoIndex = keyServoIndex[event.which];
    if (_.isNumber(servoIndex)) {
      clickButton(servoIndex);
    }
  });
})();
//# sourceMappingURL=app.js.map