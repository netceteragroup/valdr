angular.module('valdr')

  .factory('sizeValidator', function () {
    return {
      name: 'Size',

      /**
       * @param value the value to validate
       * @param config optional values: min, max
       * @returns (object) validation result
       */
      validate: function (value, config) {
        var minLength = config.min || 0,
          maxLength = config.max;

        value = value || '';
        return value.length >= minLength &&
          (maxLength === undefined || value.length <= maxLength);
      }
    };
  });
