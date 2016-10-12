(function() {
  'use strict';

  /**
   *  The following shows an example resource provider.
   *
   *  This allows you to hook into the CRUD operations for a single Form.io
   *  resource as it is being indexed, viewed, deleted, created, updated, etc. By
   *  providing your logic here, you can control how Form.io behaves within your
   *  application.
   */
  angular.module('formioApp')
    .provider('EmployeeResource', function() {
      return {
        $get: function() { return null; },
        base: 'users.',
        templates: {
          abstract: 'views/employee/resource.html',
          view: 'views/employee/view.html'
        },
        controllers: {
          view: ['$scope', function($scope) {
            $scope.position = null;
            $scope.employee.loadSubmissionPromise.then(function (employee) {
              if (employee.data.address) {
                $scope.position = [
                  employee.data.address.geometry.location.lat,
                  employee.data.address.geometry.location.lng
                ];
              }
            });
          }]
        }
      };
    });
})();
