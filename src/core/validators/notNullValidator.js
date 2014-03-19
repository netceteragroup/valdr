angular.module('ncaModelValidation')

  .factory('notNullValidator', function (validationUtil) {
    return {
      name: 'javax.validation.constraints.NotNull',

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
  });
