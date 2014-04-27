angular.module('valdr')

  .factory('valdrRequiredValidator', ['valdrUtil', function (valdrUtil) {
    return {
      name: 'required',

      /**
       * Checks if the value is not empty.
       *
       * @param value the value to validate
       * @returns {boolean} true if the value is not empty
       */
      validate: function (value) {
        return valdrUtil.notEmpty(value);
      }
    };
  }]);
