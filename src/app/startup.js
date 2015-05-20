/// <reference path="../bower_modules/knockout/dist/knockout.js" />

define(['knockout', 'configer', 'app-config'], function (ko, configer, appConfig) {
  // set SPA configuration
  appConfig.configerUrl = "http://usmrtpwiisp01:9000/api/configer/";
  appConfig.dataServiceUrl = "FinanceDataService.svc";
  appConfig.appName = "ibar";

  // fetch back-end configuration from HPS
  var vm = { configer: "", error: "", done: ko.observable("not done") };
  configer
    .fetch(appConfig)
    .done(function (c) {
      $.extend(vm, { configer: JSON.stringify(c, null, 2) });
      setTimeout(function () {
        configer.done(function (d) {
          vm.done(JSON.stringify(d));
        });
      }, 2000);
    })
    .fail(function (e) {
      $.extend(vm, { error: JSON.stringify(e, null, 2) });
    }).always(function () {
      ko.applyBindings(vm);
    });
  ;
});;