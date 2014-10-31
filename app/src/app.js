(function() {
  "use strict";

  function clickButton(index) {
    console.log("click", index);
  }

  _.each(_.range(4), function(index) {
    var elemSel = '.servo-' + index;
    $(elemSel).click(function() {
      clickButton(index);
    })
  })
})();