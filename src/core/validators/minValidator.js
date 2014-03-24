angular.module('valdr')

  .factory('minValidator', ['valdrUtil', function (valdrUtil) {


    return {
      name: 'Min',

      /**
       * Checks if the value is a number and higher or equal as the value specified in the constraint.
       *
       * @param value the value to validate
       * @param constraint the validation constraint
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var minValue = Number(constraint.value),
            valueAsNumber = Number(value);

        return valdrUtil.isEmpty(value) ||
            (!valdrUtil.isNaN(valueAsNumber) && valueAsNumber >= minValue);
      }
    };
  }]);
