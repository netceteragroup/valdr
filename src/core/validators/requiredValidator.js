angular.module('valdr')

  .factory('requiredValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'Required',

      /**
       * Checks if the value is empty.
       * @param config no config is required for this validator
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (config, value) {
        var valid = valdrUtil.notEmpty(value);
        return valdrUtil.result(valid, config.message);
      }
    };
  }]);
