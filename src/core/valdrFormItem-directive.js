/**
 * This directive adds validation to all input and select fields which are bound to an ngModel and are surrounded
 * by a valdrType directive. To prevent adding validation to specific fields, the attribute 'valdr-no-validate'
 * can be added to those fields.
 */
var valdrFormItemDirectiveDefinition =
  ['valdrEvents', 'valdr', 'valdrUtil', 'valdrClasses', function (valdrEvents, valdr, valdrUtil, valdrClasses) {
    return  {
      restrict: 'E',
      require: ['?^valdrType', '?^ngModel'],
      link: function (scope, element, attrs, controllers) {

        var valdrTypeController = controllers[0],
          ngModelController = controllers[1],
          valdrNoValidate = attrs.valdrNoValidate,
          fieldName = attrs.name,
          formGroupElement;

        /*
         Stop right here :
         - if this is an <input> that's not inside of a valdr-type block
         - if there is no ng-model bound to input
         - if there is 'valdr-no-validate' attribute present
         */
        if (!valdrTypeController || !ngModelController || angular.isDefined(valdrNoValidate)) {
          return;
        }

        if (valdrUtil.isEmpty(fieldName)) {
          throw new Error('form element is not bound to a field name');
        }

        formGroupElement = valdrUtil.findWrappingFormGroup(element);

        var updateClassOnFormGroup = function (valid) {
          formGroupElement.toggleClass(valdrClasses.valid, valid);
          formGroupElement.toggleClass(valdrClasses.invalid, !valid);
        };

        var updateNgModelController = function (validationResult) {
          angular.forEach(validationResult.validationResults, function (result) {
            var validatorToken = valdrUtil.validatorNameToToken(result.validator);
            ngModelController.$setValidity(validatorToken, result.valid);
          });
          ngModelController.$setValidity('valdr', validationResult.valid);
          ngModelController.valdrViolations = validationResult.violations;
        };

        var validate = function (modelValue) {
          var validationResult = valdr.validate(valdrTypeController.getType(), fieldName, modelValue);
          updateNgModelController(validationResult);
          updateClassOnFormGroup(validationResult.valid);
          return validationResult.valid;
        };

        ngModelController.$validators.valdr = validate;

        scope.$on(valdrEvents.revalidate, function () {
          validate(ngModelController.$modelValue);
        });

        element.bind('blur', function () {
          if (ngModelController.$invalid && ngModelController.$dirty) {
            formGroupElement.addClass(valdrClasses.dirtyBlurred);
          }
        });
      }
    };
  }];

angular.module('valdr')
  .directive('input', valdrFormItemDirectiveDefinition)
  .directive('select', valdrFormItemDirectiveDefinition)
  .directive('textarea', valdrFormItemDirectiveDefinition);