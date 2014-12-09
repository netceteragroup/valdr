/**
 * This directive adds validation to all input and select fields which are bound to an ngModel and are surrounded
 * by a valdrType directive. To prevent adding validation to specific fields, the attribute 'valdr-no-validate'
 * can be added to those fields.
 */
var valdrFormItemDirectiveDefinition =
  ['valdrEvents', 'valdr', 'valdrUtil', 'valdrClasses', function (valdrEvents, valdr, valdrUtil) {
    return  {
      restrict: 'E',
      require: ['?^valdrType', '?^ngModel', '?^valdrFormGroup'],
      link: function (scope, element, attrs, controllers) {

        var valdrTypeController = controllers[0],
          ngModelController = controllers[1],
          valdrFormGroupController = controllers[2],
          valdrNoValidate = attrs.valdrNoValidate,
          fieldName = attrs.name;

        /**
         * Don't do anything if
         * - this is an <input> that's not inside of a valdr-type block
         * - there is no ng-model bound to input
         * - there is the 'valdr-no-validate' attribute present
         */
        if (!valdrTypeController || !ngModelController || angular.isDefined(valdrNoValidate)) {
          return;
        }

        if (valdrFormGroupController) {
          valdrFormGroupController.addFormItem(ngModelController);
        }

        if (valdrUtil.isEmpty(fieldName)) {
          throw new Error('Form element with ID "' + attrs.id + '" is not bound to a field name.');
        }

        var updateNgModelController = function (validationResult) {
          // set validity state for individual validators
          angular.forEach(validationResult.validationResults, function (result) {
            var validatorToken = valdrUtil.validatorNameToToken(result.validator);
            ngModelController.$setValidity(validatorToken, result.valid);
          });

          // set overall validity state of this form item
          ngModelController.$setValidity('valdr', validationResult.valid);
          ngModelController.valdrViolations = validationResult.violations;
        };

        var validate = function (modelValue) {
          var validationResult = valdr.validate(valdrTypeController.getType(), fieldName, modelValue);
          updateNgModelController(validationResult);
          return validationResult.valid;
        };

        ngModelController.$validators.valdr = validate;

        scope.$on(valdrEvents.revalidate, function () {
          validate(ngModelController.$modelValue);
        });

        scope.$on('$destroy', function () {
          if (valdrFormGroupController) {
            valdrFormGroupController.removeFormItem(ngModelController);
          }
        });

      }
    };
  }];

angular.module('valdr')
  .directive('input', valdrFormItemDirectiveDefinition)
  .directive('select', valdrFormItemDirectiveDefinition)
  .directive('textarea', valdrFormItemDirectiveDefinition);