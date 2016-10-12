(function() {
  'use strict';
  angular
    .module('formioApp')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig(
    $stateProvider,
    $urlRouterProvider,
    $injector,
    AppConfig,
    FormioResourceProvider,
    FormioFormsProvider,
    FormioFormBuilderProvider,
    FormIndexController
  ) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: FormIndexController
      })
      .state('users', {
        abstract: true,
        url: '/users',
        templateUrl: 'views/users.html'
      });

    // Register all of the resources.
    angular.forEach(AppConfig.resources, function(resource, name) {
      FormioResourceProvider.register(name, resource.form, $injector.get(resource.resource + 'Provider'));
    });

    // Register the forms provider to view employee submissions.
    FormioFormsProvider.register('form', AppConfig.appUrl, {
      base: 'users.employee.',
      tag: 'common',
      controllers: {
        submissions: ['$scope', '$stateParams', function($scope, $stateParams) {
          $scope.submissionQuery.owner = $stateParams.employeeId;
        }]
      }
    });

    // Register the form builder provider.
    FormioFormBuilderProvider.register('', AppConfig.appUrl, {
      controllers: {
        form: {
          view: [
            '$scope',
            '$rootScope',
            function(
              $scope,
              $rootScope
            ) {
              $rootScope.whenReady.then(function() {
                if (!$rootScope.isAdministrator) {
                  $scope.hideComponents = ['employee'];
                  $scope.submission.data.employee = $rootScope.user;
                }
              });
            }
          ]
        }
      }
    });

    // Register the form routes.
    $urlRouterProvider.otherwise('/');
  }
})();
