angular.module('valdr')

  .factory('requiredValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'Required',

      /**
       * Checks if the value is empty.
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (value) {
        return valdrUtil.notEmpty(value);
      }
    };
  }]);
