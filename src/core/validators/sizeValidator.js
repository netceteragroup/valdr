angular.module('ncaModelValidation')

  .factory('sizeValidator', function (validationUtil) {
    return {
      name: 'javax.validation.constraints.Size',

      /**
       * @param config optional values: min, max
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (config, value) {
        var minLength = config.min || 0,
          maxLength = config.max;

        value = value || '';

        var valid = value.length >= minLength &&
          (maxLength === undefined || value.length <= maxLength);

        var params = { min: minLength, max: maxLength };
        return validationUtil.result(valid, config.message, params);
      }
    };
  });
