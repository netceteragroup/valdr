angular.module('valdr')

/**
 * This directive allows to dynamically enable and disable the validation with valdr.
 * All form elements in a child node of an element with the 'valdr-enabled' directive will be affected by this.
 *
 * Usage:
 *
 * <div valdr-enabled="isValidationEnabled()">
 *   <input type="text" name="name" ng-model="mymodel.field">
 * </div>
 *
 * If multiple valdr-enabled directives are nested, the one nearest to the validated form element
 * will take precedence.
 */
  .directive('valdrEnabled', ['valdrEvents', function (valdrEvents) {
    return  {
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        $scope.$watch($attrs.valdrEnabled, function () {
          $scope.$broadcast(valdrEvents.revalidate);
        });

        this.isEnabled = function () {
          var evaluatedExpression = $scope.$eval($attrs.valdrEnabled);
          return evaluatedExpression === undefined ? true : evaluatedExpression;
        };
      }]
    };
  }]);
