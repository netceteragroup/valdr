/**
 * This directive appends a validation message to the parent element of any input, select or textarea element, which
 * is nested in a valdr-type directive and has an ng-model bound to it.
 * If the form element is wrapped in an element marked with the class defined in valdrClasses.formGroup,
 * the messages is appended to this element instead of the direct parent.
 * To prevent adding messages to specific input fields, the attribute 'valdr-no-message' can be added to those input
 * or select fields. The valdr-message directive is used to do the actual rendering of the violation messages.
 */
var valdrMessageDirectiveDefinitionFactory = function (restrict) {
    return ['$compile', function ($compile) {
      return {
        restrict: restrict,
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
  },
  valdrMessageElementDirectiveDefinition = valdrMessageDirectiveDefinitionFactory('E'),
  valdrMessageAttributeDirectiveDefinition = valdrMessageDirectiveDefinitionFactory('A');


var nullValdrType = {
  getType: angular.noop
};

angular.module('valdr')
  .directive('input', valdrMessageElementDirectiveDefinition)
  .directive('select', valdrMessageElementDirectiveDefinition)
  .directive('textarea', valdrMessageElementDirectiveDefinition)
  .directive('enableValdrMessage', valdrMessageAttributeDirectiveDefinition)

/**
 * The valdr-message directive is responsible for the rendering of violation messages. The template used for rendering
 * is defined in the valdrMessage service where it can be overridden or a template URL can be configured.
 */
  .directive('valdrMessage',
  ['$rootScope', '$injector', 'valdrMessage', 'valdrUtil', function ($rootScope, $injector, valdrMessage, valdrUtil) {
    return {
      replace: true,
      restrict: 'A',
      scope: {
        formFieldName: '@valdrMessage'
      },
      templateUrl: function () {
        return valdrMessage.templateUrl;
      },
      require: ['^form', '?^valdrType'],
      link: function (scope, element, attrs, controllers) {
        var formController = controllers[0],
          valdrTypeController = controllers[1] || nullValdrType;

        var updateTranslations = function () {
          if (valdrMessage.translateAvailable && angular.isArray(scope.violations)) {
            angular.forEach(scope.violations, function (violation) {
              valdrMessage.$translate(valdrMessage.fieldNameKeyGenerator(violation)).then(function (translation) {
                violation.fieldName = translation;
              });
            });
          }
        };

        var createViolation = function (validatorName) {
          var typeName = valdrTypeController.getType(),
            fieldName = scope.formFieldName;

          return {
            type: typeName,
            field: fieldName,
            validator: validatorName,
            message: valdrMessage.getMessage(typeName, fieldName, validatorName)
          };
        };

        var addViolationsToScope = function () {
          scope.violations = [];

          angular.forEach(scope.formField.valdrViolations, function (violation) {
            scope.violations.push(violation);
          });

          if (valdrMessage.angularMessagesEnabled) {
            angular.forEach(scope.formField.$error, function (isValid, validatorName) {
              if (!valdrUtil.startsWith(validatorName, 'valdr')) {
                scope.violations.push(createViolation(validatorName));
              }
            });
          }

          scope.violation = scope.violations[0];
          updateTranslations();
        };
        var removeViolationsFromScope = function () {
          scope.violations = undefined;
          scope.violation = undefined;
        };

        var watchFormFieldErrors = function () {
          scope.formField = formController[scope.formFieldName];
          if (scope.formField) {
            return {
              valdr: scope.formField.valdrViolations,
              error: scope.formField.$error
            };
          }
        };


        scope.$watch(watchFormFieldErrors, function () {
          if (scope.formField && scope.formField.$invalid) {
            addViolationsToScope();
          } else {
            removeViolationsFromScope();
          }
        }, true);

        var unregisterTranslateChangeHandler = $rootScope.$on('$translateChangeSuccess', function () {
          updateTranslations();
        });

        scope.$on('$destroy', function () {
          unregisterTranslateChangeHandler();
        });
      }
    };
  }]);
