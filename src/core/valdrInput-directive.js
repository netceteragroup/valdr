angular.module('valdr')

  /**
   * This directive adds validation to all input fields which are bound to an ngModel and are surrounded
   * by a valdrType directive.
   */
  .directive('input',
    ['valdrEvents', 'valdr', 'valdrUtil', function (valdrEvents, valdr, valdrUtil) {
    return  {
      restrict: 'E',
      require: ['?^valdrType', '?^ngModel'],
      link: function (scope, element, attrs, controllers) {

        var valdrTypeController = controllers[0],
          ngModelController = controllers[1],
          fieldName = attrs.name;

        // Stop right here if this is an <input> that's either not inside of a valdr-type block
        // or there is no ng-model bound to it.
        if (!valdrTypeController || !ngModelController) {
          return;
        }

        if (valdrUtil.isEmpty(fieldName)) {
          throw new Error('input is not bound to a field name');
        }

        var setValidityAndMessages = function (validationResult) {
          ngModelController.$setValidity('valdr', validationResult.valid);
          ngModelController.valdrMessages = validationResult.messages;
        };

        var validate = function (value) {
          var validationResult = valdr.validate(valdrTypeController.getType(), fieldName, value);
          setValidityAndMessages(validationResult);
          return validationResult.valid ? value : undefined;
        };

        ngModelController.$parsers.push(validate);
        ngModelController.$formatters.push(validate);

        scope.$on(valdrEvents.rulesChanged, function () {
          validate(ngModelController.$viewValue);
        });
      }
    };
  }]);