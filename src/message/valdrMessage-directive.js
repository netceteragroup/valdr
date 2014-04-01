angular.module('valdr')

/**
* This directive adds violation messages next to the input fields.
*/
  .directive('input',
  ['$compile', function ($compile) {
    return  {
      restrict: 'E',
      require: ['?^valdrType', '?^ngModel', '?^form'],
      link: function (scope, element, attrs, controllers) {

        var valdrTypeController = controllers[0],
          ngModelController = controllers[1],
          formController = controllers[2],
          fieldName = attrs.name;

        // Stop right here if this is an <input> that's either not inside of a valdr-type block
        // or there is no ng-model bound to it.
        if (!valdrTypeController || !ngModelController || !formController) {
          return;
        }

        // Add violation message
        if (angular.isUndefined(attrs.noValdrMessage)) {
          var formField = formController.$name + '.' + fieldName;
          var validationMessageMarkup = '<span valdr-message="' + formField + '"></span>';
          var validationMessageElement = angular.element(validationMessageMarkup);
          element.after(validationMessageElement);
          $compile(validationMessageElement)(scope);
        }
      }
    };
  }])

/**
* The valdr-violation directive is responsible for the rendering violation messages.
*/
  .directive('valdrMessage', function (valdrMessage, $translate, $rootScope) {
    return {
      replace: true,
      scope: {
        formField: '=valdrMessage'
      },
      templateUrl: function () {
        return valdrMessage.templateUrl;
      },
      link: function (scope) {

        var updateTranslations = function () {
          if (scope.violations && scope.violations.length) {
            angular.forEach(scope.violations, function (violation) {
              violation.fieldName = $translate.instant(violation.field);
            });
          }
        };

        scope.$watch('formField.valdrViolations', function (valdrViolations) {
          if (valdrViolations && valdrViolations.length) {
            scope.violations = valdrViolations;
            scope.violation = valdrViolations[0];
            updateTranslations();

          } else {
            scope.violation = undefined;
            scope.violations = undefined;
          }
        });

        $rootScope.$on('$translateChangeSuccess', function () {
          updateTranslations();
        });
      }
    };
  });
