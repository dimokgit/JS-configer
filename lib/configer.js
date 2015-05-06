(function () {
  if (typeof define === "function" && define.amd) {
    define(["knockout", "jquery", 'promise-monad'/*, "jquery.extentions.D", "localSettings"*/], factory);
  } else throw "Must use AMD";


  var settings = {
    configerUrl: "http://usmpokwiisd01:9000/api/configer/",
    dataServiceUrl: "FinanceDataService.svc"
  };

  function factory(ko, $, PM) {
    var hostName = location.hostname;
    function fetchRestServer() {
      var p = $.Deferred(),
        url = settings.configerUrl + "RestServer/iBar/" + hostName;
      $.ajax({
        url: url,
        type: "GET",
        async: true,
        xhrFields: { withCredentials: true },
        success: p.resolve.bind(p),
        error: error
      });
      return p;
      /// Locals 
      function error(e) {
        p.reject({ url: url, inner: e });
      }
    }
    function doRestServer(restServer) {
      var rest = restServer.rest;
      var dataServiceServer = buildPath((rest.protocol || "http") + "://" + (rest.host || hostName) + (rest.port ? ":" + rest.port : "") + "/" + rest.path);
      return {
        dataServiceServer: dataServiceServer,
        dataServiceUrl: buildPath(dataServiceServer) + buildPath(settings.dataServiceUrl),
        loader: function () { alert("Loader is not implemented."); }
      };
    }
    return new PM(fetchRestServer, doRestServer).pump();
    //OData.defaultError = function (error) {
    //  //$.D.loader.loader.hideAll();
    //  //$.D.makeErrorDialog(error);
    //}
  }
  function buildPath(path) {
    return path + (!path.match(/\/$/) ? "/" : "");
  }
  function toDictionary(o) {
    return $.map(o, function (v, n) { return { key: n, value: ko.unwrap(v) }; });
  }

})();