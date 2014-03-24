angular.module('valdr')

  .factory('sizeValidator', function () {
    return {
      name: 'Size',

      /**
       * @param value the value to validate
       * @param constraint optional values: min, max
       * @returns (object) validation result
       */
      validate: function (value, constraint) {
        var minLength = constraint.min || 0,
          maxLength = constraint.max;

        value = value || '';
        return value.length >= minLength &&
          (maxLength === undefined || value.length <= maxLength);
      }
    };
  });
