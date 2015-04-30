/// <reference path="scripts/jquery.js" />
/// <reference path="scripts/knockout.js" />
(function () {
  if (typeof define === "function" && define.amd) {
    define(["ko", "jquery", "OData", "jquery.extentions.D"], function (ko, $, OData) {
      return factory(ko || require("knockout"), $, OData);
    })
  } else
    window.iBar = factory(ko, $, OData);

  var settings = {
    configerUrl: "http://usmpokwiisd01:9000/api/configer/"
  };

  function factory(ko, $, OData) {
    var restServer = $.ajax({
      url: settings.configerUrl + "RestServer/"+location.hostname,
      type: "GET",
      async: false,
      xhrFields: {
        withCredentials: true
      },
      error: $.D.makeErrorDialog
    });
    if (restServer.status >= 400) throw restServer.responseText;
    var rest = restServer.responseJSON.rest;
    var dataSeviceServer = (rest.protocol || "http") + "://" + restServer.responseJSON.name + (rest.port ? ":" + rest.port : "") + "/" + rest.path;
    if (!dataSeviceServer.match(/\/$/)) dataSeviceServer = dataSeviceServer + "/";
    var iBar = {
      dataSeviceServer: dataSeviceServer,
      dataServiceUrl: dataSeviceServer + "IBarDataService.svc/",
      loader: $.D.loader,
      ViewNodel: {
        clearPrevious: function (observer) {
          var prev = observer.previous();
          if (prev) prev.__ext.isSelected(false);
        },
        makeSelectable: function makeSelectable(v, observer) {
          try {
            return $.extend(v, {
              __ext: {
                isSelected: ko.live(false
              , function (v) {
                if (v) observer(this);
                else if (observer() === this)
                  observer(null);
              }, v)
              }
            });
          } catch (e) {
            debugger;
          }
        }
      }
    };
    OData.defaultError = function (error) {
      iBar.loader.hideAll();
      $.D.makeErrorDialog(error);
    }
    //wrapper to an observable that requires accept/cancel
    ko.protectedObservable = function (initialValue) {
      //private variables
      var _actualValue = ko.observable(initialValue),
          _tempValue = initialValue;

      //computed observable that we will return
      var result = ko.computed({
        //always return the actual value
        read: function () {
          return _actualValue();
        },
        //stored in a temporary spot until commit
        write: function (newValue) {
          _tempValue = newValue;
        }
      });

      //if different, commit temp value
      result.commit = function () {
        if (_tempValue !== _actualValue()) {
          _actualValue(_tempValue);
        }
      };

      //force subscribers to take original
      result.reset = function () {
        _actualValue.valueHasMutated();
        _tempValue = _actualValue();   //reset temp value
      };

      return result;
    };
    ko.prevValueObservable = function (initialValue) {
      //private variables
      var _actualValue = ko.observable(initialValue),
          _prevValue = ko.observable();

      //computed observable that we will return
      var result = ko.computed({
        //always return the actual value
        read: function () {
          return _actualValue();
        },
        //stored in a temporary spot until commit
        write: function (newValue) {
          _prevValue(_actualValue());
          _actualValue(newValue);
        }
      });

      //if different, commit temp value
      result.previous = function () {
        return _prevValue();
      };

      //force subscribers to take original
      result.reset = function () {
        _prevValue(undefined);
      };

      return result;
    }
    $.extend(true, ko, {
      live: function (value, callback, context) {
        var observable = ko.prevValueObservable(value);
        observable.subscribe(callback, context);
        return observable;
      }
    });
    return iBar;
  }
})();