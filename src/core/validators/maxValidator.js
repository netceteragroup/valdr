angular.module('valdr')

  .factory('valdrMaxValidator', ['valdrUtil', function (valdrUtil) {

    return {
      name: 'max',

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

        if (valdrUtil.isNaN(value)) {
          return false;
        }

        return valdrUtil.isEmpty(value) || valueAsNumber <= maxValue;
      }
    };
  }]);
