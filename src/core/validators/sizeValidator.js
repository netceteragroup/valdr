angular.module('valdr')

  .factory('valdrSizeValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'size',

      /**
       * Checks if the values length is in the range specified by the constraints min and max properties.
       *
       * @param value the value to validate
       * @param constraint with optional values: min, max
       * @returns {boolean} true if valid
       */
      validate: function (value, constraint) {
        var minLength = constraint.min || 0,
          maxLength = constraint.max;

        value = value || '';

        if (valdrUtil.isEmpty(value)) {
          return true;
        }

        return value.length >= minLength &&
          (maxLength === undefined || value.length <= maxLength);
      }
    };
  }]);
