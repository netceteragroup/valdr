'use strict';

angular.module('orca.common.validation')
  .directive('input', function (orcaValidator, $compile) {
    return  {
      restrict: 'E',
      require: ['?^orcaFormClass', '?^ngModel', '?^form'],
      link: function (scope, element, attrs, controllers) {

        var formClassController = controllers[0],
          ngModelController = controllers[1],
          formController = controllers[2],
          fieldName = attrs.name;

        // Stop right here if this is an <input> that's either not inside of a orca-form-class block
        // or there is no ng-model bound to it.
        if (!formClassController || !ngModelController) {
          return;
        }

        if (!angular.isString(fieldName) || fieldName.length === 0) {
          throw new Error('orcaFormField is not bound to a field name');
        }

        var setValidityAndMessages = function (validationResult) {
          ngModelController.$setValidity('orcaValidator', validationResult.valid);
          ngModelController.orcaValidationMessages = validationResult.messages;
        };

        var validator = function (value) {
          var validationResult = orcaValidator.validate(formClassController.getClassName(), fieldName, value);
          setValidityAndMessages(validationResult);
          return validationResult.valid ? value : undefined;
        };

        ngModelController.$parsers.push(validator);
        ngModelController.$formatters.push(validator);

        // Add validation message, this could be easily extracted to an optional module in a second 'input' directive.
        if(angular.isUndefined(attrs.noMessage)) {
          var fieldRef = formController.$name + '.' + fieldName;
          var validationMessageMarkup =
            '<div ng-show="' + fieldRef + '.$invalid" orca-form-message="' + fieldRef + '"></div>';
          var validationMessageElement = angular.element(validationMessageMarkup);
          element.after(validationMessageElement);
          $compile(validationMessageElement)(scope);
        }

      }
    };
  });