angular.module('valdr')

  .factory('pastValidator', ['valdrUtil', function (valdrUtil) {

    return {
      name: 'Past',

      /**
       * Checks if the value is a date in the past.
       *
       * @param value the value to validate
       * @returns {boolean} true if empty, null, undefined or a date in the past, false otherwise
       */
      validate: function (value) {
        var valueAsMoment = moment(value);
        var now = moment();
        return valdrUtil.isEmpty(value) || (valueAsMoment.isValid() && valueAsMoment.isBefore(now));
      }
    };
  }]);
