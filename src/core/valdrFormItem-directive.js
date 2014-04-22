/**
 * This directive adds validation to all input and select fields which are bound to an ngModel and are surrounded
 * by a valdrType directive.
 */
var valdrFormItemDirectiveDefinition =
  ['valdrEvents', 'valdr', 'valdrUtil', 'valdrClasses', function (valdrEvents, valdr, valdrUtil, valdrClasses) {
  return  {
    restrict: 'E',
    require: ['?^valdrType', '?^ngModel'],
    link: function (scope, element, attrs, controllers) {

      var valdrTypeController = controllers[0],
        ngModelController = controllers[1],
        fieldName = attrs.name,
        parentElement = element.parent();

      // Stop right here if this is a form item that's either not inside of a valdr-type block
      // or there is no ng-model bound to it.
      if (!valdrTypeController || !ngModelController) {
        return;
      }

      if (valdrUtil.isEmpty(fieldName)) {
        throw new Error('form element is not bound to a field name');
      }

      var updateClassOnParentElement = function(valid) {
        parentElement.addClass(valid ? valdrClasses.valid : valdrClasses.invalid);
        parentElement.removeClass(valid ? valdrClasses.invalid :  valdrClasses.valid);
      };

      var updateNgModelController = function (validationResult) {
        ngModelController.$setValidity('valdr', validationResult.valid);
        ngModelController.valdrViolations = validationResult.violations;
      };

      var validate = function (value) {
        var validationResult = valdr.validate(valdrTypeController.getType(), fieldName, value);
        updateNgModelController(validationResult);
        updateClassOnParentElement(validationResult.valid);
        return validationResult.valid ? value : undefined;
      };

      ngModelController.$parsers.push(validate);
      ngModelController.$formatters.push(validate);

      scope.$on(valdrEvents.revalidate, function () {
        validate(ngModelController.$viewValue);
      });

      element.bind('blur', function () {
        if (ngModelController.$invalid && ngModelController.$dirty) {
          parentElement.addClass(valdrClasses.dirtyBlurred);
        }
      });
    }
  };
}];

angular.module('valdr')
  .directive('input', valdrFormItemDirectiveDefinition)
  .directive('select', valdrFormItemDirectiveDefinition)
  .directive('textarea', valdrFormItemDirectiveDefinition);