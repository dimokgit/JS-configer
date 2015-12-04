define(["jquery"], function ($) {
  var root = $.Deferred();
  var path = location.pathname.split(/([^/]+)/);
  getRoot();
  return root;
  function getRoot() {
    var url = path.join('') + "root";
    console.log("searching for root in " + url);
    path = path.slice(0, -2);
    if (!url) {
      console.log("root not found");
      return root.resolve("");
    }
    $.ajax({
      url: url,
      success: function (data) {
        data = data.replace(/\/root$/i, '');
        return root.resolve(data === "/" ? "" : data);
      },
      error: function () {
        if (!path.length) {
          var error = "root is not found."
          alert(error);
          throw error;
        }
        getRoot();
      }
    });
  }
});
