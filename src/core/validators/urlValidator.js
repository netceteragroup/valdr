angular.module('valdr')

  .factory('valdrUrlValidator', ['valdrUtil', function (valdrUtil) {

    // the url pattern used in angular.js
    var URL_REGEXP = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;

    return {
      name: 'url',

      /**
       * Checks if the value is a valid url.
       *
       * @param value the value to validate
       * @returns {boolean} true if valid
       */
      validate: function (value) {
        return valdrUtil.isEmpty(value) || URL_REGEXP.test(value);
      }
    };
  }]);
