angular.module('valdr')

  /**
   * This directive appends a validation messages after all input elements, which are nested in a valdr-type
   * directive and have an ng-model bound to them.
   * To prevent adding messages to specific input fields, the attribute 'no-valdr-message' can be added to those input fields.
   * The valdr-message directive is used to do the actual rendering of the violation messages.
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

        // Add violation message if there is no 'no-valdr-message' attribute on this input field.
        if (angular.isUndefined(attrs.noValdrMessage)) {
          var formField = formController.$name + '.' + fieldName;
          var valdrMessageElement = angular.element('<span valdr-message="' + formField + '"></span>');
          element.after(valdrMessageElement);
          $compile(valdrMessageElement)(scope);
        }
      }
    };
  }])

  /**
  * The valdr-message directive is responsible for the rendering of violation messages. The template used for rendering
  * is defined in the valdrMessage service where it can be overridden or a template URL can be configured.
  */
  .directive('valdrMessage', function (valdrMessage, $rootScope, $injector) {
    return {
      replace: true,
      scope: {
        formField: '=valdrMessage'
      },
      templateUrl: function () {
        return valdrMessage.templateUrl;
      },
      link: function (scope) {

        try {
          var $translate = $injector.get('$translate');
        } catch (error) { /* just ignore if angular-translate is not available */ }

        var updateTranslations = function () {
          if ($translate && scope.violations && scope.violations.length) {
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
