angular.module('ncaModelValidation')

  .factory('requiredValidator', ['validationUtil', function (validationUtil) {
    return {
      name: 'Required',

      /**
       * @param config no config is required for this validator
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (config, value) {
        var valid = validationUtil.notNull(value);
        return validationUtil.result(valid, config.message);
      }
    };
  }]);
