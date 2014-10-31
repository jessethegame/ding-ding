(function() {
  "use strict";

  function clickButton(index) {
    console.log("click", index);
  }

  _.each(_.range(4), function(index) {
    var elemSel = '.servo-' + index;
    $(elemSel).click(function() {
      clickButton(index);
    });
  });

  // Socket.io
  var socket = io('http://localhost:7771');
  socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });
})();