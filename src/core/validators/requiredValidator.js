angular.module('valdr')

  .factory('requiredValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'Required',

      /**
       * @param config no config is required for this validator
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (config, value) {
        var valid = valdrUtil.notNull(value);
        return valdrUtil.result(valid, config.message);
      }
    };
  }]);
