(function() {
  'use strict';
  angular
    .module('formioApp', [
      'ngSanitize',
      'ui.router',
      'ui.bootstrap',
      'ui.bootstrap.accordion',
      'ui.bootstrap.alert',
      'ngFormioHelper',
      'ngFormBuilderHelper',
      'ngFormBuilder',
      'bgf.paginateAnything',
      'formio',
      'ngMap'
    ]);
})();
