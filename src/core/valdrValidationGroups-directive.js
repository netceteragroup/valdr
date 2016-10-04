angular.module('valdr')

/**
 * The valdrValidationGroups directive defines the active validation groups: when an array of group names is specified, only constraints having
 * one of the specified groups in their 'groups' array are validated. In the absence of this directive all constraints are validated.
 * The directive exposes the validation groups through the controller to allow access to it by wrapped directives.
 */
    .directive('valdrValidationGroups', ['valdrEvents', function (valdrEvents) {
      return  {
        priority: 1,
        controller: ['$scope', '$attrs', function ($scope, $attrs) {
          $scope.$watch($attrs.valdrValidationGroups, function () {
            $scope.$broadcast(valdrEvents.revalidate);
          });

          this.getValidationGroups = function () {
            return $scope.$eval($attrs.valdrValidationGroups);
          };

        }]
      };
    }]);
