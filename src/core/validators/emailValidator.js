angular.module('valdr')

  .factory('emailValidator', ['valdrUtil', function (valdrUtil) {

    // the e-mail pattern used in angular.js
    var EMAIL_REGEXP = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;

    return {
      name: 'Email',

      /**
       * Checks if the value is a valid email address.
       * @param value the value to validate
       * @returns (object) validation result
       */
      validate: function (value) {
        return valdrUtil.isEmpty(value) || EMAIL_REGEXP.test(value);
      }
    };
  }]);
