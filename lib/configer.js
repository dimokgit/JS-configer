(function () {
  if (typeof define === "function" && define.amd) {
    define(["knockout", "jquery", 'promise-monad'/*, "jquery.extentions.D", "localSettings"*/], factory);
  } else throw "Must use AMD";

  function factory(ko, $, PM) {
    var hostName = location.hostname;
    var appConfigCache;
    function fetchRestServer(appConfig) {
      appConfigCache = appConfig;
      var p = $.Deferred(),
        url = appConfig.configerUrl + "RestServer/" + appConfig.appName + "/" + hostName;
      $.ajax({
        url: url,
        type: "GET",
        async: true,
        xhrFields: { withCredentials: true },
        success: function (v) {
          p.resolve($.extend(v, { __appConfig: appConfig }));
        },
        error: error
      });
      return p;
      /// Locals 
      function error(e) {
        p.reject($.extend(e, { url: url }));
      }
    }
    var promise = null;
    function doRestServer(restServer) {
      var rest = restServer.rest;
      var dataServiceServer = buildPath((rest.protocol || "http") + "://" + (rest.host || hostName) + (rest.port ? ":" + rest.port : "") + "/" + rest.path);
      return {
        dataServiceServer: dataServiceServer,
        dataServiceUrl: buildPath(dataServiceServer) + buildPath(restServer.dataService),
        appConfig: restServer.__appConfig
      };
    }
    PM.prototype.fetch = function (appConfig) { return promise = this.pump(appConfig); }
    PM.prototype.done = function (callback) {
      if (promise === null) return alert("Done is used, but configer was not fetched.");
      promise.done(callback);
    }
    return new PM(fetchRestServer, doRestServer);
  }
  function buildPath(path) {
    return path + (!path.match(/\/$/) ? "/" : "");
  }
})();