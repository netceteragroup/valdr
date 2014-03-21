angular.module('ncaModelValidation')

  .directive('input', function (ncaModelValidationEvents, ncaValidator) {
    return  {
      restrict: 'E',
      require: ['?^ncaFormType', '?^ngModel'],
      link: function (scope, element, attrs, controllers) {

        var ncaFormTypeController = controllers[0],
          ngModelController = controllers[1],
          fieldName = attrs.name;

        // Stop right here if this is an <input> that's either not inside of a nca-form-type block
        // or there is no ng-model bound to it.
        if (!ncaFormTypeController || !ngModelController) {
          return;
        }

        if (!angular.isString(fieldName) || fieldName.length === 0) {
          throw new Error('input is not bound to a field name');
        }

        var setValidityAndMessages = function (validationResult) {
          ngModelController.$setValidity('ncaValidator', validationResult.valid);
          ngModelController.ncaValidationMessages = validationResult.messages;
        };

        var validate = function (value) {
          var validationResult = ncaValidator.validate(ncaFormTypeController.getType(), fieldName, value);
          setValidityAndMessages(validationResult);
          return validationResult.valid ? value : undefined;
        };

        ngModelController.$parsers.push(validate);
        ngModelController.$formatters.push(validate);

        scope.$on(ncaModelValidationEvents.rulesChanged, function () {
          validate(ngModelController.$viewValue);
        });
      }
    };
  });