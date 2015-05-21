(function () {
  if (typeof define === "function" && define.amd) {
    define(function () {
      return new AppConfig();
    });
  } else throw "Must use AMD";

  function AppConfig() {
    this.appName= "";
    this.configerUrl= "";
    this.toString = function () {
      return JSON.stringify(this, null, 2);
    }
  }
})();