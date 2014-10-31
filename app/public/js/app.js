(function() {
  "use strict";

  var urlPrefix = "https://api.spark.io/v1/devices/" + CONFIG.sparkCoreId;
  var accessToken = "access_token=" + CONFIG.accessToken;
  var stateUrl = urlPrefix + "/state?" + accessToken;
  var sparkEventsUrl = "https://api.spark.io/v1/events?" + accessToken;

  function setCoreColour(colorObj) {
    var rgbStr = colorObj.r + "," + colorObj.g + "," + colorObj.b;
    $(".rgb-color").css("background-color", "rgb(" + rgbStr + ")");
  }

  // Get initial colour
  $.get(stateUrl)
    .done(function(data) {
      var result = data["result"];

      try {
        var colorObj = JSON.parse(result);
        setCoreColour(colorObj);
      } catch(err) {
        console.log("Parse error", result, err);
      }
    })
    .fail(function(err) {
      console.log("Get state error", err);
    });

  // Subscribe to change events
  var sparkEvents = new EventSource(sparkEventsUrl);
  sparkEvents.onmessage = function(e) {
    console.log(e);
  };

  sparkEvents.onerror = function(e) {
    console.log("sparkEvents failed", e);
  };

})();
//# sourceMappingURL=app.js.map