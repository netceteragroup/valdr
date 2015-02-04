/**
 * This directive appends a validation message to the parent element of any input, select or textarea element, which
 * is nested in a valdr-type directive and has an ng-model bound to it.
 * If the form element is wrapped in an element marked with the class defined in valdrClasses.formGroup,
 * the messages is appended to this element instead of the direct parent.
 * To prevent adding messages to specific input fields, the attribute 'valdr-no-message' can be added to those input
 * or select fields. The valdr-message directive is used to do the actual rendering of the violation messages.
 */
var valdrMessageDirectiveDefinition = ['$compile', 'valdrUtil', function ($compile) {
  return  {
    restrict: 'E',
    require: ['?^valdrType', '?^ngModel', '?^valdrFormGroup'],
    link: function (scope, element, attrs, controllers) {

      var valdrTypeController = controllers[0],
        ngModelController = controllers[1],
        valdrFormGroupController = controllers[2],
        valdrNoValidate = attrs.valdrNoValidate,
        valdrNoMessage = attrs.valdrNoMessage,
        fieldName = attrs.name;

      /**
       * Don't do anything if
       * - this is an <input> that's not inside of a valdr-type or valdr-form-group block
       * - there is no ng-model bound to input
       * - there is a 'valdr-no-validate' or 'valdr-no-message' attribute present
       */
      if (!valdrTypeController || !valdrFormGroupController || !ngModelController ||
        angular.isDefined(valdrNoValidate) || angular.isDefined(valdrNoMessage)) {
        return;
      }

      var valdrMessageElement = angular.element('<span valdr-message="' + fieldName + '"></span>');
      $compile(valdrMessageElement)(scope);
      valdrFormGroupController.addMessageElement(ngModelController, valdrMessageElement);

      scope.$on('$destroy', function () {
        valdrFormGroupController.removeMessageElement(ngModelController);
      });

    }
  };
}];

angular.module('valdr')
  .directive('input', valdrMessageDirectiveDefinition)
  .directive('select', valdrMessageDirectiveDefinition)
  .directive('textarea', valdrMessageDirectiveDefinition)

/**
 * The valdr-message directive is responsible for the rendering of violation messages. The template used for rendering
 * is defined in the valdrMessage service where it can be overridden or a template URL can be configured.
 */
  .directive('valdrMessage',
    ['$rootScope', '$injector', 'valdrMessage', function ($rootScope, $injector, valdrMessage) {
      return {
        replace: true,
        restrict: 'A',
        scope: {
          formFieldName: '@valdrMessage'
        },
        templateUrl: function () {
          return valdrMessage.templateUrl;
        },
        require: ['^form'],
        link: function (scope, element, attrs, formController) {

          var updateTranslations = function () {
            if (valdrMessage.translateAvailable && angular.isArray(scope.violations)) {
              angular.forEach(scope.violations, function (violation) {
                var fieldNameKey = violation.type + '.' + violation.field;
                valdrMessage.$translate(fieldNameKey).then(function (translation) {
                  violation.fieldName = translation;
                });
              });
            }
          };

          var watchValdrViolations = function () {
            var formField = formController[0][scope.formFieldName];
            return formField ? formField.valdrViolations : undefined;
          };

          scope.$watch(watchValdrViolations, function (valdrViolations) {
            if (valdrViolations && valdrViolations.length) {
              scope.violations = valdrViolations;
              scope.violation = valdrViolations[0];
              updateTranslations();
            } else {
              scope.violations = undefined;
              scope.violation = undefined;
            }
          });

          $rootScope.$on('$translateChangeSuccess', function () {
            updateTranslations();
          });
        }
      };
    }]);
