(function () {
  if (typeof define === "function" && define.amd) {
    define(["knockout", "jquery", "OData"/*, "jquery.extentions.D", "localSettings"*/], function (ko, $, OData) {
      return factory(ko, $, OData,settings);
    })
  } else
    window.iBar = factory(ko, $, OData);

  var settings = {
    configerUrl: "http://usmpokwiisd01:9000/api/configer/",
    dataServiceUrl: "FinanceDataService.svc"
  };

  function factory(ko, $, OData) {
    var restServer = $.ajax({
      url: settings.configerUrl + "RestServer/" + location.hostname,
      type: "GET",
      async: false,
      xhrFields: {
        withCredentials: true
      },
      error: alert
    });
    if (restServer.status >= 400) throw restServer.responseText;
    var rest = restServer.responseJSON.rest;
    var dataServiceServer = buildPath((rest.protocol || "http") + "://" + restServer.responseJSON.name + (rest.port ? ":" + rest.port : "") + "/" + rest.path);
    var commonSettings = {
      dataServiceServer: dataServiceServer,
      dataServiceUrl: buildPath(dataServiceServer) + buildPath(settings.dataServiceUrl),
      loader: function () { alert("Loader is not implemented.");}
    };
    //OData.defaultError = function (error) {
    //  //$.D.loader.loader.hideAll();
    //  //$.D.makeErrorDialog(error);
    //}
    return commonSettings;
  }
  function buildPath(path) {
    return path + (!path.match(/\/$/) ? "/" : "");
  }

})();