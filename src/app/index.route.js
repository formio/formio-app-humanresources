/* globals location */
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
      })
      .state('auth.sendreset', {
        url: '/sendreset',
        templateUrl: 'views/user/sendreset.html',
        controller: ['$scope', function($scope) {
          $scope.submitted = false;
          $scope.submission = {data: {applicationUrl: location.origin}};
          $scope.$on('formSubmission', function() {
            $scope.submitted = true;
          });
        }]
      })
      .state('resetpass', {
        url: '/resetpass',
        templateUrl: 'views/user/resetpass.html',
        controller: [
          '$scope',
          '$state',
          'Formio',
          '$rootScope',
          'AppConfig',
          function(
            $scope,
            $state,
            Formio,
            $rootScope,
            AppConfig
          ) {
            $scope.form = null;
            (new Formio(AppConfig.forms.resetPassForm)).loadForm().then(function(form) {
              $scope.form = form;
            });

            // Ensure the user is fully loaded.
            $rootScope.whenReady.then(function() {
              $scope.$on('formSubmission', function(event, submission) {

                // Set the logged in user's password.
                $rootScope.user.data.password = submission.data.password;

                // Now save the user back to the API.
                (new Formio(AppConfig.resources.employee.form)).saveSubmission($rootScope.user).then(function() {

                  // Go to the home state after they reset their password.
                  $state.go('home');
                });
              });
            });
          }]
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
      templates: {
        form: {
          abstract: 'views/form/form.html',
          view: 'views/form/view.html'
        },
        submission: {
          view: 'views/form/submission/view.html'
        }
      },
      controllers: {
        form: {
          view: [
            '$scope',
            '$rootScope',
            function(
              $scope,
              $rootScope
            ) {
              $scope.formpath = '';
              $scope.project = AppConfig.project;
              $rootScope.whenReady.then(function() {
                $scope.formLoadPromise.then(function() {
                  $scope.formpath = $scope.form.path;
                });

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
