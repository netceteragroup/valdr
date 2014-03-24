angular.module('valdr')

  .factory('maxValidator', ['valdrUtil', function (valdrUtil) {


    return {
      name: 'Max',

      /**
       * Checks if the value is a number and lower or equal as the value specified in the constraint.
       *
       * @param value the value to validate
       * @param constraint the validation constraint
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var maxValue = Number(constraint.value),
            valueAsNumber = Number(value);

        return valdrUtil.isEmpty(value) ||
            (!valdrUtil.isNaN(valueAsNumber) && valueAsNumber <= maxValue);
      }
    };
  }]);
