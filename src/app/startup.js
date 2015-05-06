/// <reference path="../bower_modules/knockout/dist/knockout.js" />

define(['jquery', 'knockout', './router', 'configer', 'bootstrap', 'knockout-projections'], function ($, ko, router, configer) {

  // Components can be packaged as AMD modules, such as the following:
  ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
  ko.components.register('home-page', { require: 'components/home-page/home' });

  // ... or for template-only components, you can just point to a .html file directly:
  ko.components.register('about-page', {
    template: { require: 'text!components/about-page/about.html' }
  });

  // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
  function toDictionary(o) {
    return $.map(o, function (v, n) { return { key: n, value: ko.unwrap(v) }; });
  }
  // Start the application
  var vm = { configer: [], error: "" };
  configer
    .done(function (c) {
      $.extend(vm, { configer: toDictionary(c) });
    })
    .fail(function (e) {
      $.extend(vm, { error: JSON.stringify(e,null,2) });
    }).always(function () {
      ko.applyBindings(vm);
    });
  ;
});
