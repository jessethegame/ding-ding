(function() {
  "use strict";
  var socketIOUrl = 'http://localhost:7771';
  var socket = io(socketIOUrl);

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
})();
//# sourceMappingURL=app.js.map